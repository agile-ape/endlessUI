import { createPublicClient, http } from 'viem'
import { arbitrumGoerli, baseGoerli, mainnet } from 'viem/chains'
import { blastSepolia } from './constant'

export const publicClient = createPublicClient({
  chain: blastSepolia,
  transport: http(),
})
