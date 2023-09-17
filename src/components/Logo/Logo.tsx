import React, { useState } from 'react'
import { HelpIcon, WarningIcon } from 'uikit'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcs: string[]
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: React.FC<LogoProps> = ({ srcs, alt, ...rest }) => {
  const [, refresh] = useState<number>(0)
  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s])
  if (src) {
    return (
      <img
        {...rest}
        key={src}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }
  return <WarningIcon {...rest} />
}

export default React.memo(Logo)
