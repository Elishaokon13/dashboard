import { CHAIN_ID } from 'config/constants/networks'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import ILimitlessFactoryABI from 'config/abi/ILimitlessFactory.json'
import { simpleRpcProvider } from 'utils/providers'
import { ILimitlessFactory } from 'config/abi/types/ILimitlessFactory'
import limitlessAddress from 'config/constants/limitlessAddresses'
import { FACTORY_ADDRESS_MAP, INIT_CODE_HASH_MAP } from '../multichain'
import { Price } from './fractions/price'
import { TokenAmount } from './fractions/tokenAmount'
import { BigintIsh, MINIMUM_LIQUIDITY, ZERO, ONE, FIVE, FEES_NUMERATOR, FEES_DENOMINATOR, ChainId } from '../constants'
import { sqrt, parseBigintIsh } from '../utils'
import { InsufficientReservesError, InsufficientInputAmountError } from '../errors'
import { Token } from './token'

const PAIR_ADDRESS_CACHE: { [key: string]: string } = {}

const composeKey = (token0: Token, token1: Token) => `${token0.chainId}-${token0.address}-${token1.address}`

const chainId = parseInt(CHAIN_ID, 10)

const PRE_MAP_LP = {
  // BNB-LNT LP from limitless pool
  '56-0x0e2114955023B736fa97D9E2FCDe2836d10b7A5C-0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c':
    '0x58b1Be5e87e57230C50Ed315E9A48b15f0eD8108',
}
export class Pair {
  public readonly liquidityToken: Token

  private readonly tokenAmounts: [TokenAmount, TokenAmount]

  public static getAddress(tokenA: Token, tokenB: Token): string {
    /**
     * get token pair address workflow:
     *
     * Anyway...for each mapping again:
     * getCreate2Address(FACTORY_ADDRESS, keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])], INIT_CODE_HASH_ADDRESS)
     * With our factory address and our init code...
     * If this returns 0x0000000000000000000000000000000000000000 then same call with their factory and their init code
     * And then call the getReserve...again using ILimitlessPair/IPancakePair depending if the first result is 0x0000000000000000000000000000000000000000 or not
     * - Danny
     *
     */

    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

    const key = composeKey(token0, token1)

    if (PAIR_ADDRESS_CACHE?.[key] === undefined) {
      let address: string = PRE_MAP_LP[key]
      // if (tokenA.chainId === ChainId.BSC && !priorityPancakePair.has(`${token0.symbol}-${token1.symbol}`)) {
      //   try {
      //     // call limitless factory to grab pair address
      //     address = await LimitlessFactoryContract.getPair(token0.address, token1.address)
      //     console.log(key, token0.name, token1.name, address)
      //   } catch (e) {
      //     console.error(e)
      //   }
      // }
      // if pair address is undefined or is 0, generate address use pancake local factory and init code
      if (!address || address === '0x0000000000000000000000000000000000000000') {
        address = getCreate2Address(
          FACTORY_ADDRESS_MAP[token0.chainId],
          keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
          INIT_CODE_HASH_MAP[token0.chainId],
        )
      }
      PAIR_ADDRESS_CACHE[key] = address
    }

    return PAIR_ADDRESS_CACHE[key]
  }

  public constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount, pairAddress: string) {
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    this.liquidityToken = new Token(tokenAmounts[0].token.chainId, pairAddress, 18, 'BRG.X-LP', 'Limitless LPs')

    this.tokenAmounts = tokenAmounts as [TokenAmount, TokenAmount]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price {
    return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price {
    return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): ChainId {
    return this.token0.chainId
  }

  public get token0(): Token {
    return this.tokenAmounts[0].token
  }

  public get token1(): Token {
    return this.tokenAmounts[1].token
  }

  public get reserve0(): TokenAmount {
    return this.tokenAmounts[0]
  }

  public get reserve1(): TokenAmount {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: Token): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(inputAmount.token), 'TOKEN')
    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.token)
    const outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.raw, FEES_NUMERATOR)
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.raw, FEES_DENOMINATOR), inputAmountWithFee)
    const outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator),
    )
    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return [
      outputAmount,
      new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.liquidityToken.address),
    ]
  }

  public getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(outputAmount.token), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.token)
    const inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), FEES_DENOMINATOR)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), FEES_NUMERATOR)
    const inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE),
    )
    return [
      inputAmount,
      new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), this.liquidityToken.address),
    ]
  }

  public getLiquidityMinted(
    totalSupply: TokenAmount,
    tokenAmountA: TokenAmount,
    tokenAmountB: TokenAmount,
  ): TokenAmount {
    invariant(totalSupply.token.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1), 'TOKEN')

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY)
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return new TokenAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: TokenAmount,
    liquidity: TokenAmount,
    feeOn: boolean = false,
    kLast?: BigintIsh,
  ): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.token.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.token.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw), 'LIQUIDITY')

    let totalSupplyAdjusted: TokenAmount
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = parseBigintIsh(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return new TokenAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw),
    )
  }
}
