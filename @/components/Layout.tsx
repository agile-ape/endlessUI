import Header from './Header'
import { Analytics } from '@vercel/analytics/react'
import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../store'
import { useTheme } from 'next-themes'
import { useAccount, useBalance, useContractRead, useContractReads, useWalletClient } from 'wagmi'
import {
  API_ENDPOINT,
  CHAIN_ID,
  WEBSOCKET_ENDPOINT,
  defaultContractObj,
  tokenContractObj,
  GAME_ADDRESS,
  TREASURY_ADDRESS,
} from '../../services/constant'
import Metadata, { type MetaProps } from './Metadata'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getTickets } from '../../services/_api'
import { fetcher, isJson, transformToTicket, formatNumber } from '@/lib/utils'
import CompletionModal from './ui/CompletionModal'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from './shadcn/use-toast'
import { formatUnits, parseUnits } from 'viem'
import { useSocketEvents, type Event } from '../../hooks/useSocketEvents'
import { useWindowSize } from '../../hooks/useWindowSize'

type LayoutProps = {
  children: React.ReactNode
  metadata: MetaProps
}

type Feeds = {
  block_timestamp: number
  block_number: number
  datetime: number
  message: {
    value: string
    args: Record<string, string>
  }
}

const Layout = ({ children, metadata }: LayoutProps) => {
  // Settings
  const updateCanBuyTicket = useStoreActions((actions) => actions.updateCanBuyTicket)
  const updateTicketPrice = useStoreActions((actions) => actions.updateTicketPrice)
  const updateBuyTicketDelayCeiling = useStoreActions(
    (actions) => actions.updateBuyTicketDelayCeiling,
  )
  const updateRoundTime = useStoreActions((actions) => actions.updateRoundTime)
  const updateFeeShare = useStoreActions((actions) => actions.updateFeeShare)
  const updateStartingPassRate = useStoreActions((actions) => actions.updateStartingPassRate)
  const updateAuctionPrice = useStoreActions((actions) => actions.updateAuctionPrice)
  const updatePoohPerRoll = useStoreActions((actions) => actions.updatePoohPerRoll)
  const updatePassRateRange = useStoreActions((actions) => actions.updatePassRateRange)
  const updatePassRateFloor = useStoreActions((actions) => actions.updatePassRateFloor)

  const updateRound = useStoreActions((actions) => actions.updateRound)
  const updateTimeFlag = useStoreActions((actions) => actions.updateTimeFlag)
  const updateBuyFlag = useStoreActions((actions) => actions.updateBuyFlag)
  const updatePotFlag = useStoreActions((actions) => actions.updatePotFlag)
  const updateTicketIdCounter = useStoreActions((actions) => actions.updateTicketIdCounter)
  const updateTicketCount = useStoreActions((actions) => actions.updateTicketCount)

  const updateCurrentPot = useStoreActions((actions) => actions.updateCurrentPot)
  const updateTokenBalance = useStoreActions((actions) => actions.updateTokenBalance)
  const updateAuctionAllowance = useStoreActions((actions) => actions.updateAuctionAllowance)
  const updateTotalPoohSupply = useStoreActions((actions) => actions.updateTotalPoohSupply)

  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  const updateEvents = useStoreActions((actions) => actions.updateEvents)
  const modifyPlayerTicket = useStoreActions((actions) => actions.modifyTicket)
  const updateOwnedTickets = useStoreActions((actions) => actions.updateOwnedTickets)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const updateLastChangedTicket = useStoreActions((actions) => actions.updateLastChangedTicket)

  const { mutate: globalMutate } = useSWRConfig()
  const { xs } = useWindowSize()

  const router = useRouter()
  const { address, isConnected } = useAccount()

  const { data, refetch: refetchInitData } = useContractReads({
    contracts: [
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
        functionName: 'buyTicketDelayCeiling',
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
        functionName: 'auctionPrice',
      },
      {
        ...defaultContractObj,
        functionName: 'poohPerRoll',
      },
      {
        ...defaultContractObj,
        functionName: 'passRateRange',
      },
      {
        ...defaultContractObj,
        functionName: 'passRateFloor',
      },
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
        functionName: 'ticketIdCounter',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketCount',
      },
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        ...tokenContractObj,
        functionName: 'allowance',
        args: [TREASURY_ADDRESS as `0x${string}`, GAME_ADDRESS as `0x${string}`],
      },
      {
        ...tokenContractObj,
        functionName: 'totalSupply',
      },
      // {
      //   ...defaultContractObj,
      //   functionName: 'getPlayerToIdArray',
      //   args: [address as `0x${string}`],
      // },
    ],
    enabled: isConnected,
  })

  /*
  currentPot => TicketList
  round => TicketList
  timeFlag => Countdown
  buyFlag => JoinGame
  potFlag => JoinGame, LoadLast
  ticketId => JoinGame
  ticketCount => TicketList
  canBuyTicket => JoinGame
  ticketPrice => JoinGame
  buyTicketDelay => JoinGame
  roundTime => Countdown
  feeShare => RoundChange
  startingPassRate => JoinGame
  lastMultiplier => LoadLast
  tokenBalance => LoadLast
  */

  if (data && data?.length > 0) {
    const canBuyTicket = data[0]?.result || false
    const ticketPrice = data[1]?.result || BigInt(0)
    const buyTicketDelayCeiling = data[2]?.result || BigInt(0)
    const roundTime = data[3]?.result || 0
    const feeShare = data[4]?.result || 0
    const startingPassRate = data[5]?.result || 0
    const auctionPrice = data[6]?.result || BigInt(0)
    const poohPerRoll = data[7]?.result || 0
    const passRateRange = data[8]?.result || 0
    const passRateFloor = data[9]?.result || 0
    const round = data[10]?.result || 0
    const timeFlag = data[11]?.result || BigInt(0)
    const buyFlag = data[12]?.result || BigInt(0)
    const potFlag = data[13]?.result || BigInt(0)
    const ticketIdCounter = data[14]?.result || 0
    const ticketCount = data[15]?.result || 0
    const tokenBalance = data?.[16].result || BigInt(0)
    const auctionAllowance = data?.[17].result || BigInt(0)
    const totalPoohSupply = data?.[8].result || BigInt(0)
    // const playerTickets = Array(data[17]?.result) || Array

    //----------------------------------------------------------- TICKETS ----------------------------------------------------------- *//
    const {
      data: ticketsData,
      error: ticketsError,
      mutate,
    } = useSWR<{
      data: Ticket[]
    }>(
      `/tickets/${CHAIN_ID}/${GAME_ADDRESS}/?page=1&limit=30&sortOrder=ASC&sortBy=ticketId`,
      fetcher,
    )

    if (ticketsData?.data.length) {
      // add all tickets
      const ticketList = transformToTicket(ticketsData?.data).filter(
        (item) => item.player !== '0x0000000000000000000000000000000000000000',
      )
      updateTickets(ticketList)

      // add owned tickets
      const ownedTickets = ticketList.filter(
        (item) => item.player.toLowerCase() === address?.toLowerCase(),
      )

      if (ownedTickets) {
        updateOwnedTickets(ownedTickets)
      }
    }

    //----------------------------------------------------------- EVENT LOGS ----------------------------------------------------------- *//
    // const {
    //   data: eventData,
    //   error: eventError,
    //   isLoading,
    // } = useSWR<{
    //   data: {
    //     id: number
    //     event: string
    //     topics1: string
    //     topics2: string
    //     topics3: string
    //   }[]

    //   // data: { id: number }[]
    // }>(`/events/${CHAIN_ID}?address=${GAME_ADDRESS}&page=1&limit=100`, fetcher)

    // if (eventData?.data.length) {
    //   // add all tickets
    //   const eventList = transformToEvent(eventData?.data)
    //   updateEvents(eventList)
    // }

    /*
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
    */

    const { data: balanceData, refetch: refetchBalance } = useBalance({
      address: GAME_ADDRESS,
    })

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

    const formattedAuctionPrice = formatNumber(formatUnits(auctionPrice, 1), {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })

    const formattedAuctionAllowance = formatNumber(formatUnits(auctionAllowance, 18), {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })

    const formattedTotalPoohSupply = formatNumber(formatUnits(totalPoohSupply, 18), {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })

    updateCanBuyTicket(Boolean(canBuyTicket))
    updateTicketPrice(Number(formattedTicketPrice))
    updateBuyTicketDelayCeiling(Number(buyTicketDelayCeiling))
    updateRoundTime(Number(roundTime))
    updateFeeShare(Number(feeShare))
    updateStartingPassRate(Number(startingPassRate))
    updateAuctionPrice(Number(formattedAuctionPrice))
    updatePoohPerRoll(Number(poohPerRoll))
    updatePassRateRange(Number(passRateRange))
    updatePassRateFloor(Number(passRateFloor))

    updateRound(Number(round))
    updateTimeFlag(Number(timeFlag))
    updateBuyFlag(Number(buyFlag))
    updatePotFlag(Number(potFlag))
    updateTicketIdCounter(Number(ticketIdCounter))
    updateTicketCount(Number(ticketCount))

    updateCurrentPot(Number(formattedCurrentPot))
    updateTokenBalance(Number(formattedTokenBalance))
    updateAuctionAllowance(Number(formattedAuctionAllowance))
    updateTotalPoohSupply(Number(formattedTotalPoohSupply))
  }

  const refreshData = () => {
    router.replace(router.asPath)
  }

  return (
    <>
      <main
        className={`font-VT323 bg-cover bg-center bg-no-repeat min-h-screen`}
        style={{
          backgroundImage: xs
            ? `url(/background/PeaceFoundMobile.svg)`
            : `url(/background/Pooh.svg)`,
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
