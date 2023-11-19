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
  // const updateTotalPrizePool = useStoreActions((actions) => actions.updateTotalPrizePool)
  // const updateNextPrizeAmount = useStoreActions((actions) => actions.updateNextPrizeAmount)
  // const updateTopPrize = useStoreActions((actions) => actions.updateTopPrize)
  // const updateBounty = useStoreActions((actions) => actions.updateBounty)
  // const updateCurrentTicketCount = useStoreActions((actions) => actions.updateCurrentTicketCount)
  // const updateTotalTicketCount = useStoreActions((actions) => actions.updateTotalTicketCount)
  // const updateSuddenDeathRound = useStoreActions((actions) => actions.updateSuddenDeathRound)
  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  // const addTicket = useStoreActions((actions) => actions.addTicket)

  /* init modal welcome */
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(
    !localStorage.getItem('closeWelcomeModal') ||
      localStorage.getItem('closeWelcomeModal') !== 'true',
  )
  const toggleModal = () => {
    setShowWelcomeModal((prevState) => !prevState)
    const currentFlag = localStorage.getItem('closeWelcomeModal')
    if (currentFlag) localStorage.removeItem('closeWelcomeModal')

    localStorage.setItem('closeWelcomeModal', 'true')
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
        functionName: 'totalPrizePool',
      },
      {
        ...defaultContractObj,
        functionName: 'nextPrizeAmount',
      },
      {
        ...defaultContractObj,
        functionName: 'prizeFactor',
      },
      {
        ...defaultContractObj,
        functionName: 'bounty',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketCount',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketId',
      },
      {
        ...defaultContractObj,
        functionName: 'suddenDeath',
      },
    ],
    enabled: isConnected,
  })

  if (data && data?.length > 0) {
    // kept
    const round = data[0]?.result
    const phase = data[1]?.result || 0
    const totalPrizePool = data[2]?.result || 0
    const nextPrizeAmount = data[3]?.result || 0
    const prizeFactor = data[4]?.result || 0
    const bounty = data[5]?.result || 0
    const ticketCount = data[6]?.result || 0
    const ticketId = data[7]?.result || 0
    const suddenDeath = data[8]?.result || 0

    // make all names consistent from this point out
    updateRound(Number(0))
    // updatePhase(Number(phase))
    updatePhase(Number(1))
    // updateTotalPrizePool(Number(totalPrizePool))
    // updateNextPrizeAmount(Number(nextPrizeAmount))
    // updateTopPrize(Number(prizeFactor))
    // updateBounty(Number(bounty))
    // updateCurrentTicketCount(Number(ticketCount))
    // updateTotalTicketCount(Number(ticketId) - 1)
    // updateSuddenDeathRound(Number(suddenDeath))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const background = router.pathname.includes('quickstart') ? 'Default.svg' : typeStage[phase]

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
