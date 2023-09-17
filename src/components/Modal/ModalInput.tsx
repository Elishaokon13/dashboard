import React from 'react'
import styled from 'styled-components'
import { Text, Button, Input, Flex, Link } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { parseUnits } from '@ethersproject/units'
import { formatBigNumber } from 'utils/formatBalance'

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
  decimals?: number
}

const StyledInput = styled(Input)`
  margin: 0 8px;
  padding: 0 8px;
  margin-right: 2em;
  margin-left: 0;
`

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle = 'stake',
  decimals = 18,
}) => {
  const { t } = useTranslation()
  const isBalanceZero = max === '0' || !max

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0'
    }

    const balanceUnits = parseUnits(balance, decimals)
    return formatBigNumber(balanceUnits, 3, decimals)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Flex justifyContent="space-between">
        <Text fontSize="14px" color="secondary" bold>
          {inputTitle} {symbol}
        </Text>
        <Text fontSize="14px">{t('Balance: %balance%', { balance: displayBalance(max) })}</Text>
      </Flex>
      <StyledInput
        isWarning={isBalanceZero}
        pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
        inputMode="decimal"
        step="any"
        min="0"
        onChange={onChange}
        placeholder="0"
        value={value}
      />
      <Flex justifyContent="flex-end">
        <Button scale="xs" variant="secondary" mt="1em" onClick={onSelectMax} mr="8px">
          {t('MAX')}
        </Button>
      </Flex>

      {isBalanceZero && (
        <Text fontSize="14px" color="failure">
          {t(`No tokens to ${inputTitle.toLowerCase()}`)}
          {addLiquidityUrl && (
            <>
              : (
              <Link fontSize="14px" bold={false} href={addLiquidityUrl} external color="failure">
                {t('Get %symbol%', { symbol })}
              </Link>
              )
            </>
          )}
        </Text>
      )}
    </div>
  )
}

export default ModalInput
