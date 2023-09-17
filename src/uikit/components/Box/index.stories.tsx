import React from 'react'
import BoxComponent from './Box'
import FlexComponent from './Flex'
import GridComponent from './Grid'
import PaperComponent from './Paper'
import Text from '../Text/Text'
import FlexItemComponent from './FlexItem'
import { Link } from '../Link'

export default {
  title: 'Components/Primitives',
  component: BoxComponent,
  argTypes: {},
}

export const Box: React.FC = () => {
  return (
    <div>
      <BoxComponent as="p">
        Contains background, border, layout, position, and space from{' '}
        <Link href="https://styled-system.com/api" target="_blank">
          Styled System&lsquo;s API
        </Link>
      </BoxComponent>
    </div>
  )
}

export const Flex: React.FC = () => {
  return (
    <div>
      <Text>Based on the Box component. You can apply any flexbox properties on the Flex component.</Text>
      <Link href="https://styled-system.com/api#flexbox" target="_blank">
        List of applicable props
      </Link>
      <FlexComponent justifyContent="space-between" mt="40px">
        <span>Left</span>
        <span>right</span>
      </FlexComponent>
      <FlexComponent justifyContent="center" mt="8px">
        <span>center</span>
      </FlexComponent>
    </div>
  )
}

export const Grid: React.FC = () => {
  return (
    <GridComponent
      justifyItems="center"
      alignContent="center"
      gridTemplateColumns="1fr 1fr"
      gridColumnGap="16px"
      style={{ backgroundColor: '#7645D9' }}
    >
      <BoxComponent style={{ backgroundColor: '#1fc7d4', width: '300px', height: '300px' }} />
      <BoxComponent style={{ backgroundColor: '#1fc7d4', width: '300px', height: '300px' }} />
    </GridComponent>
  )
}

export const Paper: React.FC = () => {
  return (
    <PaperComponent width="200px" height="200px" padding="10px" margin="50px">
      This is a paper container with shadow
    </PaperComponent>
  )
}

export const FlexItem: React.FC = () => {
  return (
    <FlexComponent container justifyContent="space-between" margin="20px" spacing="20px">
      <FlexItemComponent xs={12} md={6}>
        <PaperComponent padding="10px">#1</PaperComponent>
      </FlexItemComponent>
      <FlexItemComponent xs={6} md={3}>
        <PaperComponent padding="10px">#2</PaperComponent>
      </FlexItemComponent>
      <FlexItemComponent xs={6} md={3}>
        <PaperComponent padding="10px">#3</PaperComponent>
      </FlexItemComponent>
      <FlexItemComponent xs={12}>
        <PaperComponent padding="10px">#4</PaperComponent>
      </FlexItemComponent>
    </FlexComponent>
  )
}
