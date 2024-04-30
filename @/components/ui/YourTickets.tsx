import React, { useEffect, useState, useCallback } from 'react'
import type { PropsWithChildren } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import Image from 'next/image'
import { Button } from '../shadcn/button'
import TicketUI from './TicketUI'
import { useStoreActions, useStoreState } from '../../../store'

import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'
import { readContract } from '@wagmi/core'
import { GAME_ADDRESS, TWITTER_URL, defaultContractObj } from '../../../services/constant'
import { cn } from '@/lib/utils'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useDotButton,
  DotButton,
  usePrevNextButtons,
  PrevButton,
  NextButton,
} from '../shadcn/navigation'
import { WagmiProvider, http, createConfig } from 'wagmi'
import {
  arbitrum,
  arbitrumGoerli,
  goerli,
  mainnet,
  base,
  baseGoerli,
  blastSepolia,
  blast,
} from 'wagmi/chains'
import { formatNumber } from '@/lib/utils'
import { formatUnits, parseEther } from 'viem'
import CountUp from 'react-countup'
import { toast } from '../shadcn/use-toast'

/*-------------------------------------- DOT BUTTONS -------------------------------------- */

/*-------------------------------------- Prev Next Buttons --------------------------------------*/

// type Ticket = {
//   id: number
//   player: string
//   number: number
//   isWinner: boolean
//   winnerClaimYet: boolean
//   playerClaimYet: boolean
// }

type Ticket = {
  id: number
  player: string
  number: number
  isWinner: boolean
  winnerClaimYet: boolean
  playerClaimYet: boolean
}

const defaultTicket = {
  id: 0,
  player: '0',
  number: 0,
  isWinner: false,
  winnerClaimYet: false,
  playerClaimYet: false,
}

const YourTickets = () => {
  const { address, isConnected } = useAccount()
  const playerTickets = useStoreState((state) => state.playerTickets)
  const canBuyTicket = useStoreState((state) => state.canBuyTicket)
  const winnersPot = useStoreState((state) => state.winnersPot)
  const winnersShare = useStoreState((state) => state.winnersShare)
  const rolloverShare = useStoreState((state) => state.rolloverShare)
  const potSize = useStoreState((state) => state.potSize)
  const ticketsBought = useStoreState((state) => state.ticketsBought)
  // const playersPot = useStoreState((state) => state.playersPot)
  const playersShare = useStoreState((state) => state.playersShare)
  const leaderboard = useStoreState((state) => state.leaderboard)
  const profile = useStoreState((state) => state.profile)
  const canClaim = useStoreState((state) => state.canClaim)
  const unclaimedPot = useStoreState((state) => state.unclaimedPot)
  const lastRoundUnclaimedPot = useStoreState((state) => state.lastRoundUnclaimedPot)
  const lastProfile = useStoreState((state) => state.lastProfile)

  console.log(playerTickets)
  /* read contracts
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'getPlayerToIdArray',
        args: [address as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'computeLeaderboard',
      },
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
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
        functionName: 'potAmount',
      },
    ],
  })

  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'NewTicketBought',
    onLogs() {
      refetch()
    },
    poll: true,
  })

  */

  // useWatchContractEvent({
  //   ...defaultContractObj,
  //   eventName: 'PlayersClaimed',
  //   onLogs() {
  //     refetch()
  //   },
  //   poll: true,
  // })

  // const playerTickets = data?.[0]?.result || []
  // const leaderboard: readonly bigint[] = data?.[1].result || []
  // const canBuyTicket = data?.[2].result || false
  // const winnersPot = data?.[3].result || BigInt(0)
  // const winnersShare = data?.[4].result || BigInt(0)
  // const potAmount = data?.[5].result || BigInt(0)

  // const currentWinnersPot = formatNumber((Number(formatUnits(potSize, 18)) * winnersShare) / 100, {
  //   maximumFractionDigits: 3,
  //   minimumFractionDigits: 0,
  // })

  // const winnersToShare = formatNumber(formatUnits(BigInt(winnersPot), 18), {
  //   maximumFractionDigits: 3,
  //   minimumFractionDigits: 0,
  // })

  // let winningNumbers: number[] = []

  // for (let i = 0; i < leaderboard.length; i++) {
  //   winningNumbers[i] = Number(leaderboard[i])
  // }

  // const playerTickets = playerTicketsArray?.[1]?.result || []

  // useEffect(() => {})
  // // extracted to array of bigint
  // setPlayerTickets((playerTicketsArray && playerTicketsArray?.[0]?.result) || [])

  /*

  useEffect(() => {
    // Ensure playerTicketsArray is defined and has at least one element with a result property
    updateTickets()
  }, [data]) // Run this effect whenever playerTicketsArray changes

  // create an array to hold each ticket's output

  // let ticketsOutput: Ticket[] = []

  // map each item to get Ticket struct outputs
  const updateTickets = async () => {
    try {
      if (playerTickets && playerTickets.length > 0) {
        const latestTicketsOutput: Ticket[] = await Promise.all(
          playerTickets.map(async (item) => {
            const result = await readContract(config, {
              ...defaultContractObj,
              functionName: 'idToTicket',
              args: [BigInt(item)],
            })
            return {
              id: Number(result[0]) || 0,
              player: result[1] || '',
              number: Number(result[2]) || 0,
              isWinner: result[3] || false,
              winnerClaimYet: result[4] || false,
              playerClaimYet: result[5] || false,
            }
          }),
        )

        setTicketsOutput(latestTicketsOutput)
      } else {
        setTicketsOutput([])
      }
    } catch (error) {
      console.error(error)
    }
  }

  */

  // const promise = playerTickets.forEach(async (item) =>
  //       for (const item of playerTickets) {
  //         (async (item) => {
  //           const result = await readContract(config, {
  //             ...defaultContractObj,
  //             functionName: 'idToTicket',
  //             args: [BigInt(item)],
  //           })
  //           // const data = result.data || []
  //           // const id = Number(data[0]) || 0
  //           // const player = data[1] || ''
  //           // const number = Number(data[2]) || 0
  //           // const isWinner = data[3] || false
  //           // const winnerClaimYet = data[4] || false
  //           // const playerClaimYet = data[5] || false
  //           let ticket: Ticket = defaultTicket
  //           ticket.id = Number(result[0]) || 0
  //           ticket.player = result[1] || ''
  //           ticket.number = Number(result[2]) || 0
  //           ticket.isWinner = result[3] || false
  //           ticket.winnerClaimYet = result[4] || false
  //           ticket.playerClaimYet = result[5] || false

  //           console.log(ticket)

  //           latestTicketsOutput.push(ticket)

  //           console.log(latestTicketsOutput)
  //         })(item)
  //         // return ticket
  //       }

  //       await Promise.all(latestTicketsOutput)
  //       setTicketsOutput(latestTicketsOutput)
  //       // const latestTicketsOutput = await Promise.all(promise)
  //     } catch (error) {
  //       console.error(error)
  //     }

  //     // console.log(latestTicketsOutput)
  //     // return latestTicketsOutput
  //   } else {
  //     setTicketsOutput([])
  //     // return []
  //   }
  // }
  // console.log(ticketsOutput)

  // playerTickets.map((item) => {
  //   const result = useReadContract({
  //     ...defaultContractObj,
  //     functionName: 'idToTicket',
  //     args: [item],
  //   })
  //   const id = result[0]
  //   const player = result[1]
  // })

  // useEffect(() => {
  //   const fetchTickets = async () => {
  //     if (playerTickets && playerTickets.length > 0) {
  //       const newTicketList = await Promise.all(
  //         playerTickets.map(async (item) => {
  //           const result = await useReadContract({
  //             ...defaultContractObj,
  //             functionName: 'idToTicket',
  //             args: [item],
  //           });
  //           return result;
  //         })
  //       );
  //       setTicketList(newTicketList);
  //     }
  //   };

  //   fetchTickets();
  // }, [playerTickets]);

  // // let ticketList:Ticket;
  // for (let i = 0; i < playerTickets.length; i++) {
  //   // let storedPlayerTickets: Ticket[]

  //   console.log(playerTickets.length)

  //   const result = useReadContract({
  //     ...defaultContractObj,
  //     functionName: 'idToTicket',
  //     args: [playerTickets[i]],
  //   })

  //   const id = result[0]
  // }

  // const ownedTickets = useStoreState((state) => state.ownedTickets)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    // [Autoplay({ delay: 4000 })]
  )

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  // const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
  // const toggleLoad = () => setShowLoadModal((prevState) => !prevState)

  // const [showExitModal, setShowExitModal] = React.useState<boolean>(false)
  // const toggleExit = () => setShowExitModal((prevState) => !prevState)

  // const computeValue = () => {

  //----------------- CALCULATE PLAYERS POT -----------------//
  let sumReciprocal = 0

  for (let i = 1; i <= ticketsBought; i++) {
    sumReciprocal += 1 / i
  }

  const currentPotSize = Number(formatUnits(potSize, 18))
  const currentPayoutFactor = (playersShare * currentPotSize) / 100 / sumReciprocal

  let accumulatedPlayersValue = 0

  for (let i = 0; i < playerTickets.length; i++) {
    accumulatedPlayersValue += currentPayoutFactor / playerTickets[i]
  }

  const currentAccumulated = formatNumber(accumulatedPlayersValue, {
    maximumFractionDigits: 7,
    minimumFractionDigits: 0,
  })

  //----------------- CALCULATE WINNERS POT -----------------//
  let winningTicketCount = 0

  for (let i = 0; i < playerTickets.length; i++) {
    for (let j = 0; j < leaderboard.length; j++) {
      if (playerTickets[i] === leaderboard[j]) {
        winningTicketCount++
      }
    }
  }

  const currentWinnersPot = (winnersShare * currentPotSize) / 100

  const payoutPerWinner = currentWinnersPot / leaderboard.length || 0

  const currentWinnings = payoutPerWinner * winningTicketCount

  const currentRolloverPot = (rolloverShare * currentPotSize) / 100

  let currentRollover: number = 0

  if (lastProfile.isClaimed === false) {
    const shareOfCurrentRollover =
      Number(
        formatNumber(formatUnits(lastProfile.claimAmount, 18), {
          maximumFractionDigits: 7,
          minimumFractionDigits: 0,
        }),
      ) / Number(lastRoundUnclaimedPot)

    currentRollover = shareOfCurrentRollover * currentRolloverPot
  }
  // setShowValue(currentAccumulated)
  // }
  // localStorage.setItem('accumulatedValue', String(currentAccumulated))

  // console.log(localStorage.getItem('accumulatedValue'))

  useEffect(() => {
    // const prevValue = Number(localStorage.getItem('accumulatedValue'))
    // const newValue = Number(currentAccumulated)
    // if (newValue !== prevValue) {
    //   const interval = setInterval(() => {
    //     if (newValue > showValue) {
    //       setShowValue((prevNumber) => {
    //         if (prevNumber < newValue) {
    //           return prevNumber + 0.0001
    //         } else {
    //           clearInterval(interval)
    //           return prevNumber
    //         }
    //       })
    //     } else if (newValue < showValue) {
    //       setShowValue((prevNumber) => {
    //         if (prevNumber >= newValue) {
    //           return prevNumber - 0.0001
    //         } else {
    //           clearInterval(interval)
    //           return prevNumber
    //         }
    //       })
    //     }
    //   }, 100) // Interval for subsequent renders

    //   localStorage.setItem('accumulatedValue', String(currentAccumulated))

    //   return () => clearInterval(interval)
    // } else {
    //   setShowValue(currentAccumulated)
    // }
    setShowValue(currentAccumulated)
    // computeValue()e
  }, [currentAccumulated])

  const [showValue, setShowValue] = useState<string>('-')

  const totalWinnings = formatNumber(
    Number(currentAccumulated) + currentWinnings + currentRollover,
    {
      maximumFractionDigits: 5,
      minimumFractionDigits: 0,
    },
  )

  const shareIfRoll = formatNumber((Number(totalWinnings) / Number(unclaimedPot)) * 100, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  const { data, isPending, writeContract, writeContractAsync } = useWriteContract()

  const claimHandler = async () => {
    // console.log('claimedPressed')

    try {
      await writeContractAsync({
        ...defaultContractObj,
        functionName: 'claim',
      })
      // console.log('claimedPressed')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <p className="text-xl">{error.shortMessage}</p>,
      })
    }
  }

  const ethPrice = useStoreState((state) => state.ethPrice)

  const winningsInUSD = formatNumber(Number(totalWinnings) * Number(ethPrice), {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  return (
    <div className="flex flex-col py-2 sm:px-2 my-2 items-center justify-center mx-auto">
      <div
        className="flex flex-col items-center py-2 \
        rounded-lg px-6 border border-neutral-100 text-neutral-300"
      >
        <span className="text-xl">You are accumulating (ETH)</span>

        <div className="flex flex-col sm:flex-row my-1 justify-center items-center">
          <div className="px-3 max-w-[240px] text-lg cursor-default flex justify-center items-center">
            <span className="text-base mr-1">🟣</span>{' '}
            {/* <span className="font-digit text-2xl mr-2">{currentAccumulated}</span>{' '} */}
            <CountUp
              decimals={5}
              duration={2.75}
              className="font-digit text-2xl mr-2"
              end={Number(currentAccumulated)}
            />
          </div>

          <div className="px-2 max-w-[240px] text-lg cursor-default flex justify-center items-center">
            <span className="text-base mr-1">🟡</span>{' '}
            {/* <span className="font-digit text-2xl mr-2">{currentWinnings}</span>{' '} */}
            <CountUp
              decimals={5}
              duration={2.75}
              className="font-digit text-2xl mr-2"
              end={Number(currentWinnings)}
            />
          </div>

          <div className="px-3 max-w-[240px] text-lg cursor-default flex justify-center items-center">
            <span className="text-base mr-1">🔵</span>{' '}
            {/* <span className="font-digit text-2xl mr-2">{currentWinnings}</span>{' '} */}
            <CountUp
              decimals={5}
              duration={2.75}
              className="font-digit text-2xl mr-2"
              end={Number(currentRollover)}
            />
          </div>
        </div>

        <div className="text-2xl border border-gray-100 p-2 bg-zinc-700 rounded-lg my-4">
          {/* <div className="flex my-1 justify-center items-center">
              Total accumulated: {totalWinnings} ETH
            </div>
            <div className="flex my-1 justify-center items-center">
              Unclaimed pot so far: {unclaimedPot} ETH
            </div>
            <div className="flex my-1 justify-center items-center">
              % share if roll: {shareIfRoll}%
            </div> */}

          <div className="grid sm:grid-cols-2 gap-1 mb-4 sm:mb-0">
            <p className="sm:text-left">Total winnings:</p>
            <p className="sm:text-right">
              {' '}
              {totalWinnings} ETH{' '}
              <span className="text-stone-100/70">
                <span className="text-lg">(≈ </span>${winningsInUSD})
              </span>
            </p>
          </div>

          {!canBuyTicket && (
            <>
              <div className="grid sm:grid-cols-2 gap-1 mb-4 sm:mb-0">
                <p className="sm:text-left">Unclaimed pot so far:</p>
                <p className="sm:text-right"> {unclaimedPot} ETH </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-1 mb-4 sm:mb-0">
                <p className="sm:text-left">
                  {canClaim ? '% share so far if roll:' : 'Share of next rollover pot:'}
                </p>
                <p className="sm:text-right">{profile.isClaimed ? `NA` : `${shareIfRoll}%`}</p>
              </div>
            </>
          )}
        </div>

        <Button
          className="w-[240px] text-2xl"
          variant="claim"
          onClick={claimHandler}
          disabled={canBuyTicket || profile.isClaimed || !canClaim}
          // isLoading={isPending}
        >
          {isConnected
            ? canBuyTicket
              ? 'Claim'
              : canClaim
                ? profile.isClaimed
                  ? 'You have claimed'
                  : 'Claim'
                : 'You rolled to next pot'
            : 'Connect to claim'}
        </Button>
      </div>

      <p className="mt-4 text-2xl text-zinc-200 capitalized flex justify-center">
        Your disks
        <span className="ml-2 font-digit">
          {'  '}({playerTickets.length})
        </span>{' '}
      </p>
      <div className="flex">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <section className="mx-auto">
          <div className="w-[240px] sm:w-[420px] overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-x">
              <>
                {
                  // isConnected &&
                  // ticketsOutput &&
                  // ticketsOutput.length > 0 &&
                  playerTickets.map((item, i) => (
                    <div className="mx-2" key={i}>
                      <TicketUI
                        ticketId={BigInt(item)}
                        // id={item.id}
                        // player={item.player}
                        // number={item.number}
                        // isWinner={item.isWinner}
                        // winnerClaimYet={item.winnerClaimYet}
                        // playerClaimYet={item.playerClaimYet}
                      />
                    </div>
                  ))
                }
              </>
            </div>
          </div>
        </section>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex flex-row justify-center items-center">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                index === selectedIndex ? 'border-2 border-black bg-zinc-200' : 'bg-zinc-700',
                'w-2 h-2  rounded-full m-1 p-0 border-none cursor-pointer',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default YourTickets
