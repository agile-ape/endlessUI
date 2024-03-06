import Header from './Header'
import { Analytics } from '@vercel/analytics/react'
import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../store'
import { useTheme } from 'next-themes'
import { useAccount, useContractRead, useContractReads, useWalletClient } from 'wagmi'
import {
  API_ENDPOINT,
  GAME_ADDRESS,
  CHAIN_ID,
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
import WelcomeModal from './ui/PWADrawer'
import CompletionModal from './ui/CompletionModal'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from '../components/ui/use-toast'
import { formatUnits, parseUnits } from 'viem'
import { useSocketEvents, type Event } from '../../hooks/useSocketEvents'
import { useWindowSize } from '../../hooks/useWindowSize'
// import { usePrivyWagmi } from '@privy-io/wagmi-connector'
// import { usePrivy, useLogin, useLogout, useWallets, useConnectWallet } from '@privy-io/react-auth'

const typeStage: Record<IApp['phase'], string> = {
  deployed: 'Deployed',
  start: 'Start',
  day: 'Day',
  night: 'Night',
  lastmanfound: 'LastManFound',
  drain: 'Drain',
  peacefound: 'PeaceFound',
  gameclosed: 'GameClosed',
}

type LayoutProps = {
  children: React.ReactNode
  metadata: MetaProps
  // phase: IApp['phase']
}

const Layout = ({ children, metadata }: LayoutProps) => {
  const updateRound = useStoreActions((actions) => actions.updateRound)
  const updatePhase = useStoreActions((actions) => actions.updatePhase)
  const updateStage = useStoreActions((actions) => actions.updateStage)
  const updateSuddenDeath = useStoreActions((actions) => actions.updateSuddenDeath)
  const updateCurrentPot = useStoreActions((actions) => actions.updateCurrentPot)
  const updateTicketCount = useStoreActions((actions) => actions.updateTicketCount)
  const updateVoteCount = useStoreActions((actions) => actions.updateVoteCount)
  const updateNextTicketPrice = useStoreActions((actions) => actions.updateNextTicketPrice)
  const updateTokenBalance = useStoreActions((actions) => actions.updateTokenBalance)

  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  const modifyPlayerTicket = useStoreActions((actions) => actions.modifyTicket)
  const updateOwnedTicket = useStoreActions((actions) => actions.updateOwnedTicket)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const updateLastChangedTicket = useStoreActions((actions) => actions.updateLastChangedTicket)

  const { mutate: globalMutate } = useSWRConfig()
  const { xs } = useWindowSize()

  // const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
  //   const showWelcomeModal = localStorage.getItem('showWelcomeModal')
  //   const result = showWelcomeModal ? JSON.parse(showWelcomeModal) : true
  //   return result
  // })

  // const toggleModal = () => {
  //   setShowWelcomeModal((prevState) => !prevState)
  //   localStorage.setItem('showWelcomeModal', 'false')
  // }

  // const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true)

  // const toggleModal = () => {
  //   setShowWelcomeModal((prevState) => !prevState)
  // }

  const router = useRouter()
  // const { wallet: activeWallet } = usePrivyWagmi()
  // const { authenticated } = usePrivy()
  const { address, isConnected } = useAccount()

  const {
    data: ticketsData,
    error,
    mutate,
  } = useSWR<{
    data: Ticket[]
  }>(
    `/tickets/${CHAIN_ID}?page=1&limit=30&sortOrder=ASC&sortBy=purchasePrice&contractAddress=${GAME_ADDRESS}`,
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
      name: `tickets-${CHAIN_ID}-${GAME_ADDRESS}`,
      handler(data) {
        if (!data?.id) return

        updateLastChangedTicket(data.id)
        // setTimeout(() => updateLastChangedTicket(0), 3000)

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
      name: `events-${CHAIN_ID}-${GAME_ADDRESS}`,
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
          // const priceRate = formatUnits(price || BigInt(0), 3)
          toast({
            variant: 'info',
            // title: 'Keyword updated',
            description: <p>Safehouse price is now {price} $LAST per night </p>,
          })
        }

        if (event === 'TokenEmission') {
          const { emission, time } = dataJson
          // const emissionRate = formatUnits(emission || BigInt(0), 3)
          toast({
            variant: 'info',
            // title: 'Keyword updated',
            description: <p>Tokens are now emitted at {emission} $LAST per attack </p>,
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
      {
        ...defaultContractObj,
        functionName: 'nextTicketPrice',
      },
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
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
    const nextTicketPrice = data[8]?.result || BigInt(0)
    const balanceOf = data?.[9].result || BigInt(0)

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

    const nextTicketPriceInEth = formatNumber(formatUnits(nextTicketPrice, 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })

    const tokenBalance = formatNumber(formatUnits(balanceOf, 18), {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })

    updateRound(Number(round))
    updatePhase(Number(phase))
    updateStage(Number(stage))
    updateSuddenDeath(Number(suddenDeath))
    updateCurrentPot(Number(currentPotInEth))
    updateTicketCount(Number(ticketCount))
    updateVoteCount(Number(voteCount))
    updateNextTicketPrice(Number(nextTicketPriceInEth))
    updateTokenBalance(Number(tokenBalance))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  return (
    <>
      <main
        className={`font-VT323 bg-cover bg-center bg-no-repeat min-h-screen`}
        style={{
          backgroundImage: xs ? `url(/background/StartMobile.svg)` : `url(/background/Start.svg)`,
        }}
      >
        <div className="container mx-auto p-0">
          {/* {showWelcomeModal && <WelcomeModal toggleModal={toggleModal} />} */}
          <Header />
          {children}
          <Analytics />
          <CompletionModal alertLookTest="afterPurchase" />
        </div>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
