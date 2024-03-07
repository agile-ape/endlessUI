import Image from 'next/image'
import { HelpCircle } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from './button'
import React, { useEffect, useState } from 'react'
import { useAccount, useContractRead, useContractReads, useContractWrite } from 'wagmi'
import {
  defaultContractObj,
  DOCS_URL,
  WEBSOCKET_ENDPOINT,
  CHAIN_ID,
  GAME_ADDRESS,
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

function Timer() {
  const [timeLeft, setTimeLeft] = useState<number>()

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'timeFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'roundTime',
      },
    ],
  })

  const timeFlag = data?.[0].result || BigInt(0)
  const roundTime = data?.[1].result || BigInt(0)

  // const endTime: Date = new Date((Number(timeFlag) + Number(roundTime)) * 1000)

  const endTime: Date = new Date(1722231321 * 1000)

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

  return (
    // <div className="p-1 bg-[#39402e] rounded-md cursor-default">
    <div className="font-digit text-3xl h-16 shadow-xl rounded-md px-4 py-2 flex flex-row justify-center items-center gap-1 dark:bg-slate-700 border-2 border-slate-500">
      {timeLeft && !isNaN(timeLeft) ? (
        <>
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
        </>
      ) : (
        <div>Wait for it</div>
      )}
    </div>
    // </div>
  )
}

function Tracker() {
  return (
    <div className="">
      <div className="flex flex-row gap-3 items-center py-0 sm:py-2 ">
        <>
          <div className="flex flex-row items-center cursor-default tracking-wide">
            <div className="flash">Round [1] </div>
          </div>

          <div className="flex flex-row items-center cursor-default tracking-wide">
            <div className="flash">Pot [21 ETH]</div>
          </div>

          <div className="flex flex-row items-center cursor-default text-md tracking-wide">
            <div className="flash">Active [30]</div>
          </div>
        </>
      </div>
    </div>
  )
}
export default function Countdown() {
  // const events: Event[] = [
  //   {
  //     name: `events-${CHAIN_ID}-${GAME_ADDRESS}`,
  //     async handler(data) {
  //       const { event, dataJson } = data

  //       if (!Object.keys(dataJson).length) return

  //       if (event === 'PhaseChange') {
  //         const { caller, previousPhase, newPhase, time } = dataJson

  //         setTimeFlag(Number(time) || 0)
  //       }
  //     },
  //   },
  //   {
  //     name: `events-${CHAIN_ID}-${GAME_ADDRESS}`,
  //     async handler(data) {
  //       const { event, dataJson } = data

  //       if (!Object.keys(dataJson).length) return

  //       if (event === 'NewTicketBought') {
  //         const { caller, player, purchasePrice, newCountdownTime, time } = dataJson

  //         setCountdown(Number(newCountdownTime) || 0)
  //       }
  //     },
  //   },
  // ]

  // useSocketEvents(events)

  return (
    <div className="text-[#FCFDC7] gap-1">
      <div className="flex justify-center items-end">
        <span className="hidden sm:inline">
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                <Timer />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="px-3 py-1 max-w-[320px] text-sm hidden sm:block cursor-default/
                dark:bg-slate-700 border-2 border-slate-500"
              >
                <Tracker />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>

        <span className="inline sm:hidden">
          <Popover>
            <PopoverTrigger>
              <Timer />
            </PopoverTrigger>
            <PopoverContent side="top" align="center">
              <Tracker />
            </PopoverContent>
          </Popover>
        </span>
      </div>
    </div>
  )
}
