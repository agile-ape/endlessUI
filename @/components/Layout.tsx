import Header from './Header'
import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../store'
import { useTheme } from 'next-themes'
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractReads,
  useWalletClient,
} from 'wagmi'
import {
  API_ENDPOINT,
  LAST_MAN_STANDING_ADDRESS,
  WEBSOCKET_ENDPOINT,
  defaultContractObj,
  tokenContractObj,
} from '../../services/constant'
import Metadata, { type MetaProps } from './Metadata'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getTickets } from '../../services/api'
import { fetcher, isJson, transformToTicket } from '@/lib/utils'
import WelcomeModal from './ui/WelcomeModal'
import CompletionModal from './ui/CompletionModal'
import useSWR from 'swr'
import { toast } from '../components/ui/use-toast'
import { io } from 'socket.io-client'

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
  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  const modifyPlayerTicket = useStoreActions((actions) => actions.modifyTicket)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const updateOwnedTicket = useStoreActions((actions) => actions.updateOwnedTicket)

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

  const {
    data: ticketsData,
    error,
    mutate,
  } = useSWR<{
    data: Ticket[]
  }>(
    `/tickets?page=1&limit=30&sortOrder=ASC&sortBy=purchasePrice&contractAddress=${LAST_MAN_STANDING_ADDRESS}`,
    fetcher,
  )

  if (ticketsData?.data.length) {
    const ticketList = transformToTicket(ticketsData?.data).filter(
      (item) => item.user !== '0x0000000000000000000000000000000000000000',
    )

    const ownedTicket = ticketList.find(
      (item) => item.user.toLowerCase() === address?.toLowerCase(),
    )

    updateTickets(ticketList)

    if (ownedTicket) {
      updateOwnedTicket(ownedTicket)
    }
  }

  useEffect(() => {
    const socket = io(WEBSOCKET_ENDPOINT)

    socket.io.on('open', () => {
      console.log('connected')
    })

    socket.on('tickets', (data) => {
      if (!data?.id) return

      if (data?.user?.toLowerCase() === address?.toLowerCase()) {
        updateOwnedTicket(data)
      } else {
        modifyPlayerTicket({
          id: data?.id,
          ticket: data,
        })
      }
    })

    socket.on('events', (data) => {
      console.log('events', data)
    })

    return () => {
      socket.close()
    }
  }, [])

  useContractEvent({
    ...defaultContractObj,
    eventName: 'PhaseChange',
    listener: (event) => {
      const args = event[0]?.args
      const { caller, previousPhase, newPhase, time } = args
      refetchInitData()
      refreshData()
      // start
      if (newPhase === 1) {
        toast({
          variant: 'info',
          title: 'Ticket buying',
          description: <p>Ticket buying has started.</p>,
        })
      }

      // day
      if (newPhase === 2) {
        toast({
          variant: 'info',
          title: 'Day has come',
          description: <p>Day has come. Remember to submit keyword.</p>,
        })
      }

      // night
      if (newPhase === 3) {
        toast({
          variant: 'info',
          title: 'Night has come',
          description: <p>Night has come. Let the attacks begin</p>,
        })
      }

      // lastmanfound
      if (newPhase === 4) {
        triggerCompletionModal({
          isOpen: true,
          state: 'lastman',
        })
      }

      // peacefound
      if (newPhase === 5) {
        triggerCompletionModal({
          isOpen: true,
          state: 'peacefound',
        })
      }
      // drain
      if (newPhase === 6) {
        triggerCompletionModal({
          isOpen: true,
          state: 'drain',
        })
      }
      // gameclosed
      if (newPhase === 7) {
        triggerCompletionModal({
          isOpen: true,
          state: 'gameClosed',
        })
      }
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
  // useContractEvent({
  //   ...defaultContractObj,
  //   eventName: 'AttackAndKilled',
  //   listener: (event) => {
  //     const args = event[0]?.args
  //     const { caller, defendingTicket, ticketValue, time } = args
  //     if (defendingTicket === ticketId) {
  //       triggerCompletionModal({
  //         isOpen: true,
  //         state: 'killed',
  //       })
  //     }
  //     console.log({ args })
  //   },
  // })

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
      {
        ...defaultContractObj,
        functionName: 'ticketCount',
      },
      // {
      //   ...defaultContractObj,
      //   functionName: 'ticketId',
      // },
    ],
    enabled: isConnected,
  })

  if (data && data?.length > 0) {
    const round = data[0]?.result || 0
    const phase = data[1]?.result || 0
    const ticketCount = data[2]?.result || 0
    // const totalTickets = data[3]?.result || 0

    updateRound(Number(round))
    updatePhase(Number(phase))
    updateTicketCount(Number(ticketCount))
    // updatePhase(Number(2))
    // updateNextTicketPrice(Number(nextTicketPrice))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const background = router.pathname.includes('404') ? 'Default.svg' : typeStage[phase]
  // const background = typeStage[phase]

  return (
    <main
      className={`font-VT323 bg-cover bg-center bg-no-repeat min-h-screen`}
      style={{
        backgroundImage: `url(/background/${background})`,
      }}
    >
      {/* width of header */}
      {/* <div className="absolute bottom-10 left-40 h-[10vw] w-[10vw]">
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
      </div> */}
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
