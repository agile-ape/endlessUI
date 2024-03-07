import Image from 'next/image'
import { HelpCircle } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Button } from './button'
import React, { useEffect, useState } from 'react'
import type { MouseEventHandler } from 'react'
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

  const [alarmState, setAlarmState] = useState<string>('default')

  const handleOnMouseEnter: MouseEventHandler = () => {
    setAlarmState('ready')
  }
  const handleOnMouseLeave: MouseEventHandler = () => {
    setAlarmState('default')
  }

  const handleOnMouseDown: MouseEventHandler = () => {
    setAlarmState('go')
  }

  const [timeLeft, setTimeLeft] = useState<number>()

  const [showRoundChangeModal, setShowRoundChangeModal] = React.useState<boolean>(false)
  const toggleRoundChange = () => setShowRoundChangeModal((prevState) => !prevState)

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
  // TODO: REMOVE BEFORE FLIGHT
  const endTime: Date = new Date(171000000 * 1000)

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
    <div className="relative sm:h-18 sm:w-48 h-10 w-32 m-2">
      {/* display */}
      <div
        className={cn(
          'rounded-md \
              py-4 sm:py-0 \
              text-[36px] sm:text-[28px] \
              bg-[#404833] shadow-sm text-[#FCFDC7] \
              capitalized font-digit \
              border border-[#11140C] text-center\
              flex justify-center',
          alarmState === 'ready'
            ? 'border-[#FCFC03] text-[#FCFC03] border-2'
            : alarmState === 'go'
              ? 'border-[#FCFC03] text-[#FCFC03] border-2'
              : '',
        )}
      >
        {isLoading ? (
          <div>Wait for it </div>
        ) : timeLeft && !isNaN(timeLeft) ? (
          <div className="flex">
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
        ) : (
          <div
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            onMouseDown={handleOnMouseDown}
            onClick={toggleRoundChange}
            className="cursor-pointer"
          >
            {alarmState === 'default' ? "let's" : alarmState === 'ready' ? 'blast' : 'off'}
          </div>
        )}
      </div>

      {/* button + stem */}
      <div
        className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full \
      flex flex-col justify-center items-center',
          alarmState === 'ready' ? '' : alarmState === 'go' ? '' : '',
        )}
      >
        {/* button */}
        <div
          className={cn(
            'bg-[#404833] z-[5] border border-[#11140C] w-6 h-2 rounded-[0.125rem]',
            alarmState === 'ready'
              ? 'border-[#FCFC03] border-2'
              : alarmState === 'go'
                ? 'border-[#FCFC03] border-2'
                : '',
          )}
        ></div>
        {/* stem */}
        <div
          className={cn(
            'bg-[#404833] z-[10] border border-[#11140C] border-t-0 border-b-0 w-2 h-[2px]',
            alarmState === 'ready'
              ? 'h-[6px] border-[#FCFC03] border-2'
              : alarmState === 'go'
                ? 'h-[0px] border-[#FCFC03] border-2'
                : '',
          )}
        ></div>
      </div>
      {showRoundChangeModal && <Modal action={'roundChange'} toggle={toggleRoundChange} />}
    </div>
  )
}
