import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  getDefaultWallets,
  lightTheme,
  darkTheme,
  midnightTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { injected } from '@wagmi/connectors'

import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http, createConfig } from 'wagmi'
// import 'wagmi/window'
import {
  arbitrum,
  arbitrumGoerli,
  goerli,
  mainnet,
  base,
  baseGoerli,
  baseSepolia,
  blastSepolia,
  blast,
} from 'wagmi/chains'
import { BASE_RPC } from '../services/constant'
// import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from 'easy-peasy'
import { appStore, useStoreState } from '../store'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/shadcn/toaster'
import Metadata from '@/components/Metadata'
import useSWR from 'swr'

export const rainbowConfig = getDefaultConfig({
  appName: 'Average',
  projectId: 'aebfb7cdffcbfce2ffd5d4b620c4c8a4',
  chains: [base],
  // chains: [baseSepolia],
  // chains: [base],
  transports: {
    [base.id]: http(
      BASE_RPC,
      // 'https://fragrant-methodical-surf.base-mainnet.quiknode.pro/c20edae03060241a42c4cbe8c10b4c7659f5f614',
      // 'https://mainnet.base.org',
      // 'https://attentive-misty-friday.base-sepolia.quiknode.pro/9a84a5e1665e7fea4519dd1adfa096bd484baf95',
    ),
  },
  ssr: true,
  // transports: {
  //   [blastSepolia1.id]: http(
  //     'https://attentive-misty-friday.base-sepolia.quiknode.pro/9a84a5e1665e7fea4519dd1adfa096bd484baf95',
  //   ),
  // },
})

/*
export const wagmiConfig = createConfig({
  // projectId: 'aebfb7cdffcbfce2ffd5d4b620c4c8a4',
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(
      'https://fragrant-methodical-surf.base-mainnet.quiknode.pro/c20edae03060241a42c4cbe8c10b4c7659f5f614',
      // 'https://attentive-misty-friday.base-sepolia.quiknode.pro/9a84a5e1665e7fea4519dd1adfa096bd484baf95',
    ),
  },
})
*/

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#334155',
            accentColorForeground: '#d1d5db',
            borderRadius: 'medium',
            fontStack: 'rounded',
            overlayBlur: 'small',
          })}
          coolMode
          modalSize="compact"
          initialChain={base}
        >
          <StoreProvider store={appStore}>
            <ThemeProvider attribute="class" forcedTheme="dark" enableSystem>
              <Metadata {...pageProps.metadata} />
              <Layout metadata={pageProps.metadata}>
                <Component {...pageProps} />
                <Toaster />
              </Layout>
            </ThemeProvider>
          </StoreProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default MyApp
