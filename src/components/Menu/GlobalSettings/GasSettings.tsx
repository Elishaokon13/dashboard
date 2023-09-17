import { Flex, Button, Text } from 'uikit'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { useGasPriceManager } from 'state/user/hooks'
import styled from 'styled-components'
import { useActiveChainId } from '../../../hooks/useActiveChainId'
import { useAllGasPrices } from '../../../state/user/hooks/index'

const GasSettings = () => {
  const { t } = useTranslation()
  const [selectedGas, setGasPrice] = useGasPriceManager()
  const gases = useAllGasPrices()
  const { chainId } = useActiveChainId()
  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text>{t('Default transaction speed (GWEI)')}</Text>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees.',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        {chainId && (
          <>
            <StyledButton
              m="4px"
              ml="0px"
              scale="sm"
              onClick={() => {
                setGasPrice('standard')
              }}
              variant={selectedGas === 'standard' ? 'primary' : 'tertiary'}
            >
              Standard ({gases?.gwei?.standard})
            </StyledButton>
            <StyledButton
              m="4px"
              ml="0px"
              scale="sm"
              onClick={() => {
                setGasPrice('fast')
              }}
              variant={selectedGas === 'fast' ? 'primary' : 'tertiary'}
            >
              Fast ({gases?.gwei?.fast})
            </StyledButton>
            <StyledButton
              m="4px"
              ml="0px"
              scale="sm"
              onClick={() => {
                setGasPrice('lightspeed')
              }}
              variant={selectedGas === 'lightspeed' ? 'primary' : 'tertiary'}
            >
              Lightspeed ({gases?.gwei?.lightspeed})
            </StyledButton>
            {/* {Object.entries(GAS_PRICE_GWEI[chainId]).map(([key]) => (
              <StyledButton
                key={key}
                m="4px"
                ml="0px"
                scale="sm"
                onClick={() => {
                  setGasPrice(key)
                }}
                variant={key === selectedGas ? 'primary' : 'tertiary'}
              >
                {key} ({GAS_PRICE[chainId][key]})
              </StyledButton>
            ))} */}
          </>
        )}
      </Flex>
    </Flex>
  )
}

const StyledButton = styled(Button)`
  text-transform: capitalize;
`

export default GasSettings
