import React from 'react'
import styled, { keyframes } from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon, Flex, FlexProps } from 'uikit'
import { Element as ScrollElement, Link as ScrollLink } from 'react-scroll'

const StyledSectionLayout = styled(Flex)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme, background }) => theme.colors[background] || theme.colors.gradients[background]};
  position: relative;
  max-height: ${({ maxHeight }) => maxHeight || '1300px'};
`

const bounceAnimation = keyframes`
0%, 20%, 50%, 80%, 100% {
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  40% {
    -moz-transform: translateY(-20px);
    -ms-transform: translateY(-20px);
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
  60% {
    -moz-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    -webkit-transform: translateY(-10px);
    transform: translateY(-10px);
  }
`

interface StyledBounceContainerProps {
  /**
   * The bottom css of the bouncing cue
   * @default "15px"
   */
  cueBottomPos?: string
}

const StyledBounceContainer = styled.span<StyledBounceContainerProps>`
  animation: ${bounceAnimation} 3s infinite;
  transition: 0.3s ease;
  position: absolute;
  opacity: 0.5;
  bottom: ${({ cueBottomPos }) => cueBottomPos};
  z-index: 3;
`

export interface SectionLayoutProps extends FlexProps, StyledBounceContainerProps {
  /**
   * The id of next section
   * scroll cue appears when provided
   */
  nextSectionId?: string
  /**
   * reverse bounce cue direction
   */
  reverseCue?: boolean
}

const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  id,
  nextSectionId,
  cueBottomPos = '10px',
  reverseCue = false,
  ...props
}) => {
  const Cue = reverseCue ? ChevronUpIcon : ChevronDownIcon

  return (
    <>
      {id && <ScrollElement name={id} />}
      <StyledSectionLayout p="116px 24px" {...props} id={id}>
        {children}
        {nextSectionId && (
          <StyledBounceContainer cueBottomPos={cueBottomPos}>
            <ScrollLink
              href={`/#${nextSectionId}`}
              aria-label="scroll to next section"
              to={nextSectionId}
              smooth
              offset={reverseCue ? 0 : -70}
              duration={500}
            >
              <Cue width="50px" color="secondary" />
            </ScrollLink>
          </StyledBounceContainer>
        )}
      </StyledSectionLayout>
    </>
  )
}

export default SectionLayout
