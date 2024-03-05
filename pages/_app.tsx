import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, arbitrumGoerli, goerli, mainnet, base, baseGoerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from 'easy-peasy'
import { appStore, useStoreState } from '../store'
import type { IApp } from '../types/app'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'
import Metadata from '@/components/Metadata'
import useSWR from 'swr'
import { infuraProvider } from 'wagmi/providers/infura'
import 'wagmi/window'
import { type Chain, defineChain } from 'viem'

// import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'
// import { PrivyProvider } from '@privy-io/react-auth'
// import { blastSepolia } from '../services/constant'

export const blastSepolia = {
  id: 168_587_773,
  name: 'Blast Sepolia',
  network: 'Blast Sepolia',
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
} as const satisfies Chain

const chainsConfig = [...(process.env.NODE_ENV === 'production' ? [blastSepolia] : [blastSepolia])]

const { chains, publicClient, webSocketPublicClient } = configureChains(chainsConfig, [
  // infuraProvider({ apiKey: 'b7ba7966518f48eeb4de662fbc51b03e' }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Last Man Standing',
  projectId: 'aebfb7cdffcbfce2ffd5d4b620c4c8a4',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: '#FCFC03',
          accentColorForeground: '#404833',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
        coolMode
        modalSize="compact"
      >
        <StoreProvider store={appStore}>
          <ThemeProvider attribute="class" enableSystem>
            <Metadata {...pageProps.metadata} />
            <Layout metadata={pageProps.metadata}>
              <Component {...pageProps} />
              <Toaster />
            </Layout>
          </ThemeProvider>
        </StoreProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
