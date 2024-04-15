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
import { isJson, formatNumber, poster } from '@/lib/utils'
import CompletionModal from './ui/GameEnd'
import useSWR, { useSWRConfig } from 'swr'
import { toast } from './shadcn/use-toast'
import { formatUnits, parseUnits } from 'viem'
import { useSocketEvents, type Event } from '../../hooks/useSocketEvents'
import { useWindowSize } from '../../hooks/useWindowSize'
import { socket } from '@/lib/socket'
import { useAccountEffect } from 'wagmi'
import GameEnd from '@/components/ui/GameEnd'
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
  const updateCanBuyTicket = useStoreActions((actions) => actions.updateCanBuyTicket)
  const updateFundedAmount = useStoreActions((actions) => actions.updateFundedAmount)
  const updateFundersToAmt = useStoreActions((actions) => actions.updateFundersToAmt)
  const updateFundersShare = useStoreActions((actions) => actions.updateFundersShare)
  const updateFundersPot = useStoreActions((actions) => actions.updateFundersPot)
  const updateFundersClaimed = useStoreActions((actions) => actions.updateFundersClaimed)
  const updateCurrentAverage = useStoreActions((actions) => actions.updateCurrentAverage)
  const updateLeaderboard = useStoreActions((actions) => actions.updateLeaderboard)
  const updateTicketsBought = useStoreActions((actions) => actions.updateTicketsBought)
  const updateTicketPrice = useStoreActions((actions) => actions.updateTicketPrice)
  const updateGameTime = useStoreActions((actions) => actions.updateGameTime)
  const updateTimeAddon = useStoreActions((actions) => actions.updateTimeAddon)
  const updateStartGameFlag = useStoreActions((actions) => actions.updateStartGameFlag)
  const updateTotalNumber = useStoreActions((actions) => actions.updateTotalNumber)
  const updatePotSize = useStoreActions((actions) => actions.updatePotSize)
  const updatePlayersPayoutFactor = useStoreActions((actions) => actions.updatePlayersPayoutFactor)
  const updateWinnersSplit = useStoreActions((actions) => actions.updateWinnersSplit)
  const updatePlayerTickets = useStoreActions((actions) => actions.updatePlayerTickets)
  const updateWinnersPot = useStoreActions((actions) => actions.updateWinnersPot)
  const updateWinnersShare = useStoreActions((actions) => actions.updateWinnersShare)
  const updateCanFundPot = useStoreActions((actions) => actions.updateCanFundPot)
  const updateMinAllowedNumber = useStoreActions((actions) => actions.updateMinAllowedNumber)
  const updateMaxAllowedNumber = useStoreActions((actions) => actions.updateMaxAllowedNumber)
  const updateCloseTime = useStoreActions((actions) => actions.updateCloseTime)
  const updateEndGameFlag = useStoreActions((actions) => actions.updateEndGameFlag)
  const updatePlayersShare = useStoreActions((actions) => actions.updatePlayersShare)
  const updateReferralsShare = useStoreActions((actions) => actions.updateReferralsShare)
  const updatePlayersPot = useStoreActions((actions) => actions.updatePlayersPot)
  const updateReferralsPot = useStoreActions((actions) => actions.updateReferralsPot)

  const updateNumberList = useStoreActions((actions) => actions.updateNumberList)
  const updateAverageList = useStoreActions((actions) => actions.updateAverageList)
  const updateReferral = useStoreActions((actions) => actions.updateReferral)

  // const { mutate: globalMutate } = useSWRConfig()
  const { xs } = useWindowSize()

  // const router = useRouter()

  const { address, isConnected } = useAccount()

  /*================================================== GAME SETTINGS ==================================================*/
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
      {
        ...defaultContractObj,
        functionName: 'fundedAmount',
      },
      {
        ...defaultContractObj,
        functionName: 'fundersToAmt',
        args: [address as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'fundersShare',
      },
      {
        ...defaultContractObj,
        functionName: 'fundersPot',
      },
      {
        ...defaultContractObj,
        functionName: 'fundersClaimed',
        args: [address as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'currentAverage',
      },
      {
        ...defaultContractObj,
        functionName: 'computeLeaderboard',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketIdCounter',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketPrice',
      },
      {
        ...defaultContractObj,
        functionName: 'gameTime',
      },
      {
        ...defaultContractObj,
        functionName: 'timeAddon',
      },
      {
        ...defaultContractObj,
        functionName: 'startGameFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'totalNumber',
      },
      {
        ...defaultContractObj,
        functionName: 'potAmount',
      },
      {
        ...defaultContractObj,
        functionName: 'playersPayoutFactor',
      },
      {
        ...defaultContractObj,
        functionName: 'winnersSplit',
      },
      {
        ...defaultContractObj,
        functionName: 'getPlayerToIdArray',
        args: [address as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'winnersPot',
      },
      {
        ...defaultContractObj,
        functionName: 'winnersShare',
      },
      {
        ...defaultContractObj,
        functionName: 'canFundPot',
      },
      {
        ...defaultContractObj,
        functionName: 'minAllowedNumber',
      },
      {
        ...defaultContractObj,
        functionName: 'maxAllowedNumber',
      },
      {
        ...defaultContractObj,
        functionName: 'closeTime',
      },
      {
        ...defaultContractObj,
        functionName: 'endGameFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'playersShare',
      },
      {
        ...defaultContractObj,
        functionName: 'referralsShare',
      },
      {
        ...defaultContractObj,
        functionName: 'playersPot',
      },
      {
        ...defaultContractObj,
        functionName: 'referralsPot',
      },
    ],
  })

  const canBuyTicket = data?.[0].result || false
  const fundedAmount = data?.[1].result || BigInt(0)
  const fundersToAmt = data?.[2].result || BigInt(0)
  const fundersShare = data?.[3].result || BigInt(0)
  const fundersPot = data?.[4].result || BigInt(0)
  const fundersClaimed = data?.[5].result || false
  const currentAverage = data?.[6].result || BigInt(0)
  const leaderboard: readonly bigint[] = data?.[7].result || []
  const ticketsBought = data?.[8].result || BigInt(0)
  const ticketPrice = data?.[9].result || BigInt(0)
  const gameTime = data?.[10].result || BigInt(0)
  const timeAddon = data?.[11].result || BigInt(0)
  const startGameFlag = data?.[12].result || BigInt(0)
  const totalNumber = data?.[13].result || BigInt(0)
  const potSize = data?.[14].result || BigInt(0)
  const playersPayoutFactor = Number(data?.[15].result || BigInt(0))
  const winnersSplit = data?.[16].result || BigInt(0)
  const playerTickets = data?.[17]?.result || []
  const winnersPot = data?.[18].result || BigInt(0)
  const winnersShare = data?.[19].result || BigInt(0)
  const canFundPot = data?.[20].result || false
  const minAllowedNumber = data?.[21].result || BigInt(0)
  const maxAllowedNumber = data?.[22].result || BigInt(0)
  const closeTime = data?.[23].result || BigInt(0)
  const endGameFlag = data?.[24].result || BigInt(0)
  const playersShare = data?.[25].result || BigInt(0)
  const referralsShare = data?.[26].result || BigInt(0)
  const playersPot = data?.[27].result || BigInt(0)
  const referralsPot = data?.[28].result || BigInt(0)

  const formattedFundedAmount = formatNumber(formatUnits(BigInt(fundedAmount), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const formattedFundersToAmt = formatNumber(formatUnits(BigInt(fundersToAmt), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const formattedFundersPot = formatNumber(formatUnits(BigInt(fundersPot), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

  // const formattedTicketPrice = formatNumber(formatUnits(ticketPrice, 18), {
  //   maximumFractionDigits: 3,
  //   minimumFractionDigits: 3,
  // })

  // const formattedPotSize = formatNumber(formatUnits(potSize, 18), {
  //   maximumFractionDigits: 6,
  //   minimumFractionDigits: 3,
  // })

  const formattedWinnersSplit = formatNumber(formatUnits(winnersSplit, 18), {
    maximumFractionDigits: 4,
    minimumFractionDigits: 3,
  })

  let formattedPlayerTickets: number[] = []

  for (let i = 0; i < playerTickets.length; i++) {
    formattedPlayerTickets[i] = Number(playerTickets[i])
  }

  const winnersToShare = formatNumber(formatUnits(BigInt(winnersPot), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const playersToShare = formatNumber(formatUnits(BigInt(playersPot), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const referralsToShare = formatNumber(formatUnits(BigInt(referralsPot), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  // const percentOfPot = formatNumber((Number(playerContribution) / Number(totalFunded)) * 100, {
  //   maximumFractionDigits: 2,
  //   minimumFractionDigits: 0,
  // })

  // const claimAmount = formatNumber((Number(percentOfPot) / 100) * Number(potToShare), {
  //   maximumFractionDigits: 5,
  //   minimumFractionDigits: 0,
  // })

  /*
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

  updateCanBuyTicket(Boolean(canBuyTicket))
  updateFundedAmount(Number(formattedFundedAmount))
  updateFundersToAmt(Number(formattedFundersToAmt))
  updateFundersShare(Number(fundersShare))
  updateFundersPot(Number(formattedFundersPot))
  updateFundersClaimed(Boolean(fundersClaimed))
  updateCurrentAverage(Number(currentAverage))
  updateLeaderboard(winningNumbers)
  updateTicketsBought(Number(ticketsBought))
  updateTicketPrice(ticketPrice)
  updateGameTime(Number(gameTime))
  updateTimeAddon(Number(timeAddon))
  updateStartGameFlag(Number(startGameFlag))
  updateTotalNumber(Number(totalNumber))
  updatePotSize(potSize)
  updatePlayersPayoutFactor(Number(playersPayoutFactor))
  updateWinnersSplit(Number(formattedWinnersSplit))
  updatePlayerTickets(formattedPlayerTickets)
  updateWinnersPot(Number(winnersToShare))
  updateWinnersShare(Number(winnersShare))

  updateCanFundPot(Boolean(canFundPot))
  updateMinAllowedNumber(Number(minAllowedNumber))
  updateMaxAllowedNumber(Number(maxAllowedNumber))
  updateCloseTime(Number(closeTime))
  updateEndGameFlag(Number(endGameFlag))
  updatePlayersShare(Number(playersShare))
  updateReferralsShare(Number(referralsShare))
  updatePlayersPot(Number(playersToShare))
  updateReferralsPot(Number(referralsToShare))

  socket.connect()

  useAccountEffect({
    onConnect(data) {
      console.log('Connected!', data)
      const playerAddress = {
        address: data.address,
      }
      logPlayer(playerAddress)
      console.log('success')
    },
    onDisconnect() {
      console.log('Disconnected!')
    },
  })

  const logPlayer = async (data: any) => {
    try {
      const logPlayerSuccess = await poster(data, '/players')
      console.log(logPlayerSuccess)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // toast({
  //   variant: 'success',
  //   // title: 'Keyword updated',
  //   description: <p>socket connected.</p>,
  // })

  const events: Event[] = [
    {
      name: `NewTicketBought`,
      handler(data) {
        console.log(data.args[2].hex)
        const formattedNumber = Number(data.args[2].hex)
        refetch()
        toast({
          variant: 'bought',
          description: (
            <p className="text-xl">
              💾 Disk of #️⃣<span className="font-digit">{formattedNumber}</span> is bought
            </p>
          ),
        })
      },
    },
    {
      name: `PotAdded`,
      handler(data) {
        const formattedAmount = formatNumber(formatUnits(BigInt(data.args[0].hex), 18), {
          maximumFractionDigits: 3,
          minimumFractionDigits: 0,
        })
        refetch()
        toast({
          variant: 'contributed',
          description: (
            <p className="text-xl">
              🍎 <span className="font-digit">{formattedAmount}</span> ETH was added to the pot
            </p>
          ),
        })
      },
    },
  ]

  useSocketEvents(events)

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
          <GameEnd open={!canBuyTicket} />
        </div>
      </main>
    </>
  )
}

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
})
