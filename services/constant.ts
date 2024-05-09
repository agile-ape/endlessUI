import { GAME_ABI } from './abi/game'

import { createPublicClient, http, defineChain } from 'viem'
import { mainnet, baseSepolia, base } from 'viem/chains'

/*---------------------------------------- ENV ---------------------------------------- */
// import from .env
const NODE_ENV = process.env.NODE_ENV
// console.log(NODE_ENV)

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
// export const CHAIN_ID = 84532

export const BASE_RPC =
  'https://fragrant-methodical-surf.base-mainnet.quiknode.pro/c20edae03060241a42c4cbe8c10b4c7659f5f614'

export const CRYTPOCOMPARE_ENDPOINT: string =
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'

export let API_ENDPOINT: string
NODE_ENV == 'development'
  ? (API_ENDPOINT = 'http://localhost:3001')
  : (API_ENDPOINT = 'https://mutton.onrender.com')

export let WEBSOCKET_ENDPOINT: string
NODE_ENV == 'development'
  ? (WEBSOCKET_ENDPOINT = 'ws://localhost:3001/ws')
  : (WEBSOCKET_ENDPOINT = 'wss://mutton.onrender.com/ws')

/*---------------------------------------- CONTRACTS ---------------------------------------- */
export const GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT as `0x${string}`
export const defaultContractObj = {
  address: GAME_ADDRESS,
  abi: GAME_ABI,
}

// console.log(GAME_ADDRESS)

// NEED TO SET THESE 2 UP
export const VIEM_CHAIN = base

export const publicClient = createPublicClient({
  chain: VIEM_CHAIN,
  transport: http(BASE_RPC),
})
// export const VIEM_CHAIN = baseSepolia

/*
export const baseSepolia1 = defineChain({
  id: 84532,
  network: 'Base Sepolia',
  name: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        'https://attentive-misty-friday.base-sepolia.quiknode.pro/9a84a5e1665e7fea4519dd1adfa096bd484baf95',
      ],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: 'https://sepolia-explorer.base.org',
    },
  },
  testnet: true,
})

export const blastSepolia1 = defineChain({
  id: 168587773,
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
*/

export const DOCS_URL =
  'https://lastman.notion.site/Flop-the-average-23d94cce99234bbbbbbbbf298add4e95?pvs=4'

export const CHAIN_LIST = 'https://chainid.network/chains.json'
export const BLOCK_EXPLORER = 'https://sepolia-explorer.base.org'

/*-------------------- EXTERNAL LINKS -------------------- */
export const BLOG_URL = 'https://blog.lastman.xyz'
export const TWITTER_URL = 'https://twitter.com/lastman0x'
export const SOON_LINK = 'https://x.com/lastman0x/status/1787678249343980010'
export const TELEGRAM_URL = 'https://t.me/lastmangame'

export const LIQUIDITY_POOL = 'https://app.uniswap.org/'
