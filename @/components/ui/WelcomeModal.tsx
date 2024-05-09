import React, { useRef, useState, useEffect } from 'react'
import type { FC } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { PopoverContentList } from '@/components/shadcn/popover-list'
import { Button } from '@/components/shadcn/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import { DOCS_URL } from '../../../services/constant'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../../store'
import {
  useAccount,
  useReadContracts,
  useSendTransaction,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { fetcher, poster, isJson, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { createPublicClient, http } from 'viem'
import { VIEM_CHAIN, publicClient } from '../../../services/constant'

interface WelcomeModalType {
  open: boolean
  // toggleModal: () => void
}

type referralData = {
  player: `0x${string}`
  referrer: `0x${string}`
  // isTake: boolean
}

const WelcomeModal: FC<WelcomeModalType> = ({ open }) => {
  const { address, isConnected } = useAccount()
  // const [value, setValue] = useState('')
  // const [referral, setReferral] = useState('')
  const [check, setCheck] = useState<string>('')

  // const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>('')

  const [submitted, setSubmitted] = useState(false)
  // const [lowerCaseAddress, setLowerCaseAddress] = useState('');

  const lowerCaseAddress = String(address?.toLowerCase())

  const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => closeModal())

  function refresh() {
    // setIsOpen(false)
    location.reload()
  }

  function enter() {
    setIsOpen(false)
    // location.reload()
  }

  const START_BLOCK: number = 9344000
  const [blockNumber, setBlockNumber] = useState<string>('LOADING')
  const [timeToStart, setTimeToStart] = useState<number>()
  const [isOpen, setIsOpen] = useState<boolean>()

  useEffect(() => {
    publicClient.watchBlockNumber({
      onBlockNumber: (blockNumber) => {
        setBlockNumber(String(blockNumber))
        setTimeToStart(Math.round((START_BLOCK - Number(blockNumber)) * 2))
        if (START_BLOCK < Number(blockNumber)) {
          setIsOpen(false)
        }
      },
    })
  })

  return (
    <>
      <Dialog open={open}>
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
                <div className="flex flex-col gap-2 justify-center">
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
                </div>
              </div>
            </>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WelcomeModal
