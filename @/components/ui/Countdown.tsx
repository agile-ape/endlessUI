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

type TimeLeftType = {
  // days: number;
  hours: number
  minutes: number
  seconds: number
}

type Props = {
  timeFlag: number
  countdownTime: number
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

export default function Countdown({ timeFlag, countdownTime }: Props) {
  const endTime = new Date(timeFlag * 1000 + countdownTime * 1000)
  const [timeLeft, setTimeLeft] = useState<number>()

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the time left in each tick
      const now = new Date()
      const timeLeftInMS = endTime.getTime() - now.getTime()

      if (timeLeftInMS > 0) {
        setTimeLeft(timeLeftInMS / 1000)
      } else {
        // Clear the interval when countdown ends
        clearInterval(interval)
      }
    }, 1000) // Update every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [endTime])

  return (
    <div className="flex justify-center">
      <div className="flex flex-row rounded-xl bg-neutral-300 dark:bg-neutral-800 p-1 items-center gap-2">
        <div className="text-2xl flex flex-row">
          {timeLeft && !isNaN(timeLeft) ? (
            <>
              {formatTime(timeLeft).hours}:{formatTime(timeLeft).minutes}:
              {formatTime(timeLeft).seconds}
            </>
          ) : (
            <PhaseChange />
          )}
        </div>

        <Timer size={28} className="stroke-slate-900 dark:stroke-slate-100" />

        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              {/* <QuestionMarkCircledIcon className="w-[20px] h-[20px]" /> */}
              <HelpCircle size={24} className="stroke-slate-900 dark:stroke-slate-100" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                <strong>Time left for this phase (HH:MM:SS) </strong> Once timer hits zero, anyone
                can trigger the phase change.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
