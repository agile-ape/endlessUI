import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from './button'
import { useEffect, useState } from 'react'

type TimeLeftType = {
  // days: number;
  hours: number
  minutes: number
  // seconds: number
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
    <div
      className="text-center bg-[#F6F6F6] dark:bg-[#1C1C1C]
    border border-[#EBEBEB] dark:border-[#444242]
    w-[220px] mx-auto rounded-lg p-2"
    >
      <div className="flex justify-center items-center gap-2">
        <p className="text-[20px]">Time Left</p>

        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <QuestionMarkCircledIcon className="w-[20px] h-[20px]" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                <strong>Time left for this phase.</strong> Once timer hits zero, anyone can trigger
                the phase change.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* use this button if the states supports change phase */}
      {/* <Button
        className="bg-[#31197B] text-white rounded-xl my-3"
      >Change Phase</Button> */}

      <h2 className="text-[40px]">
        {timeLeft && !isNaN(timeLeft) ? (
          <>
            {formatTime(timeLeft).hours}H:{formatTime(timeLeft).minutes}M
          </>
        ) : (
          '00:00'
        )}
      </h2>
    </div>
  )
}
