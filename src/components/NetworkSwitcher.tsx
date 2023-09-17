import { Box, Button, Flex, InfoIcon, Text, UserMenu, UserMenuDivider, UserMenuItem, useTooltip } from 'uikit'
import { useActiveChainId, useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useNetworkConnectorUpdater } from 'hooks/useActiveWeb3React'
import { useSessionChainId } from 'hooks/useSessionChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { memo } from 'react'
import { chains } from 'utils/wagmi'
import { useNetwork } from 'wagmi'
import { useTranslation } from 'contexts/Localization'
import { CHAINS_MAP } from 'sdk'
import { CHAIN_ID } from 'utils/getRpcUrl'
import { ChainLogo } from './Logo'

const NetworkSelect = ({ switchNetwork, chainId }) => {
  const { t } = useTranslation()
  return (
    <>
      <Box px="16px" py="8px">
        <Text color="textSubtle">{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains
        .filter((chain) => !chain.testnet || chain.id === chainId)
        .map((chain) => (
          <UserMenuItem
            key={chain.id}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => chain.id !== chainId && switchNetwork(chain.id)}
          >
            <ChainLogo chainId={chain.id} />
            <Text color={chain.id === chainId ? 'primary' : 'text'} bold={chain.id === chainId} pl="12px">
              {chain.name}
            </Text>
          </UserMenuItem>
        ))}
    </>
  )
}

const WrongNetworkSelect = ({ switchNetwork, chainId }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'The URL you are accessing (Chain id: %chainId%) belongs to %network%; mismatching your wallet’s network. Please switch the network to continue.',
      {
        chainId,
        network: chains.find((c) => c.id === chainId)?.name ?? 'Unknown network',
      },
    ),
    {
      placement: 'auto-start',
    },
  )
  const { chain } = useNetwork()
  const localChainId = useLocalNetworkChain() || CHAIN_ID
  const [, setSessionChainId] = useSessionChainId()

  const localChainName = chains.find((c) => c.id === localChainId)?.name ?? 'BSC'

  // const [ref1, isHover] = useHover<HTMLButtonElement>()

  return (
    <>
      <Flex ref={targetRef} alignItems="center" px="16px" py="8px">
        <InfoIcon color="textSubtle" />
        <Text color="textSubtle" pl="6px">
          {t('Please switch network')}
        </Text>
      </Flex>
      {tooltipVisible && tooltip}
      <UserMenuDivider />
      {chain && (
        <UserMenuItem onClick={() => setSessionChainId(chain.id)} style={{ justifyContent: 'flex-start' }}>
          <ChainLogo chainId={chain.id} />
          <Text color="secondary" bold pl="12px">
            {chain.name}
          </Text>
        </UserMenuItem>
      )}

      <UserMenuItem onClick={() => switchNetwork(localChainId)} style={{ justifyContent: 'flex-start' }}>
        <ChainLogo chainId={localChainId} />
        <Text pl="12px">{localChainName}</Text>
      </UserMenuItem>
      <Button mx="16px" my="8px" scale="sm" onClick={() => switchNetwork(localChainId)}>
        {t('Switch network in wallet')}
      </Button>
    </>
  )
}

const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const { chainId, isWrongNetwork, isNotMatched } = useActiveChainId()
  const { isLoading, canSwitch, switchNetworkAsync } = useSwitchNetwork()

  useNetworkConnectorUpdater()

  // const foundChain = useMemo(
  //   () => chains.find((c) => c.id === (isLoading ? pendingChainId || chainId : chainId)),
  //   [isLoading, pendingChainId, chainId],
  // )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Unable to switch network. Please try it on your wallet'),
    { placement: 'auto', disablePortal: true },
  )

  const cannotChangeNetwork = !canSwitch

  if (!chainId) {
    return null
  }
  return (
    <Box ref={cannotChangeNetwork ? targetRef : null} height="100%">
      {cannotChangeNetwork && tooltipVisible && tooltip}
      <UserMenu
        placement="bottom"
        variant={isLoading ? 'pending' : isWrongNetwork ? 'danger' : 'default'}
        avatarSrc={CHAINS_MAP[chainId]?.chainLogoUrl}
        disabled={cannotChangeNetwork}
        text={CHAINS_MAP[chainId]?.shortName}
        px="12px"
      >
        {() =>
          isNotMatched ? (
            <WrongNetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} />
          ) : (
            <NetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} />
          )
        }
      </UserMenu>
    </Box>
  )
}

export default memo(NetworkSwitcher)
