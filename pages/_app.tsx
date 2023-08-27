import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, goerli, mainnet, optimism, polygon, zora } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import Header from '../@/components/Header'
import { VT323 } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from 'easy-peasy'
import { appStore, useStoreState } from '../store'
import type { IApp } from '../types/app'
import Layout from '@/components/Layout'
import { useTheme } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'Last Man Standing',
  projectId: '0ee8fb279a23a5ed56af0daddcd32028',
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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Layout>
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
