import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }
  .react-datepicker-popper {
    z-index: 100 !important;
  } 

  #nprogress {
    pointer-events: none;
  }

  #nprogress .bar {
    background:${({ theme }) => theme.colors.primary};

    position: fixed;
    z-index: 9999999;
    top: 0;
    left: 0;

    width: 100%;
    height: 2px;
  }
`

export default GlobalStyle
