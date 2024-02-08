import Image from 'next/image'
import { HelpCircle } from 'lucide-react'
import { Timer } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from './button'
import React, { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractReads, useContractWrite } from 'wagmi'
import {
  defaultContractObj,
  DOCS_URL,
  WEBSOCKET_ENDPOINT,
  CHAIN_ID,
} from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import Modal from './Modal'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'
import OnSignal from './OnSignal'
import PhaseChangeNew from './PhaseChangeNew'
import { PhaseChangeActive } from './PhaseChangeNew'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { useTheme } from 'next-themes'
import {
  User,
  Menu,
  MenuSquare,
  Link2,
  Unlink2,
  Rss,
  Users,
  Clock,
  Monitor,
  Target,
  Info,
  Move,
  ChevronDown,
  ChevronUp,
  Send,
  Split,
  LogIn,
  LogOut,
  Dices,
  Gift,
  Ticket,
  Sword,
  RefreshCw,
  ChevronsRight,
  Axe,
} from 'lucide-react'

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

// const bgColorPhase: Record<string, string> = {
//   start: 'text-black border border-white bg-blue-100 hover:bg-blue-200',
//   day: 'text-white border border-white bg-green-600 hover:bg-green-700',
//   night: 'text-black border border-white bg-amber-500 hover:bg-amber-400',
//   lastmanfound: 'bg-neutral-900 hover:bg-neutral-800',
//   peacefound: 'bg-blue-800 hover:bg-blue-900',
//   drain: 'bg-red-400 hover:bg-red-500',
// }

export default function Countdown() {
  const phase = useStoreState((state) => state.phase)
  const phaseChangeActive = PhaseChangeActive()
  const { xs } = useWindowSize()
  const { forcedTheme } = useTheme()

  const [showPhaseChangeModal, setShowPhaseChangeModal] = React.useState<boolean>(false)
  const togglePhaseChange = () => setShowPhaseChangeModal((prevState) => !prevState)

  const [timeLeft, setTimeLeft] = useState<number>()
  const [timeFlag, setTimeFlag] = useState<number>()
  const [countdown, setCountdown] = useState<number>()

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
      setCountdown(Number(data[1].result) || 0)
    },
  })

  const events: Event[] = [
    {
      name: `events-${CHAIN_ID}`,
      async handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'PhaseChange') {
          const { caller, previousPhase, newPhase, time } = dataJson

          setTimeFlag(Number(time) || 0)
        }
      },
    },
    {
      name: `events-${CHAIN_ID}`,
      async handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'NewTicketBought') {
          const { caller, player, purchasePrice, newCountdownTime, time } = dataJson

          setCountdown(Number(newCountdownTime) || 0)
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
    endTime = new Date((Number(timeFlag) + Number(countdown)) * 1000)
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
      {phase === 'deployed' || phase === 'gameclosed' ? (
        <></>
      ) : (
        <div className="text-[#FCFDC7] gap-1">
          <div className="flex justify-center items-end">
            {timeLeft && !isNaN(timeLeft) ? (
              <TooltipProvider delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-1 bg-[#39402e] rounded-md cursor-default">
                      <div className="font-digit text-2xl shadow-xl rounded-md px-4 py-0 flex flex-row gap-1 bg-[#404833] border-2 border-[#404833]">
                        <div className="flex flex-col text-center">
                          {formatTime(timeLeft).hours}
                          <div className="uppercase text-sm text-center">hr</div>
                        </div>
                        :
                        <div className="flex flex-col text-center">
                          {formatTime(timeLeft).minutes}
                          <div className="uppercase text-sm text-center">min</div>
                        </div>
                        :
                        <div className="flex flex-col text-center">
                          {formatTime(timeLeft).seconds}
                          <div className="uppercase text-sm text-center">sec</div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="center"
                    className="px-3 py-1 max-w-[240px] text-sm hidden sm:block cursor-default"
                  >
                    {phase === 'start' && <p>{timeAdded} mins is added for every new player</p>}
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
                {/* <PhaseChange /> */}

                {xs ? (
                  <div className="flex text-xl text-[#404833] dark:text-[#FCFC03]">
                    <span>Use </span>
                    <span className="flex mr-1">
                      {' '}
                      {/* <Image
                        priority
                        src={
                          forcedTheme === 'light' ? `/icon/phaseLight.svg` : `/icon/phaseNight.svg`
                        }
                        className="ml-1 mr-1"
                        height={20}
                        width={20}
                        alt="change-phase"
                      /> */}
                      <p className="flex justify-center items-center">
                        <ChevronsRight className="" />
                        Phase
                      </p>
                    </span>
                    to change phase
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className={cn('text-sm h-8 px-2 sm:text-lg sm:h-10 sm:px-3')}
                    onClick={togglePhaseChange}
                  >
                    <OnSignal active={phaseChangeActive} own={true} />
                    <ChevronsRight size={20} className="mr-1" />
                    Change phase
                  </Button>
                )}
              </div>
            )}
          </div>
          {showPhaseChangeModal && <Modal action={'phaseChange'} toggle={togglePhaseChange} />}
        </div>
      )}
    </>
  )
}
