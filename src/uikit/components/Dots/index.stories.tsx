import React from 'react'
import Dots from './index'

export default {
  title: 'Components/Dots',
  component: Dots,
}

export const Default = (args) => {
  return <Dots {...args} />
}

Default.args = {
  color: 'primary',
  position: 'absolute',
  count: 36,
  size: '160px',
  top: '100px',
  left: '100px',
}
