import React, { useRef, useState, useEffect } from 'react'
import type { FC } from 'react'
import Link from 'next/link'

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

import { useStoreActions, useStoreState } from '../../../store'
import dynamic from 'next/dynamic'
import { DialogClose } from '@radix-ui/react-dialog'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { DOCS_URL, TWITTER_URL } from '../../../services/constant'

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

type GameEndType = {
  open: boolean
}

const GameEnd: FC<GameEndType> = ({ open }) => {
  const [timeLeft, setTimeLeft] = useState<number>()
  const [isOpen, setIsOpen] = useState<boolean>(open)

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
    // updateGameEndModal({
    //   isOpen: false,
    // })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the time left in each tick
      const now = new Date()
      const timeLeftInMS = gameCloseTime.getTime() - now.getTime()
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

  // {!canBuyTicket && !canClaim && 'The Round Has Closed'}
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-white rounded-lg p-0 w-[75%] md:w-[20rem]">
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
            {open && canClaim && (
              <>
                <div className="text-center px-4 py-2 rounded-lg text-3xl font-digit ">
                  The Round Has Ended
                </div>
                <div className="flex flex-col gap-2 border border-gray-800 rounded-lg p-2 items-center justify-center">
                  <div className=" text-2xl">Time till round close</div>
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col text-3xl text-center  font-digit">
                      {formatTime(Number(timeLeft)).hours} :
                      <div className="uppercase -translate-x-1  text-sm text-center">hr</div>
                    </div>
                    <div className="ml-1 flex flex-col text-3xl text-center  font-digit">
                      {' '}
                      {formatTime(Number(timeLeft)).minutes} :
                      <div className="uppercase -translate-x-1  text-sm text-center">min</div>
                    </div>
                    <div className="ml-1 flex flex-col text-3xl text-center  font-digit">
                      {formatTime(Number(timeLeft)).seconds}
                      <div className="uppercase  text-sm text-center">sec</div>
                    </div>
                  </div>
                </div>
                <div className="text-center px-4 py-2 rounded-lg text-2xl ">
                  Claim your winnings, or <a href=""></a>
                  <a href={DOCS_URL} target="_blank" className="underline">
                    roll them to the next round
                  </a>
                  .
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex justify-center" onClick={closeModal}>
                    <Button variant="primary" className="w-[100%] px-10 py-2 mx-auto">
                      Continue
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
          <>
            {open && !canClaim && (
              <>
                <div className="text-center px-4 py-2 rounded-lg text-3xl font-digit ">
                  The Round Has Closed
                </div>
                <div className="flex flex-col gap-2 rounded-lg p-2 items-center justify-center">
                  <Image
                    priority
                    src="/faces/dance.webp"
                    className=""
                    height={300}
                    width={200}
                    alt="dancing-pepe"
                  />
                </div>
                <div className="text-left px-4 py-2 rounded-lg text-2xl ">
                  Your winnings are rolled to next round if you have not claimed them.
                  <div className="mt-4">
                    <a href={TWITTER_URL} target="_blank" className="underline">
                      Follow
                    </a>{' '}
                    to be kept updated.
                  </div>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex justify-center" onClick={closeModal}>
                    <Button variant="primary" className="w-[100%] px-10 py-2 mx-auto">
                      Continue
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>

          {/* <div className="flex items-center justify-center mb-4">
            <div className="flex justify-center" onClick={closeModal}>
              <Button variant="primary" className="w-[100%] px-10 py-2 mx-auto">
                Continue
              </Button>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default dynamic(() => Promise.resolve(GameEnd), {
  ssr: false,
})
