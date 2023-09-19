import Header from './Header'
import { VT323 } from 'next/font/google'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../store'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from 'next-themes'
import { useAccount, useContractEvent, useContractReads } from 'wagmi'
import { defaultContractObj } from '../../services/constant'
import Metadata, { type MetaProps } from './Metadata'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getTickets } from '../../services/api'
import { transformToTicket } from '@/lib/utils'

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
  phase: IApp['phase']
}

const Layout = ({ children, metadata, phase }: LayoutProps) => {
  const updateStage = useStoreActions((actions) => actions.updateStage)
  const updateRound = useStoreActions((actions) => actions.updateRound)
  const updateTickets = useStoreActions((actions) => actions.updateTickets)

  const router = useRouter()

  const { isConnected } = useAccount()

  useContractEvent({
    ...defaultContractObj,
    eventName: 'PhaseChange',
    listener: (event) => {
      const args = event[0]?.args
      const { newPhase } = args

      updateStage(Number(newPhase))
      refreshData()
    },
  })

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

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const background = router.pathname.includes('whitelist') ? 'Night.svg' : typeStage[phase]

  useEffect(() => {
    ;(async () => {
      const data = await getTickets()
      if (data?.data?.length > 0) {
        const tickets = transformToTicket(data.data)
        updateTickets(tickets)
      }
    })()
  }, [])

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
