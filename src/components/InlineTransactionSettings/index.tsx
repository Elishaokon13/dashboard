import { useTranslation } from 'contexts/Localization'
import { RowBetween } from 'components/Layout/Row'
import { Flex, Input, Slider, Text, useModal } from 'uikit'
import QuestionHelper from 'components/QuestionHelper'
import styled from 'styled-components'
import { useUserSlippageConfirm, useUserSlippageTolerance } from 'state/user/hooks'
import { memo, useState, useEffect, useRef, useMemo } from 'react'
import { escapeRegExp } from 'utils'
import SlippageWarningModal from './SlippageWarningModal'

const Label = styled(Text)`
  font-size: 12px;
  display: flex;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const sliderSteps: number[] = [
  0.1, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
]

const InlineTransactionSettings = () => {
  const [totalUserSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  const [slippageConfirm, setSlippageConfirm] = useUserSlippageConfirm()

  // limitless: custom slippage, - 3% from the total.
  const userSlippageTolerance = totalUserSlippageTolerance
  const percentSlippage = userSlippageTolerance / 100
  const [slippageInput, setSlippageInput] = useState(percentSlippage.toFixed(2))

  const [onSlippageWarningModal] = useModal(
    useMemo(() => <SlippageWarningModal setSlippageConfirm={setSlippageConfirm} />, [setSlippageConfirm]),
    false,
  )

  const { t } = useTranslation()

  const timeoutRef = useRef(null)

  const slippageInputRef = useRef(null)

  useEffect(() => {
    // show slippage warning modal if user did not confirm and slippage is > 3%
    if (userSlippageTolerance >= 300 && !slippageConfirm) {
      timeoutRef.current = setTimeout(() => {
        onSlippageWarningModal()
      }, 300) // 0.3 sec delay to avoid accidentally set
    }

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [userSlippageTolerance, slippageConfirm, onSlippageWarningModal])

  const slippageInputIsValid =
    slippageInput === '' || percentSlippage.toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat <= 10000) {
          // max 100%
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  const sliderIndex = useMemo(() => {
    let roundedSlippage = percentSlippage
    if (percentSlippage < 0.25) {
      roundedSlippage = 0.1
    } else if (percentSlippage < 0.75) {
      roundedSlippage = 0.5
    } else {
      roundedSlippage = Math.round(percentSlippage)
    }
    const max = sliderSteps[sliderSteps.length - 1]
    return roundedSlippage > max ? sliderSteps.length - 1 : sliderSteps.indexOf(roundedSlippage)
  }, [percentSlippage])

  return (
    <>
      <RowBetween align="center">
        <Label>
          {t('Slippage tolerance')}{' '}
          <QuestionHelper
            color="secondary"
            text={t(
              'Setting your slippage tolerance too high might leave you susceptible to paying more per token than you intended. We recommend that you only increase this when your transaction is not succeeding.',
            )}
            placement="top-start"
            ml="4px"
          />
        </Label>
        <Flex alignItems="center">
          <Input
            scale="sm"
            aria-label="Slippage Input"
            ref={slippageInputRef}
            inputMode="decimal"
            style={{ padding: '0 6px', textAlign: 'right', height: '28px', width: '60px' }}
            pattern="^[0-9]*[.,]?[0-9]{0,2}$"
            value={slippageInput}
            onBlur={() => {
              parseCustomSlippage(percentSlippage.toFixed(2))
            }}
            onChange={(event) => {
              if (event.currentTarget.validity.valid) {
                parseCustomSlippage(event.target.value.replace(/,/g, '.'))
              }
            }}
            isWarning={!slippageInputIsValid}
            isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
          />
          <Text color="secondary" bold ml="8px">
            %
          </Text>
        </Flex>
      </RowBetween>
      <RowBetween mb="12px">
        <Slider
          width="100%"
          name="slippageSlider"
          aria-label="Slippage Slider"
          min={0}
          max={sliderSteps.length - 1}
          step={1}
          valueLabel={sliderIndex === -1 ? undefined : `${slippageInput}%`}
          value={sliderIndex === -1 ? 0 : sliderIndex}
          onValueChanged={(i) => {
            slippageInputRef.current.blur()
            const val = sliderSteps[i]
            if (val) {
              const newSlippage = val * 100
              if (userSlippageTolerance !== newSlippage) {
                setUserSlippageTolerance(newSlippage)
                setSlippageInput(val.toFixed(2))
              }
            }
          }}
        />
      </RowBetween>
    </>
  )
}

export default memo(InlineTransactionSettings)
