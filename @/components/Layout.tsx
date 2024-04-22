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

const Layout = ({ children, metadata }: LayoutProps) => {
  const updateCanBuyTicket = useStoreActions((actions) => actions.updateCanBuyTicket)
  // const updateFundedAmount = useStoreActions((actions) => actions.updateFundedAmount)
  // const updateFundersToAmt = useStoreActions((actions) => actions.updateFundersToAmt)
  // const updateFundersShare = useStoreActions((actions) => actions.updateFundersShare)
  // const updateFundersPot = useStoreActions((actions) => actions.updateFundersPot)
  // const updateFundersClaimed = useStoreActions((actions) => actions.updateFundersClaimed)

  const updateCanClaim = useStoreActions((actions) => actions.updateCanClaim)
  const updateUnclaimedPot = useStoreActions((actions) => actions.updateUnclaimedPot)
  const updateRolloverShare = useStoreActions((actions) => actions.updateRolloverShare)
  const updateRolloverPot = useStoreActions((actions) => actions.updateRolloverPot)
  const updateReferralsPot = useStoreActions((actions) => actions.updateReferralsPot)

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
  const updatePlayerToProfileId = useStoreActions((actions) => actions.updatePlayerToProfileId)
  const updateMinAllowedNumber = useStoreActions((actions) => actions.updateMinAllowedNumber)
  const updateMaxAllowedNumber = useStoreActions((actions) => actions.updateMaxAllowedNumber)
  const updateCloseTime = useStoreActions((actions) => actions.updateCloseTime)
  const updateEndGameFlag = useStoreActions((actions) => actions.updateEndGameFlag)
  const updatePlayersShare = useStoreActions((actions) => actions.updatePlayersShare)
  const updateReferralsShare = useStoreActions((actions) => actions.updateReferralsShare)
  const updatePlayersPot = useStoreActions((actions) => actions.updatePlayersPot)

  const updateNumberList = useStoreActions((actions) => actions.updateNumberList)
  const updateAverageList = useStoreActions((actions) => actions.updateAverageList)
  const updateReferral = useStoreActions((actions) => actions.updateReferral)

  const { xs } = useWindowSize()

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
        functionName: 'canClaim',
      },
      {
        ...defaultContractObj,
        functionName: 'unclaimedPot',
      },
      {
        ...defaultContractObj,
        functionName: 'rolloverShare',
      },
      {
        ...defaultContractObj,
        functionName: 'rolloverPot',
      },
      {
        ...defaultContractObj,
        functionName: 'referralsPot',
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
        functionName: 'getTickets',
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
        functionName: 'playerToProfileId',
        args: [address as `0x${string}`],
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
      // {
      //   ...defaultContractObj,
      //   functionName: 'lastRound',
      // },
    ],
  })

  const canBuyTicket = data?.[0].result || true
  const canClaim = data?.[1].result || false
  const unclaimedPot = data?.[2].result || BigInt(0)
  const rolloverShare = data?.[3].result || BigInt(0)
  const rolloverPot = data?.[4].result || BigInt(0)
  const referralsPot = data?.[5].result || BigInt(0)
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
  const playerToProfileId = data?.[20].result || false
  const minAllowedNumber = data?.[21].result || BigInt(0)
  const maxAllowedNumber = data?.[22].result || BigInt(0)
  const closeTime = data?.[23].result || BigInt(0)
  const endGameFlag = data?.[24].result || BigInt(0)
  const playersShare = data?.[25].result || BigInt(0)
  const referralsShare = data?.[26].result || BigInt(0)
  const playersPot = data?.[27].result || BigInt(0)
  // const lastRound = data?.[28].result || false

  // const formattedFundedAmount = formatNumber(formatUnits(BigInt(fundedAmount), 18), {
  //   maximumFractionDigits: 3,
  //   minimumFractionDigits: 0,
  // })

  // const formattedFundersToAmt = formatNumber(formatUnits(BigInt(fundersToAmt), 18), {
  //   maximumFractionDigits: 3,
  //   minimumFractionDigits: 0,
  // })

  // const formattedFundersPot = formatNumber(formatUnits(BigInt(fundersPot), 18), {
  //   maximumFractionDigits: 3,
  //   minimumFractionDigits: 0,
  // })

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

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

  updateCanBuyTicket(Boolean(canBuyTicket))

  updateCanClaim(Boolean(canClaim))
  updateUnclaimedPot(Number(unclaimedPot))
  updateRolloverShare(Number(rolloverShare))
  updateRolloverPot(Number(rolloverPot))
  updateReferralsPot(Number(referralsToShare))
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
  updatePlayerToProfileId(Number(playerToProfileId))
  updateMinAllowedNumber(Number(minAllowedNumber))
  updateMaxAllowedNumber(Number(maxAllowedNumber))
  updateCloseTime(Number(closeTime))
  updateEndGameFlag(Number(endGameFlag))
  updatePlayersShare(Number(playersShare))
  updateReferralsShare(Number(referralsShare))
  updatePlayersPot(Number(playersToShare))

  // updateFundedAmount(Number(formattedFundedAmount))
  // updateFundersToAmt(Number(formattedFundersToAmt))
  // updateFundersShare(Number(fundersShare))
  // updateFundersPot(Number(formattedFundersPot))
  // updateFundersClaimed(Boolean(fundersClaimed))
  // updateCanFundPot(Boolean(canFundPot))

  socket.connect()

  useEffect(() => {
    refetch()
  }, [])

  useAccountEffect({
    onConnect(data) {
      const playerAddress = {
        address: data.address,
      }
      logPlayer(playerAddress)
    },
    onDisconnect() {},
  })

  const logPlayer = async (data: any) => {
    try {
      const logPlayerSuccess = await poster(data, '/players')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const events: Event[] = [
    {
      name: `NewTicketBought`,
      handler(data) {
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
    // {
    //   name: `PotAdded`,
    //   handler(data) {
    //     const formattedAmount = formatNumber(formatUnits(BigInt(data.args[0].hex), 18), {
    //       maximumFractionDigits: 3,
    //       minimumFractionDigits: 0,
    //     })
    //     refetch()
    //     toast({
    //       variant: 'contributed',
    //       description: (
    //         <p className="text-xl">
    //           🍎 <span className="font-digit">{formattedAmount}</span> ETH was added to the pot
    //         </p>
    //       ),
    //     })
    //   },
    // },
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
