import Image from 'next/image'
import { isChainSupported } from 'utils/wagmi'
import { memo } from 'react'
import { Box, HelpIcon } from 'uikit'
import { CHAINS_MAP } from 'sdk'

const ChainLogo = memo(({ chainId, width = 24, height = 24 }: { chainId: number; width?: number; height?: number }) => {
  if (isChainSupported(chainId)) {
    return (
      <Box maxHeight={height}>
        <Image
          style={{ borderRadius: '100%' }}
          alt={`chain-${chainId}`}
          src={CHAINS_MAP[chainId]?.chainLogoUrl}
          width={width}
          height={height}
          unoptimized
        />
      </Box>
    )
  }

  return <HelpIcon width={width} height={height} />
})
export default ChainLogo
