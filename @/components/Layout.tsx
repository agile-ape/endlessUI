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
import { useEffect, useState } from 'react'
import { getTickets } from '../../services/api'
import { isJson, transformToTicket } from '@/lib/utils'
import WelcomeModal from './ui/WelcomeModal'
const font = VT323({
  weight: ['400'],
  subsets: ['latin-ext'],
  variable: '--font-vt323',
})

const typeStage: Record<IApp['phase'], string> = {
  start: 'Start.svg',
  day: 'Day.svg',
  night: 'Night.svg',
  lastmanfound: 'LastManFound.svg',
  drain: 'Drain.svg',
  peacefound: 'PeaceFound.svg',
  gameclosed: 'PeaceFound.svg', // undecided
}

type LayoutProps = {
  children: React.ReactNode
  metadata: MetaProps
  phase: IApp['phase']
}

const Layout = ({ children, metadata, phase }: LayoutProps) => {
  const updatePhase = useStoreActions((actions) => actions.updatePhase)
  const updateRound = useStoreActions((actions) => actions.updateRound)
  const updateNextTicketPrice = useStoreActions((actions) => actions.updateNextTicketPrice)
  // const updateTotalPrizePool = useStoreActions((actions) => actions.updateTotalPrizePool)
  // const updateNextPrizeAmount = useStoreActions((actions) => actions.updateNextPrizeAmount)
  // const updateTopPrize = useStoreActions((actions) => actions.updateTopPrize)
  // const updateBounty = useStoreActions((actions) => actions.updateBounty)
  // const updateCurrentTicketCount = useStoreActions((actions) => actions.updateCurrentTicketCount)
  // const updateTotalTicketCount = useStoreActions((actions) => actions.updateTotalTicketCount)
  // const updateSuddenDeathRound = useStoreActions((actions) => actions.updateSuddenDeathRound)
  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  // const addTicket = useStoreActions((actions) => actions.addTicket)

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    const showWelcomeModal = localStorage.getItem('showWelcomeModal')
    const result = showWelcomeModal ? JSON.parse(showWelcomeModal) : true
    return result
  })

  const toggleModal = () => {
    setShowWelcomeModal((prevState) => !prevState)
    // const currentFlag = localStorage.getItem('showWelcomeModal')
    // if (currentFlag) localStorage.removeItem('showWelcomeModal')

    localStorage.setItem('showWelcomeModal', 'false')
  }

  const router = useRouter()

  const { isConnected } = useAccount()

  useContractEvent({
    ...defaultContractObj,
    eventName: 'PhaseChange',
    listener: (event) => {
      const args = event[0]?.args
      const { newPhase } = args

      updatePhase(Number(newPhase))
      refreshData()
    },
  })

  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:8090')
  //   socket.addEventListener('open', function (event) {
  //     socket.send('Hello Server!')
  //   })

  //   socket.addEventListener('message', function (event) {
  //     const jsonData = isJson(event.data)
  //     if (jsonData) {
  //       const result = JSON.parse(event.data)
  //       console.log('Message from server ', result)
  //       const tickets = transformToTicket(result?.ticketData)
  //       tickets.forEach((ticket) => {
  //         addTicket(ticket)
  //       })
  //     } else {
  //       console.log('Message from server ', event.data)
  //     }
  //   })

  //   return () => {
  //     socket.close()
  //   }
  // }, [])

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
      {
        ...defaultContractObj,
        functionName: 'nextTicketPrice',
      },
    ],
    enabled: isConnected,
  })

  if (data && data?.length > 0) {
    const round = data[0]?.result || 0
    const phase = data[1]?.result || 0
    const nextTicketPrice = data[2]?.result || 0

    console.log({ nextTicketPrice })

    updateRound(Number(round))
    updatePhase(Number(phase))
    updateNextTicketPrice(Number(nextTicketPrice))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const background = router.pathname.includes('quickstart') ? 'Default.svg' : typeStage[phase]

  // useEffect(() => {
  //   ;(async () => {
  //     const data = await getTickets()
  //     if (data?.data?.length > 0) {
  //       const tickets = transformToTicket(data.data)
  //       updateTickets(tickets)
  //     }
  //   })()
  // }, [])

  return (
    <main
      className={`font-VT323 bg-cover bg-center bg-no-repeat bg-fixed min-h-screen`}
      style={{
        backgroundImage: `url(/background/${background})`,
      }}
    >
      {/* width of header */}
      <div className="container mx-auto">
        {showWelcomeModal && <WelcomeModal toggleModal={toggleModal} />}
        <Header />
        {children}
      </div>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
