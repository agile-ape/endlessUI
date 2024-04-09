'use client'
import React, { useEffect, useState } from 'react'
import { useReadContracts, useWatchContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import BuyTicket from './BuyTicket'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import Grid from './Grid'
import { Button } from './button'

export default function Average() {
  const [showAverage, setShowAverage] = useState(0)

  const { data, refetch } = useReadContracts({
    contracts: [
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
        functionName: 'canBuyTicket',
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

  const currentAverage = Number(data?.[0].result || BigInt(0))
  const leaderboard: readonly bigint[] = data?.[1].result || []
  const ticketsBought = Number(data?.[2].result || BigInt(0))
  const canBuyTicket = Boolean(data?.[3].result || false)

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

  // const spinDisplay = () => {
  //   setIsSpinning(true)
  //   const randomNum = Math.floor(Math.random() * 10)
  //   setShowDisplay(randomNum)

  //   setTimeout(() => {
  //     setIsSpinning(false)
  //     setShowDisplay(currentAverage)
  //   }, 2000)
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentAverage > showAverage) {
        setShowAverage((prevNumber) => {
          if (prevNumber < currentAverage) {
            return prevNumber + 1
          } else {
            clearInterval(interval)
            return prevNumber
          }
        })
      } else if (currentAverage < showAverage) {
        setShowAverage((prevNumber) => {
          if (prevNumber >= currentAverage) {
            return prevNumber - 1
          } else {
            clearInterval(interval)
            return prevNumber
          }
        })
      }
    }, 10)

    return () => clearInterval(interval)
  }, [currentAverage])

  return (
    <div
      className="gap-2 py-2 px-2 my-2 \
      flex flex-col items-center justify-center"
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="average"
            className="h-20 flex flex-col items-center \
      rounded-lg px-6"
          >
            {canBuyTicket ? 'Current Average' : 'Final Average'}
            {/*  */}
            <div className="font-digit text-3xl">{showAverage}</div>
            {/* <AnimatedNumbers animateToNumber={showAverage}  /> */}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-transparent flex flex-col justify-center items-center">
          <Grid />
        </DialogContent>
      </Dialog>

      <BuyTicket />

      {/* <div className="text-gray-400 mb-2">Winning keys (#)</div>
      <div
        className="text-yellow-500 mb-2  \
         text-4xl \
        flex overflow-auto"
      >
        {winningNumbers.map((number, index) => (
          <span className="border px-3 border-stone-500" key={index}>
            {number}
          </span>
        ))}
      </div>
      <div className="text-gray-400">Total keys: {ticketsBought}</div> */}
    </div>
  )
}
