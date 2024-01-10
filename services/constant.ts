import { LAST_MAN_STANDING_ABI } from './abi/last_man_standing'
import { TOKEN_ABI } from './abi/token_abi'
import { WHITELIST_ABI } from './abi/whitelist'

const isDevelopment = process.env.NODE_ENV === 'development'

export const LAST_MAN_STANDING_ADDRESS = '0x7DA1cF39B1d7f403416eA7c78660BB050622759F' as const
export const AGOR_RELAYER_ADDRESS = '0x296b6b23b12D08C55e6D9c533AE6005870ec49fF' as const
export const TEAM_WALLET_ADDRESS = '0x27252766942062Efb686cc35803f5EdA7a923563' as const

export const TOKEN_ADDRESS = '0xe6E5Ba2d06ba33882F563e0f75D64F8e89ced9Bb' as const

export const WHITELIST_DEV_ADDRESS = '0x68EEf6bb643efa224E804a8D604e511d1F8fa032' as const
export const WHITELIST_PROD_ADDRESS = '0xe3E6133c3930C265757a6429Ab5e53F30c19D70e' as const

export const GAMEMASTER_ADDRESS = '0xD72CA6647693f6D35Ef305e171673E72D258E428' as const

export const HCAPCTCHA_KEY = '38e2ff83-f255-4b90-88ff-c65a443e82db' as const

export const defaultContractObj = {
  address: LAST_MAN_STANDING_ADDRESS,
  abi: LAST_MAN_STANDING_ABI,
}

// DUMMY ADDRESS - TO UPDATE ADDRESS, ABI AND FUNCTIONS
export const wagerContractObj = {
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
export const DOCS_URL_stages = `${DOCS_URL}/stages`
export const DOCS_URL_buy = `${DOCS_URL}/start`
export const DOCS_URL_start = `${DOCS_URL}/start`
export const DOCS_URL_exit = `${DOCS_URL}/day#7a1575b9c3ef4632a8336be33faa90e9`
export const DOCS_URL_submit = `${DOCS_URL}/day`
export const DOCS_URL_attack = `${DOCS_URL}/night`
export const DOCS_URL_safehouse = `${DOCS_URL}/safehouse`
export const DOCS_URL_checkout = `${DOCS_URL}/safehouse#eb59b65bb02845e894fdc55400c7d6ab`
export const DOCS_URL_kickout = `${DOCS_URL}/safehouse#93cd2d661c9b4bd8b42daacbce9ce24c`
export const DOCS_URL_split = `${DOCS_URL}/stages#cb029b4005c94699b1d7eb8856321ea6`
export const DOCS_URL_phases = `${DOCS_URL}/cheat-sheet#d6ba862cb0a348e0806e3630e8fa5ec1`
export const DOCS_URL_waterfall = `${DOCS_URL}/night#398cd030ed654d3e8cf50299c7a7c1e1`

export const LIQUIDITY_POOL = 'https://app.uniswap.org/'
export const BLOG_URL = 'https://blog.lastman.xyz'

export const BLOCK_EXPLORER = isDevelopment
  ? 'https://testnet.arbiscan.io/'
  : 'https://testnet.arbiscan.io/'

export const TWITTER_URL = 'https://twitter.com/lastman0x'
export const TELEGRAM_URL = 'https://t.me/lastmangame'
export const API_ENDPOINT = isDevelopment
  ? 'https://lastman-be.onrender.com'
  : 'https://lastman-be.onrender.com'

export const WEBSOCKET_ENDPOINT = isDevelopment
  ? 'wss://lsm-be.onrender.com/ws'
  : 'wss://lsm-be.onrender.com/ws'
