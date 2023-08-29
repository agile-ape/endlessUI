import Header from './Header'
import { VT323 } from 'next/font/google'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../store'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from 'next-themes'
import { useAccount, useContractReads } from 'wagmi'
import { defaultContractObj } from '../../services/constant'
import Metadata, { type MetaProps } from './Metadata'
import dynamic from 'next/dynamic'

const font = VT323({
  weight: ['400'],
  subsets: ['latin-ext'],
})

const typeStage: Record<IApp['stage'], string> = {
  whitelist: 'City',
  beginnings: 'City',
  countdown: 'City',
  day: 'Desert',
  dusk: 'Dusk',
  night: 'Night',
  lastmanfound: 'Snow',
}

type LayoutProps = {
  children: React.ReactNode
  metadata: MetaProps
}

const Layout = ({ children, metadata }: LayoutProps) => {
  const stage = useStoreState((state) => state.stage)
  const updateStage = useStoreActions((actions) => actions.updateStage)
  const updateRound = useStoreActions((actions) => actions.updateRound)

  const { isConnected } = useAccount()

  const { data } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'round',
      },
      {
        ...defaultContractObj,
        functionName: 'phase',
      },
    ],
    enabled: isConnected,
  })

  if (data && data?.length > 0) {
    const round = data[0]?.result
    const stage = data[1]?.result || 0

    updateStage(Number(stage))
    updateRound(Number(round))
  }

  return (
    <main
      className={`${font.className} bg-cover bg-center bg-no-repeat bg-fixed min-h-screen`}
      style={{
        backgroundImage: `url(/background/${typeStage[stage]}.svg)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Metadata {...metadata} />
      <div>
        <Header />
        {children}
      </div>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
