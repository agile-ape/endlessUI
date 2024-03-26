import React, { useEffect, useState } from 'react'
import type { MouseEventHandler } from 'react'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'

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

  // const endTime: Date = new Date((Number(timeFlag) + Number(roundTime)) * 1000)
  // TODO: REMOVE BEFORE FLIGHT
  const endTime: Date = new Date(1711500000 * 1000)

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

  return (
    <div
      className="rounded-xl \
              py-2 px-4 my-2 text-2xl capitalized \
              border border-gray-700 text-center \
              flex items-center justify-center"
    >
      {isLoading ? (
        <div className="capitalized">TIME LEFT </div>
      ) : timeLeft && !isNaN(timeLeft) ? (
        <div className="flex flex-col justify-center">
          <div className="flex">
            <div className="flex flex-col text-center font-digit">
              {formatTime(timeLeft).hours}
              <div className="uppercase text-gray-400 text-sm text-center">hr</div>
            </div>
            :
            <div className="flex flex-col text-center font-digit">
              {formatTime(timeLeft).minutes}
              <div className="uppercase text-gray-400 text-sm text-center">min</div>
            </div>
            :
            <div className="flex flex-col text-center font-digit">
              {formatTime(timeLeft).seconds}
              <div className="uppercase text-gray-400 text-sm text-center">sec</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="capitalized">TIME'S UP</div>
      )}
    </div>
  )
}
