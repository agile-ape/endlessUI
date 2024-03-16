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
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http } from 'wagmi'
// import 'wagmi/window'
import {
  arbitrum,
  arbitrumGoerli,
  goerli,
  mainnet,
  base,
  baseGoerli,
  blastSepolia,
  blast,
} from 'wagmi/chains'

// import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from 'easy-peasy'
import { appStore, useStoreState } from '../store'
import type { IApp } from '../types/app'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/shadcn/toaster'
import Metadata from '@/components/Metadata'
import useSWR from 'swr'

// import { arbitrumGoerli, baseGoerli, mainnet, blastSepolia } from 'viem/chains'

// import { blastSepolia } from '../services/constant'

// const chainsConfig = [...(process.env.NODE_ENV === 'production' ? [blastSepolia] : [blastSepolia])]

// const { chains, publicClient, webSocketPublicClient } = configureChains(chainsConfig, [
//   // infuraProvider({ apiKey: 'b7ba7966518f48eeb4de662fbc51b03e' }),
//   publicProvider(),
// ])

// const { connectors } = getDefaultWallets({
//   appName: 'Last Man Standing',
//   projectId: 'aebfb7cdffcbfce2ffd5d4b620c4c8a4',
//   chains,
// })

const wagmiConfig = getDefaultConfig({
  appName: 'Pooh Pot',
  projectId: 'aebfb7cdffcbfce2ffd5d4b620c4c8a4',
  chains: [blastSepolia],
  transports: {
    [blastSepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#404833',
            accentColorForeground: '#FCFDC7',
            borderRadius: 'medium',
            fontStack: 'rounded',
            overlayBlur: 'small',
          })}
          coolMode
          modalSize="compact"
          initialChain={blastSepolia}
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
