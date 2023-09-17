import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 64 48" {...props}>
      <path
        id="Icon_awesome-chart-area"
        data-name="Icon awesome-chart-area"
        d="M62.5,44.5A1.5,1.5,0,0,1,64,46v5a1.5,1.5,0,0,1-1.5,1.5H1.5A1.5,1.5,0,0,1,0,51V6A1.5,1.5,0,0,1,1.5,4.5h5A1.5,1.5,0,0,1,8,6V44.5ZM46.588,16.438,36,23.5,25.338,9.288a1.5,1.5,0,0,0-2.488.125L12,27.5v13H60L48.763,17.025a1.5,1.5,0,0,0-2.175-.588Z"
        transform="translate(0 -4.5)"
        fill={props.color}
      />
    </Svg>
  )
}

export default Icon
