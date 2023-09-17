import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 41.071 50" {...props}>
      <g id="gift-icon" transform="translate(-906 -3051.933)">
        <g id="shield" transform="translate(910.464 3039.933)">
          <g id="Group_54" data-name="Group 54" transform="translate(-4.464 12)">
            <path
              id="Path_69"
              data-name="Path 69"
              d="M85.709,11.475,66.838.235a1.663,1.663,0,0,0-1.7,0L46.265,11.475a1.667,1.667,0,0,0-.814,1.432v6.417c0,13.515,7.8,25.859,19.935,30.563a1.663,1.663,0,0,0,1.2,0C78.694,45.2,86.522,32.878,86.522,19.325V12.908A1.667,1.667,0,0,0,85.709,11.475Zm-11.5,9.78L63.778,31.7a1.663,1.663,0,0,1-2.354,0l-3.661-3.666a1.666,1.666,0,0,1,2.354-2.357L62.6,28.166,71.857,18.9a1.666,1.666,0,0,1,2.354,2.357Z"
              transform="translate(-45.451 0)"
              fill={props.color}
            />
          </g>
        </g>
      </g>
    </Svg>
  )
}

export default Icon
