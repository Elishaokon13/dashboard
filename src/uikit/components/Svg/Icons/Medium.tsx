import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 59 59" {...props}>
      <g id="Group_90" data-name="Group 90" transform="translate(0.459)">
        <g id="Group_87" data-name="Group 87" transform="translate(0 0)">
          <circle
            id="Ellipse_12"
            data-name="Ellipse 12"
            cx="29.5"
            cy="29.5"
            r="29.5"
            transform="translate(-0.459)"
            fill={props.color}
          />
        </g>
        <path
          id="medium"
          d="M19.9,15.2A9.951,9.951,0,1,1,9.951,5.18,9.995,9.995,0,0,1,19.9,15.2Zm10.906,0c0,5.2-2.219,9.436-4.968,9.436s-4.983-4.233-4.983-9.436,2.234-9.436,4.983-9.436S30.808,10,30.808,15.2m4.468,0c0,4.659-.779,8.452-1.749,8.452s-1.749-3.792-1.749-8.452.779-8.452,1.749-8.452S35.276,10.545,35.276,15.2Z"
          transform="translate(11.759 14.192)"
          fill="#4b8077"
        />
      </g>
    </Svg>
  )
}

export default Icon
