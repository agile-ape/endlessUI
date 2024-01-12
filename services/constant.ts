import { TOKEN_ABI } from './abi/token'
import { GAME_ABI } from './abi/game'
import { BET_ENDING_ABI } from './abi/bet'
import { WHITELIST_ABI } from './abi/whitelist'

const isDevelopment = process.env.NODE_ENV === 'development'

/*---------------------------------------- API KEYS ---------------------------------------- */
export const HCAPCTCHA_KEY = '38e2ff83-f255-4b90-88ff-c65a443e82db' as const

export const API_ENDPOINT = isDevelopment
  ? 'https://lastman-be.onrender.com'
  : 'https://lastman-be.onrender.com'

export const WEBSOCKET_ENDPOINT = isDevelopment
  ? 'wss://lastman-be.onrender.com/ws'
  : 'wss://lastman-be.onrender.com/ws'

/*---------------------------------------- WALLETS ---------------------------------------- */
export const RELAYER_ADDRESS = '0x33cBc636230606c505B53cbBD6BE572c65ED6B30' as const
export const TEAM_WALLET_ADDRESS = '0x27252766942062Efb686cc35803f5EdA7a923563' as const
export const GAMEMASTER_ADDRESS = '0xD72CA6647693f6D35Ef305e171673E72D258E428' as const

/*---------------------------------------- CONTRACTS ---------------------------------------- */
export const TOKEN_ADDRESS = '0xbda537bbb33c1c39db3eaf499d99ad8ddb2bf58d' as const
export const tokenContractObj = {
  address: TOKEN_ADDRESS,
  abi: TOKEN_ABI,
}

export const GAME_ADDRESS = '0x59d6e2475744402c9ef342da0bd9a5bb47839f96' as const
export const defaultContractObj = {
  address: GAME_ADDRESS,
  abi: GAME_ABI,
}

export const BET_ENDING_ADDRESS = '0x26B412a7ABc5f83B3Ef946E9fDe9450073AA4302' as const
export const wagerContractObj = {
  address: BET_ENDING_ADDRESS,
  abi: BET_ENDING_ABI,
}

// export const WHITELIST_DEV_ADDRESS = '0x68EEf6bb643efa224E804a8D604e511d1F8fa032' as const
// export const WHITELIST_PROD_ADDRESS = '0xe3E6133c3930C265757a6429Ab5e53F30c19D70e' as const

// export const whitelistContractObj = {
//   address: isDevelopment ? WHITELIST_DEV_ADDRESS : WHITELIST_PROD_ADDRESS,
//   abi: WHITELIST_ABI,
// }

/*---------------------------------------- DOCS ---------------------------------------- */
export const DOCS_URL = 'https://docs.lastman.xyz'
export const DOCS_URL_stages = `${DOCS_URL}/stages`
export const DOCS_URL_setup = `${DOCS_URL}/setup`
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

/*-------------------- EXTERNAL LINKS -------------------- */
export const BLOG_URL = 'https://blog.lastman.xyz'
export const TWITTER_URL = 'https://twitter.com/lastman0x'
export const TELEGRAM_URL = 'https://t.me/lastmangame'

export const LIQUIDITY_POOL = 'https://app.uniswap.org/'

export const BLOCK_EXPLORER = isDevelopment
  ? 'https://goerli.basescan.org/'
  : 'https://goerli.basescan.org/'

// https://testnet.arbiscan.io/
