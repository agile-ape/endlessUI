import { LAST_MAN_STANDING_ABI } from './abi/last_man_standing'
import { TOKEN_ABI } from './abi/token_abi'
import { WHITELIST_ABI } from './abi/whitelist'

const isDevelopment = process.env.NODE_ENV === 'development'

export const LAST_MAN_STANDING_ADDRESS = '0x7DA1cF39B1d7f403416eA7c78660BB050622759F' as const

export const TOKEN_ADDRESS = '0xe6E5Ba2d06ba33882F563e0f75D64F8e89ced9Bb' as const
export const WHITELIST_DEV_ADDRESS = '0x68EEf6bb643efa224E804a8D604e511d1F8fa032' as const
export const WHITELIST_PROD_ADDRESS = '0xe3E6133c3930C265757a6429Ab5e53F30c19D70e' as const

export const defaultContractObj = {
  address: LAST_MAN_STANDING_ADDRESS,
  abi: LAST_MAN_STANDING_ABI,
}

// token contract object - need to update contract
export const tokenContractObj = {
  address: TOKEN_ADDRESS,
  abi: TOKEN_ABI,
}

export const whitelistContractObj = {
  address: isDevelopment ? WHITELIST_DEV_ADDRESS : WHITELIST_PROD_ADDRESS,
  abi: WHITELIST_ABI,
}

export const DOCS_URL = 'https://docs.lastman.xyz'
export const DOCS_URL_stages = 'https://docs.lastman.xyz/more-info/more-on-stages'

export const DOCS_URL_buy = 'https://docs.lastman.xyz/more-info/more-on-start'
export const DOCS_URL_exit =
  'https://docs.lastman.xyz/more-info/more-on-submit#7a1575b9c3ef4632a8336be33faa90e9'
export const DOCS_URL_submit = 'https://docs.lastman.xyz/more-info/more-on-submit'
export const DOCS_URL_safehouse = 'https://docs.lastman.xyz/more-info/more-on-safehouse'
export const DOCS_URL_attack = 'https://docs.lastman.xyz/more-info/more-on-attack'
export const DOCS_URL_checkout =
  'https://docs.lastman.xyz/more-info/more-on-safehouse#eb59b65bb02845e894fdc55400c7d6ab'
export const DOCS_URL_kickout =
  'https://docs.lastman.xyz/more-info/more-on-safehouse#93cd2d661c9b4bd8b42daacbce9ce24c'
export const DOCS_URL_split = 'https://docs.lastman.xyz/more-info/more-on-stages'

export const DOCS_URL_phases = 'https://docs.lastman.xyz/guide/phases'
export const LIQUIDITY_POOL = 'https://app.uniswap.org/'
export const BLOG_URL = 'https://blog.lastman.xyz'

export const BLOCK_EXPLORER = 'https://testnet.arbiscan.io/'

export const TWITTER_URL = 'https://twitter.com/lastman0x'
export const TELEGRAM_URL = 'https://t.me/lastmangame'
export const API_ENDPOINT = isDevelopment
  ? 'https://lsm-be.onrender.com'
  : 'https://lsm-be.onrender.com'

export const WEBSOCKET_ENDPOINT = isDevelopment
  ? 'wss://lsm-be.onrender.com/ws'
  : 'wss://lsm-be.onrender.com/ws'
