import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Limitless Network',
  description: 'Limitless Network',
  image: '/seo/website-preview.jpg',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else if (path.startsWith('/dashboard')) {
    basePath = '/dashboard'
  } else if (path.startsWith('/locker')) {
    basePath = '/locker'
  } else if (path.startsWith('/contact')) {
    basePath = '/contact'
  } else if (path.startsWith('/privacy')) {
    basePath = '/privacy'
  } else if (path.startsWith('/terms')) {
    basePath = '/terms'
  } else if (path.startsWith('/mission')) {
    basePath = '/mission'
  } else if (path.startsWith('/token')) {
    basePath = '/token'
  } else if (path.startsWith('/team')) {
    basePath = '/team'
  } else if (path.startsWith('/locker')) {
    basePath = '/locker'
  } else if (path.startsWith('/exchange')) {
    basePath = '/exchange'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Limitless Network')}`,
      }
    case '/swap':
      return {
        title: `${t('Swap')} | ${t('Limitless Network')}`,
      }
    case '/ramp':
      return {
        title: `${t('Ramp')} | ${t('Limitless Network')}`,
      }
    case '/whitelabel':
      return {
        title: `${t('WhiteLabel')} | ${t('Limitless Network')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('Limitless Network')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('Limitless Network')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('Limitless Network')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('Limitless Network')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Limitless Network')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('Limitless Network')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('Limitless Network')}`,
      }
    case '/farms':
    case '/farms/all':
      return {
        title: `${t('Farms')} | ${t('Limitless Network')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('Limitless Network')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('Limitless Network')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('Limitless Network')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('Limitless Network')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('Limitless Network')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('Limitless Network')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('Limitless Network')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('Limitless Network')}`,
      }
    case '/analytics':
      return {
        title: `${t('Overview')} | ${t('Limitless Network Analytics')}`,
        description: 'View statistics for Limitless Network exchanges.',
      }
    case '/analytics/pools':
      return {
        title: `${t('Pools')} | ${t('Limitless Network Analytics')}`,
        description: 'View statistics for Limitless Network exchanges.',
      }
    case '/analytics/tokens':
      return {
        title: `${t('Tokens')} | ${t('Limitless Network Analytics')}`,
        description: 'View statistics for Limitless Network exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('Limitless Network')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('Limitless Network')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('Limitless Network')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('Limitless Network')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('Limitless Network')}`,
      }
    case '/dashboard':
      return {
        title: `${t('Dashboard')} | ${t('Limitless Network')}`,
      }
    case '/locker':
      return {
        title: `${t('Locker')} | ${t('Limitless Network')}`,
      }
    case '/terms':
      return {
        title: `${t('Terms')} | ${t('Limitless Network')}`,
      }
    case '/privacy':
      return {
        title: `${t('Privacy')} | ${t('Limitless Network')}`,
      }
    case '/contact':
      return {
        title: `${t('Contact')} | ${t('Limitless Network')}`,
      }
    case '/team':
      return {
        title: `${t('Team')} | ${t('Limitless Network')}`,
      }
    case '/yields':
      return {
        title: `${t('Yields')} | ${t('Limitless Network')}`,
      }
    case '/mission':
      return {
        title: `${t('Mission')} | ${t('Limitless Network')}`,
      }
    case '/token':
      return {
        title: `${t('Token')} | ${t('Limitless Network')}`,
      }
    case '/exchange':
      return {
        title: `${t('Exchange')} | ${t('Learn more')}`,
      }
    default:
      return null
  }
}
