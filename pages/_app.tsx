import '../styles/globals.css'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, arbitrumGoerli, goerli, mainnet, optimism, polygon, zora } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from 'easy-peasy'
import { appStore, useStoreState } from '../store'
import type { IApp } from '../types/app'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'

const chainsConfig = [...(process.env.NODE_ENV === 'production' ? [arbitrum] : [arbitrumGoerli])]

const { chains, publicClient, webSocketPublicClient } = configureChains(chainsConfig, [
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
  webSocketPublicClient,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: 'linear-gradient(to right, #7dd3fc, #6366f1)',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
        coolMode
        modalSize="compact"
      >
        <StoreProvider store={appStore}>
          <ThemeProvider
            attribute="class"
            enableSystem
            forcedTheme={pageProps.theme ? pageProps.theme : null}
          >
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
