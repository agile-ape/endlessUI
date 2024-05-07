import React, { useRef, useState, useEffect } from 'react'
import type { FC } from 'react'
import Link from 'next/link'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/alert-dialog'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { Button } from '../shadcn/button'
import Image from 'next/image'
import { Send, CheckCircle2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import dynamic from 'next/dynamic'
import { DialogClose } from '@radix-ui/react-dialog'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { DOCS_URL, TWITTER_URL } from '../../../services/constant'
import { VIEM_CHAIN } from '../../../services/constant'
import { createPublicClient, http } from 'viem'
import { showCurrentDate, showCurrentTime, showLocaleDate, showLocaleTime } from '../../lib/utils'

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

type GameFirstType = {
  open: boolean
}

const GameFirst: FC<GameFirstType> = ({ open }) => {
  const [timeLeft, setTimeLeft] = useState<number>()
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const [enabled, setEnabled] = useState<boolean>(false)
  const [blockNumber, setBlockNumber] = useState<string>('loading')
  const [timeToStart, setTimeToStart] = useState<number>()

  const canBuyTicket = useStoreState((state) => state.canBuyTicket)
  const canClaim = useStoreState((state) => state.canClaim)
  const closeTime = useStoreState((state) => state.closeTime)
  const endGameFlag = useStoreState((state) => state.endGameFlag)

  const gameCloseTime: Date = new Date((endGameFlag + closeTime) * 1000)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => closeModal())

  const modalState = useStoreState((state) => state.GameEndModal)

  // console.log(modalState.isOpen)

  // const updateGameEndModal = useStoreActions((actions) => actions.updateGameEndModal)

  function closeModal() {
    setIsOpen(false)
  }

  const currentTimeDate = new Date()

  const startTimeDate = new Date('2024-05-10T10:00:00+08:00')

  const localCurrentDate = showCurrentDate(currentTimeDate)
  const localCurrentTime = showCurrentTime(currentTimeDate)

  const localStartDate = showLocaleDate(startTimeDate)
  const localStartTime = showLocaleTime(startTimeDate)

  useEffect(() => {
    // const delay = setTimeout(() => {
    //   setIsLoading(false)
    // }, 2000)

    // clearTimeout(delay)

    const interval = setInterval(() => {
      // Calculate the time left in each tick

      // const targetDate = new Date('2024-05-09T09:00:00+07:00')
      const timeLeftInMS = startTimeDate.getTime() - currentTimeDate.getTime()
      if (timeLeftInMS > 0) {
        setTimeLeft(timeLeftInMS / 1000)
      } else {
        // Clear the interval when countdown ends
        setTimeLeft(0)
        clearInterval(interval)
      }
    }, 1000) // Update every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [gameCloseTime])

  const [isLoading, setIsLoading] = useState(true)

  // {!canBuyTicket && !canClaim && 'The Round Has Closed'}

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent className="bg-white rounded-lg p-0 w-[75%] md:w-[32rem]">
          <div
            ref={modalRef}
            className="rounded-lg shadow-xl border-2 border-gray-800 flex flex-col text-gray-700 justify-center gap-4 items-center py-4"
            style={{
              backgroundImage: `url('/ticket/rainbow.svg')`, // different for true
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <>
              <>
                <div className="text-center px-4 text-3xl font-digit ">WELCOME TO LASTMAN</div>

                <div className="flex flex-col gap-2 text-left px-4 rounded-lg text-2xl">
                  <span className="">Round starts May 10 10:00 GMT+8.</span>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col justify-center items-center">
                    <div className="px-4 py-1 text-2xl ">Local time</div>

                    <div className="flex flex-row gap-4">
                      <div className="w-1/2 flex flex-col border border-gray-800 rounded-lg px-4 py-2 items-center justify-center text-2xl">
                        <div className="text-gray-500 whitespace-nowrap">Time now:</div>
                        <div className="">{localCurrentDate}</div>
                        <div className="">{localCurrentTime}</div>
                      </div>

                      <div className="w-1/2 flex flex-col border border-gray-800 rounded-lg px-4 py-2 items-center justify-center text-2xl">
                        <div className="text-gray-500 whitespace-nowrap">Round start:</div>
                        <div className="">{localStartDate}</div>
                        <div className="">{localStartTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border border-gray-800 rounded-lg px-4 py-2 items-center justify-center text-2xl">
                    <div className="text-gray-500">Time till round starts</div>

                    <div className="font-digit">
                      {
                        // isLoading ? (
                        //   <div className="capitalized text-2xl">TIME LEFT </div>
                        // ) :

                        timeLeft && !isNaN(timeLeft) ? (
                          <div className="flex flex-col items-center justify-center">
                            <div className="flex justify-center items-center">
                              <div className="flex flex-col text-3xl text-center font-digit">
                                {formatTime(timeLeft).hours} :
                                <div className="uppercase -translate-x-1 text-sm text-center">
                                  hr
                                </div>
                              </div>
                              <div className="ml-1 flex flex-col text-3xl text-center font-digit">
                                {' '}
                                {formatTime(timeLeft).minutes} :
                                <div className="uppercase -translate-x-1 text-sm text-center">
                                  min
                                </div>
                              </div>
                              <div className="ml-1 flex flex-col text-3xl text-center font-digit">
                                {formatTime(timeLeft).seconds}
                                <div className="uppercase text-sm text-center">sec</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )
                      }
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-center px-4 rounded-lg text-2xl ">
                  {/* <span className="">You are looking at game UI.</span> */}

                  <span className="">
                    Page will be locked when time is near - and refreshed once contract is deployed.
                  </span>

                  {/* <span className="">Join tg for updates.</span> */}
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex justify-center" onClick={closeModal}>
                    <Button variant="primary" className="w-[100%] px-10 py-2 mx-auto">
                      Continue
                    </Button>
                  </div>
                </div>
              </>
            </>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default dynamic(() => Promise.resolve(GameFirst), {
  ssr: false,
})
