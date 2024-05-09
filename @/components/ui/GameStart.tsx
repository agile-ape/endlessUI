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
import { DOCS_URL, TWITTER_URL, BASE_RPC } from '../../../services/constant'
import { VIEM_CHAIN, publicClient } from '../../../services/constant'
import { createPublicClient, http } from 'viem'

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

type GameStartType = {
  open: boolean
}

const GameStart: FC<GameStartType> = ({ open }) => {
  // const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => closeModal())

  function closeModal() {
    setIsOpen(false)
  }
  function refresh() {
    // setIsOpen(false)
    location.reload()
  }

  function enter() {
    setIsOpen(false)
    // location.reload()
  }

  const START_BLOCK: number = 14_240_600
  const [blockNumber, setBlockNumber] = useState<string>('LOADING')
  const [timeToStart, setTimeToStart] = useState<number>()
  const [isOpen, setIsOpen] = useState<boolean>(true)

  useEffect(() => {
    publicClient.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        setBlockNumber(String(blockNumber))
        setTimeToStart(Math.round((START_BLOCK - Number(blockNumber)) * 2))
        if (START_BLOCK < Number(blockNumber)) {
          //   console.log(Number(blockNumber) - START_BLOCK)
          localStorage.setItem('round1TestStart', 'false')
          location.reload()
        }
      },
    })
  })

  // {!canBuyTicket && !canClaim && 'The Round Has Closed'}
  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent className="bg-white rounded-lg p-0 w-[75%] md:w-[20rem]">
          <div
            // ref={modalRef}
            className="rounded-lg shadow-xl border-2 border-gray-800 flex flex-col text-gray-700 justify-center gap-4 items-center py-4"
            style={{
              backgroundImage: `url('/ticket/rainbow.svg')`, // different for true
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <>
              <div className="text-center px-4 py-2 rounded-lg text-3xl font-digit ">
                COUNTDOWN BEGINS
              </div>

              <div className="flex flex-col justify-center items-center text-2xl">
                <span>Round starts on block</span>{' '}
                <span className="font-digit text-black text-3xl">{START_BLOCK}</span>
              </div>
              <div className="flex flex-col gap-2 border border-gray-800 rounded-lg p-2 items-center justify-center">
                <div className=" text-2xl">Current block:</div>
                <div className="flex justify-center font-digit text-black text-3xl items-center">
                  {Number(blockNumber) || 'Loading'}
                </div>
                <div className="text-2xl">≈ {timeToStart} secs</div>
              </div>

              <div className="flex items-center justify-center mb-4">
                {/* <div className="flex flex-col gap-2 justify-center">
                  <Button
                    variant="primary"
                    onClick={refresh}
                    className="w-[100%] px-10 py-2 mx-auto"
                  >
                    Refresh
                  </Button>

                  <Button variant="primary" onClick={enter} className="w-[100%] px-10 py-2 mx-auto">
                    Enter
                  </Button>
                </div> */}
              </div>
            </>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default dynamic(() => Promise.resolve(GameStart), {
  ssr: false,
})
