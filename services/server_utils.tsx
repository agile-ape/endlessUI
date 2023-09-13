import { createPublicClient, http } from 'viem'
import { arbitrumGoerli, mainnet } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: arbitrumGoerli,
  transport: http(),
})
