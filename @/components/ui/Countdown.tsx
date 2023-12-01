import Image from 'next/image'

import { HelpCircle } from 'lucide-react'
import { Timer } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from './button'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import PhaseChange from './PhaseChange'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'

type TimeLeftType = {
  // days: number;
  hours: number
  minutes: number
  seconds: number
}

// type Props = {
//   timeFlag: number
//   countdownTime: number
// }

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

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<number>()
  const phase = useStoreState((state) => state.phase)

  // const phase = 'gameclosed'

  const timeFlag = useStoreState((state) => state.timeFlag)
  const countdownTime = useStoreState((state) => state.countdownTime)
  // const timeAddon = useStoreState((state) => state.timeAddon)
  const dayTime = useStoreState((state) => state.dayTime)
  const nightTime = useStoreState((state) => state.nightTime)
  const gameCloseTime = useStoreState((state) => state.gameCloseTime)

  const timeAddon = useStoreState((state) => state.timeAddon)

  const timeAddonConverted = timeAddon / 60 // assuming timeAddon will be expressed in minutes

  let endTime: Date

  if (phase === 'start') {
    // timeAddon is added to countdownTime whenever someone buys a ticket
    endTime = new Date(timeFlag * 1000 + countdownTime * 1000)
  } else if (phase === 'day') {
    endTime = new Date(timeFlag * 1000 + dayTime * 1000)
  } else if (phase === 'night') {
    endTime = new Date(timeFlag * 1000 + nightTime * 1000)
  } else if (phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') {
    endTime = new Date(timeFlag * 1000 + gameCloseTime * 1000)
  } else if (phase === 'deployed' || phase === 'gameclosed') {
    endTime = new Date()
  } else {
    endTime = new Date()
  }

  // endTime = new Date('2023-11-24T16:30:00') // our deadline to launch
  // console.log(endTime)

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the time left in each tick
      const now = new Date()
      const timeLeftInMS = endTime.getTime() - now.getTime()

      // const timeLeftInMS = 100000

      console.log(now)
      console.log(now.getTime())
      // console.log(now.getTime())

      if (timeLeftInMS > 0) {
        setTimeLeft(timeLeftInMS / 1000)
      } else {
        // Clear the interval when countdown ends
        clearInterval(interval)
      }
    }, 1000) // Update every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [endTime])

  // <Timer size={28} className="stroke-slate-900 dark:stroke-slate-100" />
  return (
    <>
      {(phase === 'deployed' || phase === 'gameclosed') && <></>}

      {!(phase === 'deployed' || phase === 'gameclosed') && (
        <div className="text-lime-800 dark:text-lime-200 gap-1">
          <div className="flex justify-center items-end">
            {timeLeft && !isNaN(timeLeft) ? (
              <TooltipProvider delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="h-[50px] text-2xl border border-lime-800 shadow-md rounded-md px-2 py-0 flex flex-row gap-0.5">
                      <div className="flex flex-col text-center">
                        {formatTime(timeLeft).hours}
                        <div className="uppercase text-xs text-center text-lime-800 dark:text-lime-300">
                          hrs
                        </div>
                      </div>
                      :
                      <div className="flex flex-col text-center">
                        {formatTime(timeLeft).minutes}
                        <div className="uppercase text-xs text-center text-lime-800 dark:text-lime-300">
                          mins
                        </div>
                      </div>
                      :
                      <div className="flex flex-col text-center">
                        {formatTime(timeLeft).seconds}
                        <div className="uppercase text-xs text-center text-lime-800 dark:text-lime-300">
                          secs
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                      {timeAddonConverted} mins is added for every new joiner
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="">
                <PhaseChange />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
