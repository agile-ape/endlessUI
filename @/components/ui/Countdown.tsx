import React, { useEffect, useState } from 'react'
import type { MouseEventHandler } from 'react'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'
import { defaultContractObj } from '../../../services/constant'
import { useReadContracts, useWriteContract, useWatchContractEvent } from 'wagmi'
import { Button } from './button'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'

type TimeLeftType = {
  hours: number
  minutes: number
  seconds: number
}

const formatTime = (timeInSeconds: number): TimeLeftType => {
  let hours = Math.floor(timeInSeconds / 3600)
  let minutes = Math.floor((timeInSeconds % 3600) / 60)
  let seconds = Math.floor(timeInSeconds % 60)

  return {
    hours,
    minutes,
    seconds,
  }
}

// const useStore = () => {
//   const round = useStoreState((state) => state.round)
//   const timeFlag = useStoreState((state) => state.timeFlag)
//   const roundTime = useStoreState((state) => state.roundTime)

//   return {
//     round,
//     timeFlag,
//     roundTime,
//   }
// }

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<number>()

  const { data, refetch } = useReadContracts({
    contracts: [
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

  const gameTime = Number(data?.[0].result || BigInt(0))
  const timeAddon = Number(data?.[1].result || BigInt(0))
  const startGameFlag = Number(data?.[2].result || BigInt(0))
  const canBuyTicket = Boolean(data?.[3].result || false)

  // const endTime: Date = new Date((Number(startGameFlag) + Number(gameTime)) * 1000)
  // TODO: REMOVE BEFORE FLIGHT
  const endTime: Date = new Date(1711550000 * 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the time left in each tick
      const now = new Date()
      const timeLeftInMS = endTime.getTime() - now.getTime()
      if (timeLeftInMS > 0) {
        setTimeLeft(timeLeftInMS / 1000)
      } else {
        // Clear the interval when countdown ends
        setTimeLeft(0)
        clearInterval(interval)
      }
    }, 1000) // Update every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [endTime])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(delay)
  }, [])

  const { data: hash, isPending, writeContract, writeContractAsync } = useWriteContract()

  const endGameHandler = async () => {
    writeContract({
      ...defaultContractObj,
      functionName: 'endGame',
    })
  }

  return (
    <div
      className="px-2 py-2 my-2 \
        inner-last \
        flex justify-center"
    >
      {isLoading ? (
        <div className="capitalized text-2xl">TIME LEFT </div>
      ) : timeLeft && !isNaN(timeLeft) ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-gray-400 text-base">Timer</div>
          <div className="flex justify-center items-center">
            <div className="flex flex-col text-2xl text-center text-gray-200 font-digit">
              {formatTime(timeLeft).hours} :
              <div className="uppercase -translate-x-1 text-gray-400 text-sm text-center">hr</div>
            </div>
            <div className="ml-1 flex flex-col text-2xl text-center text-gray-200 font-digit">
              {' '}
              {formatTime(timeLeft).minutes} :
              <div className="uppercase -translate-x-1 text-gray-400 text-sm text-center">min</div>
            </div>
            <div className="ml-1 flex flex-col text-2xl text-center text-gray-200 font-digit">
              {formatTime(timeLeft).seconds}
              <div className="uppercase text-gray-400 text-sm text-center">sec</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {canBuyTicket ? (
            <>
              <div className="capitalized text-2xl">TIME'S UP</div>
              <Button
                variant="end"
                className="w-full px-8 py-2 mt-2"
                onClick={endGameHandler}
                isLoading={isPending}
                // disabled={!canBuyTicket}
              >
                End
              </Button>
            </>
          ) : (
            <>
              <div className="capitalized text-2xl">GAME ENDED</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
