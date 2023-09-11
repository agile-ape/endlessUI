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
import { useRouter } from 'next/router'

const font = VT323({
  weight: ['400'],
  subsets: ['latin-ext'],
  variable: '--font-vt323',
})

const typeStage: Record<IApp['phase'], string> = {
  beginnings: 'City.svg',
  countdown: 'City.svg',
  // countdown: 'DayPepe.svg',
  // countdown: 'DayPepe.svg',
  day: 'Desert.svg',
  dusk: 'Dusk.svg',
  night: 'Night.avif',
  lastmanfound: 'Snow.avif',
}

type LayoutProps = {
  children: React.ReactNode
  metadata: MetaProps
}

const Layout = ({ children, metadata }: LayoutProps) => {
  const phase = useStoreState((state) => state.phase)
  const updateStage = useStoreActions((actions) => actions.updateStage)
  const updateRound = useStoreActions((actions) => actions.updateRound)
  const router = useRouter()

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

  // if (data && data?.length > 0) {
  //   const round = data[0]?.result
  //   const stage = data[1]?.result || 0

  //   updateStage(Number(stage))
  //   updateRound(Number(round))
  // }

  const background = router.pathname.includes('whitelist') ? 'Night.svg' : typeStage[phase]

  return (
    <main
      className={`${font.className} bg-cover bg-center bg-no-repeat bg-fixed min-h-screen`}
      style={{
        backgroundImage: `url(/background/${background})`,
      }}
    >
      <div className="container mx-auto min-w-[360px]">
        <Header />
        {children}
      </div>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
