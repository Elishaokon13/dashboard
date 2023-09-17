import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28" {...props}>
      <g id="Component_3_20" data-name="Component 3 – 20" transform="translate(2 2)">
        <g id="Ellipse_9" data-name="Ellipse 9" fill={props.color} stroke={props.color} strokeWidth="2">
          <circle cx="12" cy="12" r="12" stroke="none" />
          <circle cx="12" cy="12" r="13" fill="none" />
        </g>
        <path
          id="check"
          d="M13,6,6.812,12,4,9.272"
          transform="translate(3.5 3.001)"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </g>{' '}
    </Svg>
  )
}

export default Icon
