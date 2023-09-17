import React from 'react'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import Text from '../Text/Text'
import { LinkProps } from './types'

const Link: React.FC<LinkProps> = ({ external, ...props }) => {
  const internalProps = external ? getExternalLinkProps() : {}
  return <Text as="a" bold aria-label="Links" {...internalProps} {...props} />
}

Link.defaultProps = {
  color: 'primary',
}

export default Link
