import Header from './Header'
import { Analytics } from '@vercel/analytics/react'
// import type { IApp, Ticket } from 'types/app'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../store'
import { useTheme } from 'next-themes'
import { useAccount, useBalance, useReadContracts, useWalletClient } from 'wagmi'
import { CHAIN_ID, defaultContractObj, GAME_ADDRESS } from '../../services/constant'
import Metadata, { type MetaProps } from './Metadata'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { isJson, formatNumber } from '@/lib/utils'
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

// type Feeds = {
//   block_timestamp: number
//   block_number: number
//   datetime: number
//   message: {
//     value: string
//     args: Record<string, string>
//   }
// }

const Layout = ({ children, metadata }: LayoutProps) => {
  // Settings
  // const updateCanBuyTicket = useStoreActions((actions) => actions.updateCanBuyTicket)
  // const updateTicketPrice = useStoreActions((actions) => actions.updateTicketPrice)
  // const updateBuyTicketDelayCeiling = useStoreActions(
  //   (actions) => actions.updateBuyTicketDelayCeiling,
  // )
  // const updateRoundTime = useStoreActions((actions) => actions.updateRoundTime)
  // const updateFeeShare = useStoreActions((actions) => actions.updateFeeShare)
  // const updateStartingPassRate = useStoreActions((actions) => actions.updateStartingPassRate)
  // const updateAuctionPrice = useStoreActions((actions) => actions.updateAuctionPrice)
  // const updatePoohPerRoll = useStoreActions((actions) => actions.updatePoohPerRoll)
  // const updatePassRateRange = useStoreActions((actions) => actions.updatePassRateRange)
  // const updatePassRateFloor = useStoreActions((actions) => actions.updatePassRateFloor)

  // const updateRound = useStoreActions((actions) => actions.updateRound)
  // const updateTimeFlag = useStoreActions((actions) => actions.updateTimeFlag)
  // const updateBuyFlag = useStoreActions((actions) => actions.updateBuyFlag)
  // const updatePotFlag = useStoreActions((actions) => actions.updatePotFlag)
  // const updateTicketIdCounter = useStoreActions((actions) => actions.updateTicketIdCounter)
  // const updateTicketCount = useStoreActions((actions) => actions.updateTicketCount)

  // const updateCurrentPot = useStoreActions((actions) => actions.updateCurrentPot)
  // const updateTokenBalance = useStoreActions((actions) => actions.updateTokenBalance)
  // const updateAuctionAllowance = useStoreActions((actions) => actions.updateAuctionAllowance)
  // const updateTotalPoohSupply = useStoreActions((actions) => actions.updateTotalPoohSupply)

  // const updateTickets = useStoreActions((actions) => actions.updateTickets)
  // const updateEvents = useStoreActions((actions) => actions.updateEvents)
  // const modifyPlayerTicket = useStoreActions((actions) => actions.modifyTicket)
  // const updateOwnedTickets = useStoreActions((actions) => actions.updateOwnedTickets)
  // const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  // const updateLastChangedTicket = useStoreActions((actions) => actions.updateLastChangedTicket)

  // const { mutate: globalMutate } = useSWRConfig()
  const { xs } = useWindowSize()

  // const router = useRouter()
  // const { address, isConnected } = useAccount()

  /*
  const { data, refetch: refetchInitData } = useReadContracts({
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
    ],
  })

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

  */

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
