import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 64 56.889" {...props}>
      <path
        id="Icon_awesome-gem"
        data-name="Icon awesome-gem"
        d="M53.944,0,64,17.778H52.767L45.078,0ZM39.722,0l7.689,17.778H16.589L24.278,0ZM10.056,0h8.867L11.233,17.778H0ZM0,21.333H11.189L24.856,49.3a.337.337,0,0,1-.556.367Zm16.467,0H47.533L32.311,56.689a.333.333,0,0,1-.611,0ZM39.144,49.3,52.811,21.333H64L39.7,49.656a.333.333,0,0,1-.556-.356Z"
        fill={props.color}
      />
    </Svg>
  )
}

export default Icon
