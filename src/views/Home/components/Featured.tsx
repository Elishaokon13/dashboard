import React from 'react'
import { BenzingaSeekIcon, MarketWatchIcon, SeekAlphaIcon, YahooFinanceIcon } from 'uikit'
import { LinksCarousel } from 'components/LinksCarousel'
import { useTranslation } from 'contexts/Localization'

const Featured: React.FC = () => {
  const { t } = useTranslation()

  return (
    <LinksCarousel
      title={t('Featured On')}
      swipeLinks={[
        {
          Icon: <YahooFinanceIcon width="120px" color="invertedContrast" />,
        },
        {
          Icon: <BenzingaSeekIcon width="140px" color="invertedContrast" />,
        },

        {
          Icon: <SeekAlphaIcon width="160px" color="invertedContrast" />,
        },
        {
          Icon: <MarketWatchIcon width="190px" color="invertedContrast" />,
        },
      ]}
    />
  )
}

export default Featured
