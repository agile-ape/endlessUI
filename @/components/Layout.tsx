import Header from './Header'
import Image from 'next/image'

import { VT323 } from 'next/font/google'
import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreState } from '../../store'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from 'next-themes'
import { useAccount, useContractEvent, useContractRead, useContractReads } from 'wagmi'
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
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  const updateTicketCount = useStoreActions((actions) => actions.updateTicketCount)

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    const showWelcomeModal = localStorage.getItem('showWelcomeModal')
    const result = showWelcomeModal ? JSON.parse(showWelcomeModal) : true
    return result
  })

  const toggleModal = () => {
    setShowWelcomeModal((prevState) => !prevState)
    localStorage.setItem('showWelcomeModal', 'false')
  }

  const router = useRouter()
  const { address, isConnected } = useAccount()

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [(address || '') as `0x${string}`],
    enabled: !!address,
  })

  const ticketId = playerTicket?.[0] || 0
  console.log(ticketId)

  useContractEvent({
    ...defaultContractObj,
    eventName: 'PhaseChange',
    listener: (event) => {
      const args = event[0]?.args
      const { newPhase, previousPhase, time } = args
      refetchInitData()
      refreshData()
    },
  })

  // ticket bought
  // useContractEvent({
  //   ...defaultContractObj,
  //   eventName: 'NewTicketBought',
  //   listener: (event) => {
  //     const args = event[0]?.args
  //     const { caller, player, purchasePrice, time } = args
  //     console.log(recipient)

  //     if (recipient === ticketId) {
  //       triggerCompletionModal({
  //         isOpen: true,
  //         state: 'receivedTokens',
  //       })
  //     }
  //     console.log({ args })
  //   },
  // })

  // alerts tokens sender
  // useContractEvent({
  //   ...defaultContractObj,
  //   eventName: 'TokensTransferred',
  //   listener: (event) => {
  //     const args = event[0]?.args
  //     const { caller, recipient, amount, time } = args
  //     if (caller === ticketId) {
  //       updateCompletionModal({
  //         isOpen: true,
  //         state: 'sentTokens',
  //       })
  //     }
  //     console.log({ args })
  //   },
  // })

  // alerts ticket that got killed
  useContractEvent({
    ...defaultContractObj,
    eventName: 'AttackAndKilled',
    listener: (event) => {
      const args = event[0]?.args
      const { caller, defendingTicket, ticketValue, time } = args
      if (defendingTicket === ticketId) {
        triggerCompletionModal({
          isOpen: true,
          state: 'killed',
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

  const { data, refetch: refetchInitData } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'round',
      },
      {
        ...defaultContractObj,
        functionName: 'phase',
      },
      // {
      //   ...defaultContractObj,
      //   functionName: 'nextTicketPrice',
      // },
      // {
      //   ...defaultContractObj,
      //   functionName: 'ticketCount',
      // },
    ],
    enabled: isConnected,
  })

  if (data && data?.length > 0) {
    const round = data[0]?.result || 0
    const phase = data[1]?.result || 0
    // const nextTicketPrice = data[2]?.result || 0
    // const ticketCount = data[3]?.result || 0

    updateRound(Number(round))
    updatePhase(Number(phase))
    // updatePhase(Number(2))
    // updateNextTicketPrice(Number(nextTicketPrice))
    // updateTicketCount(Number(ticketCount))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const background = router.pathname.includes('quickstart') ? 'Default.svg' : typeStage[phase]

  return (
    <main
      className={`font-VT323 bg-cover bg-center bg-no-repeat min-h-screen relative`}
      style={{
        backgroundImage: `url(/background/${background})`,
      }}
    >
      {/* width of header */}
      <div className="absolute bottom-10 left-40 h-[10vw] w-[10vw]">
        <Image
          priority
          src="/background/portal.svg"
          className="animate-pulse"
          // height={100}
          // width={50}
          fill
          // sizes="5vw"
          alt="sneak-a-peek-pepe"
        />
      </div>
      <div className="container mx-auto">
        {showWelcomeModal && <WelcomeModal toggleModal={toggleModal} />}
        <Header />
        {children}
        <CompletionModal alertLookTest="afterPurchase" />
      </div>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
