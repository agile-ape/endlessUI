import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import dynamic from 'next/dynamic'

import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { Button } from './button'
import Image from 'next/image'
import {
  LogIn,
  ChevronUp,
  ChevronDown,
  MinusCircle,
  PlusCircle,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react'
// import { , ChevronDownIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import Prompt from './Prompt'
import { formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
// import { tokenContractObj } from '../../../services/constant'
import OnSignal from './OnSignal'
import {
  defaultContractObj,
  tokenContractObj,
  DOCS_URL_safehouse,
  WEBSOCKET_ENDPOINT,
  CHECK_INTO_SAFEHOUSE_IMG,
  CHECK_INTO_SAFEHOUSE_MOBILE_IMG,
  CHAIN_ID,
} from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'
import { io } from 'socket.io-client'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const ticketStatus = ownedTicket?.status || 0
  const ticketIsInPlay = ownedTicket?.isInPlay || false
  const ticketSafehouseNights = ownedTicket?.safehouseNights || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  return {
    phase,
    updateCompletionModal,
    ownedTicket,
    ticketStatus,
    ticketIsInPlay,
    ticketSafehouseNights,
    ticketStatusString,
  }
}

export const CheckInActive = () => {
  const { phase, ticketStatusString, ticketIsInPlay } = useStore()
  const checkInActive: boolean =
    phase === 'day' && ticketStatusString !== 'safe' && ticketIsInPlay === true
  return checkInActive
}

const CheckInNew = () => {
  const { updateCompletionModal, ticketSafehouseNights, ticketStatusString } = useStore()
  const active = CheckInActive()
  const { address, isConnected } = useAccount()
  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'safehouseCostPerNight',
      },
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
    ],
  })

  const safehouseCostPerNight = data?.[0].result || BigInt(0)
  const balanceOf = data?.[1].result || BigInt(0)

  const stayCost = formatUnits(safehouseCostPerNight, 3)
  const tokenBalance = formatUnits(balanceOf, 18)

  const events: Event[] = [
    {
      name: `events-${CHAIN_ID}`,
      async handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'SafehousePrice') {
          const { price, time } = dataJson
          refetch()
        }
      },
    },
  ]

  useSocketEvents(events)

  const [nights, setNights] = React.useState<string>('')
  const totalCost = Number(stayCost) * Number(nights)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: checkInData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkIntoSafehouse',
  })

  const checkInHandler = async () => {
    try {
      const tx = await writeAsync({
        args: [BigInt(nights)],
      })
      const hash = tx.hash
      console.log(hash)

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'checkedIn',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Check into Safehouse failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: checkInData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  const checkInBackupImg = (event: any) => {
    event.target.src = '/lore/CheckIntoSafehouse.png'
  }

  const checkInMobileBackupImg = (event: any) => {
    event.target.src = '/lore/CheckIntoSafehouseMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Check in</div>
          <Image
            priority
            src={`/indicator/dayIndicator.svg`}
            height={300}
            width={60}
            className=""
            alt="dayIndicator"
          />
        </div> */}
        <Image
          priority
          src={CHECK_INTO_SAFEHOUSE_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="check-into-safehouse"
          onError={checkInMobileBackupImg}
        />
      </div>

      <Image
        priority
        src={CHECK_INTO_SAFEHOUSE_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="check-into-safehouse"
        onError={checkInMobileBackupImg}
      />

      <div className="text-center">
        <p className="mb-2">You cannot be killed in Safehouse.</p>
        <p className="mb-2">But actions are limited.</p>
        <p className="mb-2">Don't overstay.</p>
        <p className="mb-2">Others can kick you out.</p>
        <a href={DOCS_URL_safehouse} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div>
      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
      >
        <div className="m-1 capitalize text-center h2-last">Take a break?</div>

        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">$LAST held</p>
              <p className="text-right">
                {' '}
                {formatNumber(tokenBalance, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                })}{' '}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Nights stayed</p>
              <p className="text-right"> {ticketSafehouseNights} </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Price per night</p>
              <p className="text-right"> {stayCost} $LAST </p>
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center gap-2">
            <label htmlFor="checkIn" className="text-2xl">
              Nights:
            </label>
            <div className="flex gap-2 justify-center items-center">
              <button
                className="flex justify-center items-center"
                onClick={() => Number(nights) > 0 && setNights(String(Number(nights) - 1))}
              >
                <MinusCircle size={28} />
              </button>

              <input
                type="text"
                id="checkIn"
                required
                className="w-[6rem] font-digit text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl flex justify-between items-center p-2 gap-3"
                value={nights}
                placeholder="0"
                onChange={(e) => setNights(e.target.value)}
              />

              <button
                className="flex justify-center items-center"
                onClick={() => setNights(String(Number(nights) + 1))}
              >
                <PlusCircle size={28} />
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <div className="text-2xl flex justify-between items-center p-2 gap-3">
                Cost to stay:
              </div>
              <div className="text-2xl flex justify-between items-center p-2 gap-3">
                {totalCost} LAST
              </div>
            </div>

            {totalCost > Number(tokenBalance) && (
              <p className="digit-last mt-2 text-center">You can't afford to stay</p>
            )}
          </div>

          <Button
            variant="checkIn"
            size="lg"
            className="w-full"
            onClick={checkInHandler}
            isLoading={isLoading}
            disabled={!active}
          >
            Check In
          </Button>

          <div className="digit-last">
            {ticketStatusString === 'safe' ? (
              <>In Safehouse</>
            ) : active ? (
              ''
            ) : (
              <Prompt docLink={DOCS_URL_safehouse} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(CheckInNew), { ssr: false })
