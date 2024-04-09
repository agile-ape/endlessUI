import React, { useEffect, useState, useCallback } from 'react'
import type { PropsWithChildren } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import { useStoreActions, useStoreState } from '../../../store'

import { useAccount, useReadContract, useReadContracts, useWatchContractEvent } from 'wagmi'
import { readContract } from '@wagmi/core'
import { GAME_ADDRESS, TWITTER_URL, defaultContractObj } from '../../../services/constant'
import { cn } from '@/lib/utils'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDotButton, DotButton, usePrevNextButtons, PrevButton, NextButton } from './navigation'
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
  // const [ticketsOutput, setTicketsOutput] = useState<Ticket[]>([defaultTicket])

  // const tickets = readContract(config, {
  //   ...defaultContractObj,
  //   functionName: 'ticketIdCounter',
  // })

  // user address
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

  // useWatchContractEvent({
  //   ...defaultContractObj,
  //   eventName: 'PlayersClaimed',
  //   onLogs() {
  //     refetch()
  //   },
  //   poll: true,
  // })

  const playerTickets = data?.[0]?.result || []
  const leaderboard: readonly bigint[] = data?.[1].result || []
  const canBuyTicket = data?.[2].result || false
  const winnersPot = data?.[3].result || BigInt(0)
  const winnersShare = data?.[4].result || BigInt(0)
  const potAmount = data?.[5].result || BigInt(0)

  const currentWinnersPot = formatNumber(
    formatUnits((winnersShare * potAmount) / BigInt(100), 18),
    {
      maximumFractionDigits: 3,
      minimumFractionDigits: 0,
    },
  )

  const winnersToShare = formatNumber(formatUnits(BigInt(winnersPot), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

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
    { loop: false },
    // [Autoplay({ delay: 4000 })]
  )

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
  const toggleLoad = () => setShowLoadModal((prevState) => !prevState)

  const [showExitModal, setShowExitModal] = React.useState<boolean>(false)
  const toggleExit = () => setShowExitModal((prevState) => !prevState)

  // let ticket: Ticket | undefined = {
  //   id: 0,
  //   player: address as `0x${string}`,
  //   isInPlay: false,
  //   value: 0,
  //   purchasePrice: 0,
  //   redeemValue: 0,
  //   potClaimCount: 0,
  //   passRate: 0,
  //   joinRound: 0,
  //   exitRound: 0,
  //   logs: [],
  // }

  return (
    <div className="flex flex-col gap-2 my-2 items-center justify-center mx-auto">
      <div
        className="flex flex-col items-center \
      rounded-lg px-6 py-2 \
      text-gray-200 border border-zinc-500 text-sm bg-transparent
      "
      >
        🟡 {canBuyTicket ? 'Winners pot' : 'Final Winners Pot'}
        <div className="font-digit text-3xl">
          {canBuyTicket ? currentWinnersPot : winnersToShare}
        </div>
      </div>

      <div className="text-gray-400">Winning keys (#)</div>
      <div
        className="text-yellow-400  \
         text-4xl \
        flex overflow-auto max-w-[480px]"
      >
        {winningNumbers.map((number, index) => (
          <span className="border px-3 border-stone-500" key={index}>
            {number}
          </span>
        ))}
      </div>

      <p className="mt-4 text-2xl text-zinc-200 capitalized flex justify-center">
        Your keys
        <span className="ml-2 font-digit">
          {'  '}({playerTickets.length})
        </span>{' '}
      </p>
      <div className="flex">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <section className="mx-auto">
          <div className="w-[380px] overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-x">
              <>
                {
                  // isConnected &&
                  // ticketsOutput &&
                  // ticketsOutput.length > 0 &&
                  playerTickets.map((item, i) => (
                    <div className="mx-2" key={i}>
                      <TicketUI
                        ticketId={item}
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
                {/* <TicketUI
                  id={1}
                  // player={}
                  number={300}
                  isWinner={false}
                  winnerClaimYet={false}
                  playerClaimYet={false}
                /> */}
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
