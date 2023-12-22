import Header from './Header'
import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../store'
import { useTheme } from 'next-themes'
import { useAccount, useContractRead, useContractReads, useWalletClient } from 'wagmi'
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
import { fetcher, isJson, transformToTicket, formatNumber } from '@/lib/utils'
import WelcomeModal from './ui/WelcomeModal'
import CompletionModal from './ui/CompletionModal'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from '../components/ui/use-toast'
import { formatUnits, parseUnits } from 'viem'
import { useSocketEvents, type Event } from '../../hooks/useSocketEvents'

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
  const updateRound = useStoreActions((actions) => actions.updateRound)
  const updatePhase = useStoreActions((actions) => actions.updatePhase)
  const updateStage = useStoreActions((actions) => actions.updateStage)
  const updateSuddenDeath = useStoreActions((actions) => actions.updateSuddenDeath)
  const updateCurrentPot = useStoreActions((actions) => actions.updateCurrentPot)
  const updateTicketCount = useStoreActions((actions) => actions.updateTicketCount)
  const updateVoteCount = useStoreActions((actions) => actions.updateVoteCount)
  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  const modifyPlayerTicket = useStoreActions((actions) => actions.modifyTicket)
  const updateOwnedTicket = useStoreActions((actions) => actions.updateOwnedTicket)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const updateLastChangedTicket = useStoreActions((actions) => actions.updateLastChangedTicket)

  const { mutate: globalMutate } = useSWRConfig()

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

  const events: Event[] = [
    {
      name: 'tickets',
      handler(data) {
        console.log({
          ticketData: data,
        })
        if (!data?.id) return

        updateLastChangedTicket(data.id)
        setTimeout(() => updateLastChangedTicket(0), 3000)

        if (data?.user?.toLowerCase() === address?.toLowerCase()) {
          updateOwnedTicket(data)
        } else {
          modifyPlayerTicket({
            id: data?.id,
            ticket: data,
          })
        }
      },
    },
    {
      name: 'events',
      async handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        const refetchedEvents = ['VoteYes', 'VoteNo', 'NewTicketBought', 'PhaseChange']

        if (refetchedEvents.includes(event)) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          refetchInitData()
        }

        if (event === 'SafehousePrice') {
          const { price, time } = dataJson
          const priceRate = formatUnits(price || BigInt(0), 3)
          toast({
            variant: 'info',
            // title: 'Keyword updated',
            description: <p>Safehouse price is now {priceRate} $LAST per night </p>,
          })
        }

        if (event === 'TokenEmission') {
          const { emission, time } = dataJson
          const emissionRate = formatUnits(emission || BigInt(0), 3)
          toast({
            variant: 'info',
            // title: 'Keyword updated',
            description: <p>Tokens are now emitted at {emissionRate} $LAST per attack </p>,
          })
        }

        if (event === 'DrainTriggered') {
          const { drainRound, drainRate, time } = dataJson
          const drainBegins = formatUnits(drainRound || BigInt(0), 0)
          toast({
            variant: 'info',
            // title: 'Keyword updated',
            description: (
              <p>
                Pot will starting draining on round{' '}
                <span className="round-last">{drainBegins}</span>.
              </p>
            ),
          })
        }

        if (event === 'PhaseChange') {
          const { caller, previousPhase, newPhase, time } = dataJson

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

          globalMutate('phase')
        }
      },
    },
  ]

  useSocketEvents(events)

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
        functionName: 'currentPot',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketCount',
      },
      {
        ...defaultContractObj,
        functionName: 'voteCount',
      },
      {
        ...defaultContractObj,
        functionName: 'suddenDeath',
      },
      {
        ...defaultContractObj,
        functionName: 'drainStart',
      },
      {
        ...defaultContractObj,
        functionName: 'drainSwitch',
      },
    ],
    enabled: isConnected,
  })

  if (data && data?.length > 0) {
    const round = data[0]?.result || 0
    const phase = data[1]?.result || 0
    const currentPot = data[2]?.result || BigInt(0)
    const ticketCount = data[3]?.result || 0
    const voteCount = data[4]?.result || 0
    const suddenDeath = data[5]?.result || 0
    const drainStart = data[6]?.result || 0
    const drainSwitch = Boolean(data[7]?.result || 0)

    // compute stage
    let stage: number

    if (round === 0) {
      stage = 0
    } else if (round < suddenDeath) {
      stage = 1
    } else if (round >= suddenDeath && drainSwitch === false) {
      stage = 2
    } else if (round > suddenDeath && round >= drainStart && drainSwitch === true) {
      stage = 3
    } else {
      stage = 0
    }

    const currentPotInEth = formatNumber(formatUnits(currentPot, 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })

    updateRound(Number(round))
    updatePhase(Number(phase))
    updateStage(Number(stage))
    updateSuddenDeath(Number(suddenDeath))
    updateCurrentPot(Number(currentPotInEth))
    updateTicketCount(Number(ticketCount))
    updateVoteCount(Number(voteCount))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  const background = router.pathname.includes('404') ? 'Default.svg' : typeStage[phase]

  return (
    <main
      className={`font-VT323 bg-cover bg-center bg-no-repeat min-h-screen`}
      style={{
        backgroundImage: `url(/background/${background})`,
      }}
    >
      <div className="container mx-auto">
        {/* {showWelcomeModal && <WelcomeModal toggleModal={toggleModal} />} */}
        <Header />
        {children}
        {/* <CompletionModal alertLookTest="afterPurchase" /> */}
      </div>
    </main>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
