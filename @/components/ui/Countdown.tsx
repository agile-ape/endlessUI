import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from './button'
import { useEffect, useState } from 'react'
import { calculateTimeLeft } from '@/lib/utils'

type TimeLeftType = {
  // days: number;
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeftType>(calculateTimeLeft())

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

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
        {/* {timeLeft.days ? `${timeLeft.days}:`: ""} */}
        {timeLeft.hours ? `${timeLeft.hours}:` : ''}
        {timeLeft.minutes}:{timeLeft.seconds}
      </h2>
    </div>
  )
}
