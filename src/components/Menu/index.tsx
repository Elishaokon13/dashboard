import React from 'react'
import { useRouter } from 'next/router'
import { Menu as UikitMenu } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import config from './config/config'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'
import useLNTPrice from 'hooks/useLNTPrice'
import { useLNTStatePrice } from 'state/global/hooks'
import { stringToFixed } from 'utils/limitlessUtils'

const headerMenuFlexProps = { flexGrow: '1', justifyContent: 'space-around' }
const Menu = (props) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  
  const lntPrice = useLNTStatePrice()
  const tokenPriceDisplayValue = lntPrice ? `${stringToFixed(String(lntPrice), 6)}` : '-'

  const tConfig = React.useMemo(() => config(t), [t])
  const { activeMenuItem, activeSubMenuItem } = React.useMemo(() => {
    const am = getActiveMenuItem({ menuConfig: tConfig, pathname })
    const asm = getActiveSubMenuItem({ menuItem: am, pathname })
    return {
      activeMenuItem: am,
      activeSubMenuItem: asm,
    }
  }, [tConfig, pathname])
  return (
    <UikitMenu
      headerMaxWidth="xxl"
      headerMenuFlexProps={headerMenuFlexProps}
      links={config(t)}
      cakePriceUsd={lntPrice ? tokenPriceDisplayValue : undefined}
      footerLinks={footerLinks(t)}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      {...props}
    />
  )
}

export default Menu
