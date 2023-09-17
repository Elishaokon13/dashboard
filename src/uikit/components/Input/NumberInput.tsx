import React from 'react'
import NumberFormat from 'react-number-format'
import Input from './Input'
import { NumberInputProps } from './types'

/**
 *
 * Use to create number input
 *
 * A wrapper compoent for react-number-format
 * For more react-number-format setting, visit
 * https://github.com/s-yadav/react-number-format
 *
 */
const NumberTextField: React.FC<NumberInputProps> = (props) => {
  return <NumberFormat customInput={Input} inputMode="decimal" {...props} />
}
export default NumberTextField
