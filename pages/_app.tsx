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

import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'
import { PrivyProvider } from '@privy-io/react-auth'

const chainsConfig = [
  ...(process.env.NODE_ENV === 'production' ? [arbitrum] : [arbitrumGoerli, mainnet]),
]

// const { chains, publicClient, webSocketPublicClient } = configureChains(chainsConfig, [
//   // infuraProvider({ apiKey: 'b7ba7966518f48eeb4de662fbc51b03e' }),
//   publicProvider(),
// ])

// const { connectors } = getDefaultWallets({
//   appName: 'Last Man Standing',
//   projectId: 'aebfb7cdffcbfce2ffd5d4b620c4c8a4',
//   chains,
// })

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors,
//   publicClient,
//   // webSocketPublicClient,
// })

const configureChainsConfig = configureChains(
  [mainnet, goerli, arbitrum, arbitrumGoerli, base, baseGoerli],
  [
    publicProvider(),
    // alchemyProvider({ apiKey: "your-alchemy-api-key" }),
    // infuraProvider({ apiKey: "b7ba7966518f48eeb4de662fbc51b03e" }),
  ],
)

const phaseTheme: Record<IApp['phase'], 'light' | 'dark'> = {
  deployed: 'dark',
  start: 'dark',
  day: 'light',
  night: 'dark',
  lastmanfound: 'light',
  drain: 'dark',
  peacefound: 'light',
  gameclosed: 'dark',
}

function MyApp({ Component, pageProps }: AppProps) {
  const { data } = useSWR('phase', async () => {
    const res = await fetch('/api/phase')
    const json = await res.json()

    if (res.status !== 200) {
      throw new Error(json.message)
    }

    return {
      phase: json?.message as IApp['phase'],
    }
  })

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          // logo:,
          showWalletLoginFirst: true,
        },
        loginMethods: ['wallet', 'sms', 'email', 'google'],
        defaultChain: baseGoerli,
        supportedChains: [mainnet, goerli, arbitrum, arbitrumGoerli, base, baseGoerli],

        embeddedWallets: {
          createOnLogin: 'all-users', // or 'users-without-wallets'
        },
      }}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        {/* <WagmiConfig config={wagmiConfig}> */}
        {/* <RainbowKitProvider
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
      > */}
        <StoreProvider store={appStore}>
          <ThemeProvider
            attribute="class"
            enableSystem
            forcedTheme={data?.phase ? phaseTheme[data?.phase] : 'dark'}
          >
            <Metadata {...pageProps.metadata} />
            <Layout metadata={pageProps.metadata} phase={data?.phase || 'night'}>
              <Component {...pageProps} />
              <Toaster />
            </Layout>
          </ThemeProvider>
        </StoreProvider>
        {/* </RainbowKitProvider> */}
        {/* </WagmiConfig> */}
      </PrivyWagmiConnector>
    </PrivyProvider>
  )
}

export default MyApp
