import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text } from 'uikit'
import { useWeb3React } from 'wagmiUtil'
import tokens from 'config/constants/tokens'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import React from 'react'
import { getBscScanLink } from 'utils'
import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { ChainId, ETHER } from 'sdk'
import { useUnstoppableDomain } from 'hooks/useUnstoppableDomain'
import { useShowAccountDomain } from 'state/user/hooks'
import CopyAddress from './CopyAddress'
import { CHAIN_ID } from 'utils/getRpcUrl'

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account, chainId } = useWeb3React()
  const domain = useUnstoppableDomain(account)
  const [showDomain, setShowDomain] = useShowAccountDomain()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useTokenBalance(tokens.lnt.address)
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss()
    logout()
  }

  const etherSymbol = ETHER[chainId].symbol

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" flexDirection="row" mb="8px">
        <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold">
          {t(domain && showDomain ? 'Your Domain' : 'Your Address')}
        </Text>
        {domain && (
          <Button
            scale="xs"
            variant="subtle"
            onClick={() => {
              setShowDomain(!showDomain)
            }}
          >
            Show {showDomain ? 'address' : 'domain'}
          </Button>
        )}
      </Flex>
      <CopyAddress account={domain && showDomain ? domain : account} mb="24px" />
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{t(`${etherSymbol} Balance Low`)}</Text>
            <Text as="p">{t(`You need ${etherSymbol} for transaction fees.`)}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t(`${etherSymbol} Balance`)}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(balance, 6)}</Text>
        )}
      </Flex>
      {chainId === CHAIN_ID && (
        <Flex alignItems="center" justifyContent="space-between" mb="24px">
          <Text color="textSubtle">{t('Token Balance')}</Text>
          {cakeFetchStatus !== FetchStatus.Fetched ? (
            <Skeleton height="22px" width="60px" />
          ) : (
            <Text>{getFullDisplayBalance(cakeBalance, 18, 3)}</Text>
          )}
        </Flex>
      )}
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address', chainId)}>{t(`View on Scan`)}</LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
