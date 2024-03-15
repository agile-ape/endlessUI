import { TOKEN_ABI } from './abi/token'
import { GAME_ABI } from './abi/game'

import { defineChain } from 'viem'
/*---------------------------------------- ENV ---------------------------------------- */

// import from .env
const NODE_ENV = process.env.NODE_ENV
console.log(NODE_ENV)

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
// export const CHAIN_ID = 168587773
/*---------------------------------------- CONTRACTS ---------------------------------------- */
export const GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT as `0x${string}`
export const defaultContractObj = {
  address: GAME_ADDRESS,
  abi: GAME_ABI,
}

export const TOKEN_ADDRESS = '0xe3e6133c3930c265757a6429ab5e53f30c19d70e' as const
export const tokenContractObj = {
  address: TOKEN_ADDRESS,
  abi: TOKEN_ABI,
}

export const TREASURY_ADDRESS = '0xBadCE2c9dd0D33C746c5529CD3d3651b208350Be' as const
// used for server utils
export const blastSepolia = /*#__PURE__*/ defineChain({
  id: 168_587_773,
  network: 'Blast Sepolia',
  name: 'Blast Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        'https://soft-lively-sunset.blast-sepolia.quiknode.pro/c8cf7d624e2288cc6d21f20e7e7867132aadb5f1',
      ],
    },
    public: {
      http: [
        'https://soft-lively-sunset.blast-sepolia.quiknode.pro/c8cf7d624e2288cc6d21f20e7e7867132aadb5f1',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blastscan',
      url: 'https://testnet.blastscan.io',
    },
  },
  testnet: true,
})

export const API_ENDPOINT = 'https://pepper-obky.onrender.com/'
export const WEBSOCKET_ENDPOINT = 'wss://pepper-obky.onrender.com'

export const CHAIN_LIST = 'https://chainid.network/chains.json'
export const TOKEN_NAME = 'WAND'
// export const GAME_ADDRESS = GAME_ENV

// export const CHAIN = blastSepolia
// export const CHAIN_ID = Number(CHAIN_ENV)

// const GAME_ENV = process.env.NEXT_PUBLIC_CONTRACT as `0x${string}`
// const CHAIN_ENV = process.env.NEXT_PUBLIC_CHAIN_ID

/*---------------------------------------- CHAIN ---------------------------------------- */

// export const CHAIN = baseGoerli
// export const CHAIN_ID = 84531

// export const BLOCK_EXPLORER = isDevelopment
//   ? 'https://testnet.blastscan.io'
//   : 'https://testnet.blastscan.io'

// https://testnet.arbiscan.io/

/*---------------------------------------- API KEYS ---------------------------------------- */
// export const HCAPCTCHA_KEY = '38e2ff83-f255-4b90-88ff-c65a443e82db' as const

//pepper-obky.onrender.com
// https: //pepper-obky.onrender.com/ws

/*---------------------------------------- WALLETS ---------------------------------------- */
// export const RELAYER_ADDRESS = '0xe973a9e8f568f64faa8696a762427972ee9f8446' as const // to be updated
// export const TEAM_WALLET_ADDRESS = '0x27252766942062Efb686cc35803f5EdA7a923563' as const
// export const GAMEMASTER_ADDRESS = '0x17E11158D4AdD79f53FbC0efD8f69dC071546AA4' as const
// export const ADMIN_ADDRESSES = [
//   '0x17E11158D4AdD79f53FbC0efD8f69dC071546AA4', //last0x
// ]

// export const WHITELIST_DEV_ADDRESS = '0x68EEf6bb643efa224E804a8D604e511d1F8fa032' as const
// export const WHITELIST_PROD_ADDRESS = '0xe3E6133c3930C265757a6429Ab5e53F30c19D70e' as const

// export const whitelistContractObj = {
//   address: isDevelopment ? WHITELIST_DEV_ADDRESS : WHITELIST_PROD_ADDRESS,
//   abi: WHITELIST_ABI,
// }
/*---------------------------------------- IMG ---------------------------------------- */

const IMG_URL_lore = 'https://res.cloudinary.com/dn4hm5vfh/image/upload/v1705495252/lore'

export const SUBMIT_KEYWORD_IMG = `${IMG_URL_lore}/SubmitKeyword.png`
export const SUBMIT_KEYWORD_MOBILE_IMG = `${IMG_URL_lore}/SubmitKeywordMobile.png`

export const SPLIT_POT_IMG = `${IMG_URL_lore}/SplitPot.png`
export const SPLIT_POT_MOBILE_IMG = `${IMG_URL_lore}/SplitPotMobile.png`

export const CHECK_INTO_SAFEHOUSE_IMG = `${IMG_URL_lore}/CheckIntoSafehouse.png`
export const CHECK_INTO_SAFEHOUSE_MOBILE_IMG = `${IMG_URL_lore}/CheckIntoSafehouseMobile.png`

export const CHECK_OUT_OF_SAFEHOUSE_IMG = `${IMG_URL_lore}/CheckOutOfSafehouse.png`
export const CHECK_OUT_OF_SAFEHOUSE_MOBILE_IMG = `${IMG_URL_lore}/CheckOutOfSafehouseMobile.png`

export const ATTACK_PLAYER_IMG = `${IMG_URL_lore}/AttackPlayer.png`
export const ATTACK_PLAYER_MOBILE_IMG = `${IMG_URL_lore}/AttackPlayerMobile.png`

export const KICK_OUT_IMG = `${IMG_URL_lore}/KickOut.png`
export const KICK_OUT_MOBILE_IMG = `${IMG_URL_lore}/KickOutMobile.png`

export const BUY_TICKET_IMG = `${IMG_URL_lore}/BuyTicket.png`
export const BUY_TICKET_MOBILE_IMG = `${IMG_URL_lore}/BuyTicketMobile.png`

export const EXIT_GAME_IMG = `${IMG_URL_lore}/ExitGame.png`
export const EXIT_GAME_MOBILE_IMG = `${IMG_URL_lore}/ExitGameMobile.png`

export const CHANGE_PHASE_IMG = `${IMG_URL_lore}/ChangePhase.png`
export const CHANGE_PHASE_MOBILE_IMG = `${IMG_URL_lore}/ChangePhaseMobile.png`

export const WAGER_IMG = `${IMG_URL_lore}/Wager.png`
export const WAGER_MOBILE_IMG = `${IMG_URL_lore}/WagerMobile.png`

export const TOKEN_IMG = `${IMG_URL_lore}/Token.png`
export const TOKEN_MOBILE_IMG = `${IMG_URL_lore}/TokenMobile.png`

export const DASHBOARD_IMG = `${IMG_URL_lore}/Dashboard.png`
export const DASHBOARD_MOBILE_IMG = `${IMG_URL_lore}/DashboardMobile.png`

export const GAMEMASTER_IMG = `${IMG_URL_lore}/Gamemaster.png`
export const GAMEMASTER_MOBILE_IMG = `${IMG_URL_lore}/GamemasterMobile.png`

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
