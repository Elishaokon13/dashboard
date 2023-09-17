import { useCurrency } from 'hooks/Tokens'
import React from 'react'
import { useIsPinned, usePinnedTokens } from 'state/user/hooks'
import { Button, CloseIcon, Flex, IconButton, PencilIcon, Text } from 'uikit'
import { CurrencyLogo } from './Logo'
import { Currency, ETHER } from 'sdk'

type PinTokenProps = {
  address: string
  canEdit: boolean
  handleCurrencySelect: (currency: Currency) => void
}

const PinToken = React.memo(({ address, canEdit, handleCurrencySelect }: PinTokenProps) => {
  const token = useCurrency(address)
  const [, togglePin] = useIsPinned(token?.chainId, token?.address)
  if (!token) return null
  return (
    <Button
      m="0.25rem"
      px="0.5rem"
      variant="tertiary"
      color="white"
      scale="sm"
      onClick={() => {
        handleCurrencySelect(address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ? ETHER[token.chainId] : token)
      }}
      startIcon={<CurrencyLogo currency={token} />}
    >
      <Text ml="0.5rem" color="text">
        {token?.symbol}
      </Text>
      {canEdit && togglePin && (
        <IconButton
          variant="text"
          scale="sm"
          onClick={(e) => {
            togglePin(token.chainId, token.address)
            e.stopPropagation()
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </Button>
  )
})

const PinTokenContainer = React.memo(
  ({ handleCurrencySelect }: { handleCurrencySelect: (currency: Currency) => void }) => {
    const [edit, canEdit] = React.useState(false)

    const [pinnedTokens, nonMapped] = usePinnedTokens()

    return (
      <Flex alignItems="center" flexWrap="wrap">
        {pinnedTokens.map((token, i) => (
          <PinToken key={i} address={token} canEdit={edit} handleCurrencySelect={handleCurrencySelect} />
        ))}
        {nonMapped?.length > 0 && (
          <IconButton variant="text" scale="sm" onClick={() => canEdit(!edit)}>
            <PencilIcon />
          </IconButton>
        )}
      </Flex>
    )
  },
)

export default PinTokenContainer
