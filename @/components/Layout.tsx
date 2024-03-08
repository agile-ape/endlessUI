import Header from './Header'
import { Analytics } from '@vercel/analytics/react'
import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../store'
import { useTheme } from 'next-themes'
import { useAccount, useBalance, useContractRead, useContractReads, useWalletClient } from 'wagmi'
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

type LayoutProps = {
  children: React.ReactNode
  metadata: MetaProps
}

const Layout = ({ children, metadata }: LayoutProps) => {
  const updateCurrentPot = useStoreActions((actions) => actions.updateCurrentPot)
  const updateRound = useStoreActions((actions) => actions.updateRound)
  const updateTimeFlag = useStoreActions((actions) => actions.updateTimeFlag)
  const updateBuyFlag = useStoreActions((actions) => actions.updateBuyFlag)
  const updatePotFlag = useStoreActions((actions) => actions.updatePotFlag)
  const updateTicketId = useStoreActions((actions) => actions.updateTicketId)
  const updateTicketCount = useStoreActions((actions) => actions.updateTicketCount)
  const updateCanBuyTicket = useStoreActions((actions) => actions.updateCanBuyTicket)
  const updateTicketPrice = useStoreActions((actions) => actions.updateTicketPrice)
  const updateBuyTicketDelay = useStoreActions((actions) => actions.updateBuyTicketDelay)
  const updateRoundTime = useStoreActions((actions) => actions.updateRoundTime)
  const updateFeeShare = useStoreActions((actions) => actions.updateFeeShare)
  const updateStartingPassRate = useStoreActions((actions) => actions.updateStartingPassRate)
  const updateLastMultiplier = useStoreActions((actions) => actions.updateLastMultiplier)
  const updateTokenBalance = useStoreActions((actions) => actions.updateTokenBalance)

  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  const modifyPlayerTicket = useStoreActions((actions) => actions.modifyTicket)
  const updateOwnedTicket = useStoreActions((actions) => actions.updateOwnedTicket)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const updateLastChangedTicket = useStoreActions((actions) => actions.updateLastChangedTicket)

  const { mutate: globalMutate } = useSWRConfig()
  const { xs } = useWindowSize()

  const router = useRouter()
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
      (item) => item.player !== '0x0000000000000000000000000000000000000000',
    )

    const ownedTicket = ticketList.find(
      (item) => item.player.toLowerCase() === address?.toLowerCase(),
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

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: GAME_ADDRESS,
  })

  const { data, refetch: refetchInitData } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'round',
      },
      {
        ...defaultContractObj,
        functionName: 'timeFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'buyFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'potFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketId',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketCount',
      },
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketPrice',
      },
      {
        ...defaultContractObj,
        functionName: 'buyTicketDelay',
      },
      {
        ...defaultContractObj,
        functionName: 'roundTime',
      },
      {
        ...defaultContractObj,
        functionName: 'feeShare',
      },
      {
        ...defaultContractObj,
        functionName: 'startingPassRate',
      },
      {
        ...defaultContractObj,
        functionName: 'lastMultiplier',
      },
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
    ],
    enabled: isConnected,
  })

  /*
  round
  timeFlag
  buyFlag => JoinGame
  potFlag => JoinGame, LoadLast
  ticketId => JoinGame
  ticketCount
  canBuyTicket => JoinGame
  ticketPrice => JoinGame
  buyTicketDelay => JoinGame
  roundTime
  feeShare => RoundChange
  startingPassRate => JoinGame
  lastMultiplier => LoadLast
  tokenBalance => LoadLast
  */

  if (data && data?.length > 0) {
    const round = data[0]?.result || 0
    const timeFlag = data[1]?.result || BigInt(0)
    const buyFlag = data[2]?.result || BigInt(0)
    const potFlag = data[3]?.result || BigInt(0)
    const ticketId = data[4]?.result || 0
    const ticketCount = data[5]?.result || 0
    const canBuyTicket = data[6]?.result || false
    const ticketPrice = data[7]?.result || BigInt(0)
    const buyTicketDelay = data[8]?.result || BigInt(0)
    const roundTime = data[9]?.result || 0
    const feeShare = data[10]?.result || 0
    const startingPassRate = data[11]?.result || 0
    const lastMultiplier = data[12]?.result || 0
    const tokenBalance = data?.[13].result || BigInt(0)

    const formattedCurrentPot = formatNumber(formatUnits(balanceData?.value || BigInt(0), 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })

    const formattedTicketPrice = formatNumber(formatUnits(ticketPrice, 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })

    const formattedTokenBalance = formatNumber(formatUnits(tokenBalance, 18), {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })

    updateCurrentPot(Number(formattedCurrentPot))
    updateRound(Number(round))
    updateTimeFlag(Number(timeFlag))
    updateBuyFlag(Number(buyFlag))
    updatePotFlag(Number(potFlag))
    updateTicketId(Number(ticketId))
    updateTicketCount(Number(ticketCount))
    updateCanBuyTicket(Boolean(canBuyTicket))
    updateTicketPrice(Number(formattedTicketPrice))
    updateBuyTicketDelay(Number(buyTicketDelay))
    updateRoundTime(Number(roundTime))
    updateFeeShare(Number(feeShare))
    updateStartingPassRate(Number(startingPassRate))
    updateLastMultiplier(Number(lastMultiplier))
    updateTokenBalance(Number(formattedTokenBalance))
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
