import { Heading } from 'uikit'
import PageHeader, { PageHeaderProps } from './PageHeader'
import styled from 'styled-components'
import { baseColors } from 'uikit/theme/colors'

type PageTitleProps = {
  title: string
  subtitle: string
  noPadding?: boolean
} & PageHeaderProps

const StyledTitle = styled(Heading)`
  background: ${baseColors.limitlessBlue};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const PageTitle = ({ title, subtitle, noPadding, ...props }: PageTitleProps) => {
  return (
    <PageHeader width="100%" {...props}>
      <StyledTitle as="h1" scale="xl" color="primary" mb="24px" mt="24px">
        {title}
      </StyledTitle>
      <Heading scale="md" color="text">
        {subtitle}
      </Heading>
    </PageHeader>
  )
}

export default PageTitle
