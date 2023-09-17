import { Text } from 'uikit'
import styled from 'styled-components'
import { baseColors } from 'uikit/theme/colors'

const GradientText = styled(Text)`
  background: ${baseColors.limitlessBlue};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export default GradientText
