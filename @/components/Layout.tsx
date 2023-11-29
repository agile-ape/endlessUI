import Header from './Header'
import { VT323 } from 'next/font/google'
import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreState } from '../../store'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from 'next-themes'
import { useAccount, useContractEvent, useContractReads } from 'wagmi'
import { defaultContractObj, tokenContractObj } from '../../services/constant'
import Metadata, { type MetaProps } from './Metadata'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getTickets } from '../../services/api'
import { fetcher, isJson, transformToTicket } from '@/lib/utils'
import WelcomeModal from './ui/WelcomeModal'
import CompletionModal from './ui/CompletionModal'
import useSWR from 'swr'

const typeStage: Record<IApp['phase'], string> = {
  deployed: 'Default.svg',
  start: 'Start.svg',
  day: 'Day.svg',
  night: 'Night.svg',
  lastmanfound: 'LastManFound.svg',
  drain: 'Drain.svg',
  peacefound: 'PeaceFound.svg',
  gameclosed: 'Default.svg',
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
  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const updateTicketCount = useStoreActions((actions) => actions.updateTicketCount)

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    const showWelcomeModal = localStorage.getItem('showWelcomeModal')
    const result = showWelcomeModal ? JSON.parse(showWelcomeModal) : true
    return result
  })

  const { data: ticketsData, error } = useSWR<{
    data: Ticket[]
  }>('/tickets?page=1&limit=10&sortOrder=ASC&sortBy=purchasePrice', fetcher)

  console.log({ ticketsData, error })

  if (ticketsData?.data.length) {
    const formattedTickets = transformToTicket(ticketsData?.data)
    updateTickets(formattedTickets)
  }

  const toggleModal = () => {
    setShowWelcomeModal((prevState) => !prevState)
    localStorage.setItem('showWelcomeModal', 'false')
  }

  const router = useRouter()
  const { address, isConnected } = useAccount()

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

  useContractEvent({
    ...tokenContractObj,
    eventName: 'Transfer',
    listener: (event) => {
      const args = event[0]?.args
      const { from, to, value } = args
      if (to?.toLowerCase() === address?.toLowerCase()) {
        triggerCompletionModal({
          isOpen: true,
          state: 'received',
        })
      }
      console.log({ args })
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
      {
        ...defaultContractObj,
        functionName: 'ticketCount',
      },
    ],
    enabled: isConnected,
  })

  if (data && data?.length > 0) {
    const round = data[0]?.result || 0
    const phase = data[1]?.result || 0
    const nextTicketPrice = data[2]?.result || 0
    const ticketCount = data[3]?.result || 0

    updateRound(Number(round))
    updatePhase(Number(phase))
    // updatePhase(Number(2))
    updateNextTicketPrice(Number(nextTicketPrice))
    updateTicketCount(Number(ticketCount))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const background = router.pathname.includes('quickstart') ? 'Default.svg' : typeStage[phase]

  return (
    <main
      className={`font-VT323 bg-cover bg-center bg-no-repeat min-h-screen`}
      style={{
        backgroundImage: `url(/background/${background})`,
      }}
    >
      {/* width of header */}
      <div className="container mx-auto">
        {showWelcomeModal && <WelcomeModal toggleModal={toggleModal} />}
        <Header />
        {children}
        <CompletionModal alertLookTest="attackedButSafe" />
      </div>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
