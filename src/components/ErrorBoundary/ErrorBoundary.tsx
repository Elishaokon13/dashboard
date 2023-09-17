import Page from 'views/Page'
import { Button, Text, Flex } from 'uikit'
import Logo from 'assets/limitlesslogo.png'
import Image from 'next/image'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Page>
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Image src={Logo} alt="Logo" width={118} height={65} />
            <Text mb="16px">Oops, something wrong.</Text>
            <Button onClick={() => window.location.reload()}>Click here to reset!</Button>
          </Flex>
        </Page>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
