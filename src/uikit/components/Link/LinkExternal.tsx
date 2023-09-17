import React from 'react'
import Link from './Link'
import { LinkProps } from './types'
import OpenNewIcon from '../Svg/Icons/OpenNew'

const iconStyle = { verticalAlign: 'sub' }
const LinkExternal: React.FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link external {...props}>
      {children}
      <OpenNewIcon style={iconStyle} color={props.color ? props.color : 'primary'} ml="4px" />
    </Link>
  )
}

export default LinkExternal
