import { GAME_ABI } from './abi/game'

import { defineChain } from 'viem'
/*---------------------------------------- ENV ---------------------------------------- */

// import from .env
const NODE_ENV = process.env.NODE_ENV
console.log(NODE_ENV)

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
// export const CHAIN_ID = 168587773

export let API_ENDPOINT: string
NODE_ENV == 'development'
  ? (API_ENDPOINT = 'http://localhost:3001')
  : (API_ENDPOINT = 'https://pepper-obky.onrender.com')

console.log(API_ENDPOINT)

/*---------------------------------------- CONTRACTS ---------------------------------------- */
export const GAME_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT as `0x${string}`
export const defaultContractObj = {
  address: GAME_ADDRESS,
  abi: GAME_ABI,
}

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

export const DOCS_URL = 'https://docs.lastman.xyz'
export const CHAIN_LIST = 'https://chainid.network/chains.json'
export const BLOCK_EXPLORER = 'https://testnet.blastscan.io'

/*-------------------- EXTERNAL LINKS -------------------- */
export const BLOG_URL = 'https://blog.lastman.xyz'
export const TWITTER_URL = 'https://twitter.com/lastman0x'
export const TELEGRAM_URL = 'https://t.me/lastmangame'

export const LIQUIDITY_POOL = 'https://app.uniswap.org/'
