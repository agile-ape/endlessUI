import Image from 'next/image'

import { HelpCircle } from 'lucide-react'
import { Timer } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from './button'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractReads, useContractWrite } from 'wagmi'
import { defaultContractObj, DOCS_URL, WEBSOCKET_ENDPOINT } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import PhaseChange from './PhaseChange'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'
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

export default function Countdown() {
  const phase = useStoreState((state) => state.phase)

  const [timeLeft, setTimeLeft] = useState<number>()
  const [timeFlag, setTimeFlag] = useState<number>()

  // const phase = 'gameclosed'

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'timeFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'countdownTime',
      },
      {
        ...defaultContractObj,
        functionName: 'dayTime',
      },
      {
        ...defaultContractObj,
        functionName: 'nightTime',
      },
      {
        ...defaultContractObj,
        functionName: 'gameCloseTime',
      },
      {
        ...defaultContractObj,
        functionName: 'timeAddon',
      },
    ],
    onSuccess(data) {
      setTimeFlag(Number(data[0].result) || 0)
    },
  })

  const events: Event[] = [
    {
      name: 'events',
      async handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'PhaseChange') {
          const { caller, previousPhase, newPhase, time } = dataJson

          setTimeFlag(Number(time) || 0)
        }
      },
    },
  ]

  useSocketEvents(events)

  const countdownTime = data?.[1].result || BigInt(0)
  const dayTime = data?.[2].result || BigInt(0)
  const nightTime = data?.[3].result || BigInt(0)
  const gameCloseTime = data?.[4].result || BigInt(0)
  const timeAddon = data?.[5].result || BigInt(0)

  const timeAdded = Number(timeAddon) / 60 // assuming timeAddon will be expressed in minutes

  let endTime: Date

  if (phase === 'start') {
    // timeAddon is added to countdownTime whenever someone buys a ticket
    endTime = new Date((Number(timeFlag) + Number(countdownTime)) * 1000)
  } else if (phase === 'day') {
    endTime = new Date((Number(timeFlag) + Number(dayTime)) * 1000)
  } else if (phase === 'night') {
    endTime = new Date((Number(timeFlag) + Number(nightTime)) * 1000)
  } else if (phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') {
    endTime = new Date((Number(timeFlag) + Number(gameCloseTime)) * 1000)
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
                    <div className="h-[50px] text-2xl border-2 border-lime-800 shadow-md rounded-md px-4 py-0 flex flex-row gap-0.5">
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
                  <TooltipContent
                    side="top"
                    align="center"
                    className="px-3 py-1 max-w-[240px] text-sm cursor-default"
                  >
                    {phase === 'start' && <p>{timeAdded} mins is added for every new joiner</p>}
                    {phase === 'day' && (
                      <p>Countdown of {formatTime(Number(dayTime)).minutes} mins until day ends</p>
                    )}
                    {phase === 'night' && (
                      <p>
                        Countdown of {formatTime(Number(nightTime)).minutes} mins until night ends
                      </p>
                    )}
                    {(phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') && (
                      <p>Countdown of {Number(gameCloseTime)} until this current phase ends</p>
                    )}
                    <div>
                      <a href={DOCS_URL} target="_blank" className="text-xs link">
                        Learn more
                      </a>
                    </div>
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
