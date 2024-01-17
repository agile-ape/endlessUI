import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
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
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { Button } from './button'
import Image from 'next/image'
import { LogOut, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStoreActions, useStoreState } from '../../../store'
import Prompt from './Prompt'
import OnSignal from './OnSignal'
import {
  defaultContractObj,
  DOCS_URL_checkout,
  CHECK_OUT_OF_SAFEHOUSE_IMG,
  CHECK_OUT_OF_SAFEHOUSE_MOBILE_IMG,
} from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const ticketStatus = ownedTicket?.status || 0
  const ticketLastSeen = ownedTicket?.lastSeen || 0
  const ticketCheckOutRound = ownedTicket?.checkOutRound || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  return {
    phase,
    round,
    updateCompletionModal,
    ownedTicket,
    ticketStatus,
    ticketLastSeen,
    ticketCheckOutRound,
    ticketStatusString,
  }
}

export const CheckOutActive = () => {
  const { phase, ticketStatusString } = useStore()
  const checkOutActive: boolean = phase === 'day' && ticketStatusString === 'safe'
  return checkOutActive
}

const CheckOutNew = () => {
  const {
    phase,
    round,
    ticketLastSeen,
    ticketCheckOutRound,
    updateCompletionModal,
    ticketStatusString,
  } = useStore()
  const active = CheckOutActive()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkOutFromSafehouse',
  })

  const checkOutHandler = async () => {
    try {
      const tx = await writeAsync({})
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'checkedOut',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Check out failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const checkOutBackupImg = (event: any) => {
    event.target.src = '/lore/CheckOutOfSafehouse.png'
  }

  const checkOutMobileBackupImg = (event: any) => {
    event.target.src = '/lore/CheckOutOfSafehouseMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Check out</div>
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
          src={CHECK_OUT_OF_SAFEHOUSE_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="check-out-of-safehouse"
          onError={checkOutMobileBackupImg}
        />
      </div>
      <Image
        priority
        src={CHECK_OUT_OF_SAFEHOUSE_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="check-out-of-safehouse"
        onError={checkOutBackupImg}
      />

      <div className="text-center">
        <p className="mb-2">Make sure to check out on time.</p>
        <p className="mb-2">You can always check back in.</p>
        <a href={DOCS_URL_checkout} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div>

      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
      >
        <div className="m-1 capitalize text-center h2-last">Time to go?</div>

        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Checked in on</p>
              {ticketStatusString === 'safe' ? (
                <p className="text-right round-last">{ticketLastSeen}</p>
              ) : (
                <p className="text-right">Not in safehouse</p>
              )}{' '}
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Check out round </p>
              {ticketStatusString === 'safe' ? (
                <p className="text-right round-last">{ticketCheckOutRound}</p>
              ) : (
                <p className="text-right">Not in safehouse</p>
              )}{' '}
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Current round</p>
              <p className="text-right round-last"> {round} </p>
            </div>

            {ticketStatusString === 'safe' && ticketCheckOutRound > round && (
              <p className="text-xl text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                .....Chill out.....
              </p>
            )}

            {ticketStatusString === 'safe' && ticketCheckOutRound === round && phase === 'day' && (
              <p className="text-xl text-amber-600 mt-2 text-center">Today is check out day</p>
            )}

            {ticketStatusString === 'safe' &&
              ticketCheckOutRound === round &&
              phase === 'night' && (
                <p className="text-xl text-red-600 mt-2 text-center">You are overstaying...</p>
              )}

            {ticketStatusString === 'safe' && ticketCheckOutRound < round && (
              <p className="text-xl text-red-600 mt-2 text-center">You are overstaying...</p>
            )}
          </div>
          <Button
            variant="checkOut"
            size="lg"
            className="w-full"
            onClick={checkOutHandler}
            isLoading={isLoading}
            disabled={!active}
          >
            Check Out
          </Button>
          {!active && <Prompt docLink={DOCS_URL_checkout} />}
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(CheckOutNew), { ssr: false })
