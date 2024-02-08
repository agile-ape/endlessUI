import { createPublicClient, http } from 'viem'
import { arbitrumGoerli, baseGoerli, mainnet } from 'viem/chains'
import { CHAIN } from './constant'

export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(),
})
