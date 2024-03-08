import React, { useRef, useState } from 'react'
import type { IApp } from 'types/app'

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

import { Button } from './button'
import Image from 'next/image'
import { LogOut, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useSignMessage,
  useWalletClient,
  useWaitForTransaction,
} from 'wagmi'
import {
  defaultContractObj,
  DOCS_URL_exit,
  EXIT_GAME_IMG,
  EXIT_GAME_MOBILE_IMG,
} from '../../../services/constant'
import { formatNumber, statusPayload } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import Prompt from './Prompt'
import OnSignal from './_OnSignal'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const ticketId = ownedTicket?.id || 0
  const ticketStatus = ownedTicket?.status || 0
  const ticketCount = useStoreState((state) => state.ticketCount)
  const ticketIsInPlay = ownedTicket?.isInPlay || false
  const ticketSafehouseNights = ownedTicket?.safehouseNights || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'
  const ticketRank = ownedTicket?.rank || 0
  const ticketPotClaim = ownedTicket?.potClaim || 0

  return {
    phase,
    updateCompletionModal,
    ownedTicket,
    ticketId,
    ticketStatus,
    ticketCount,
    ticketIsInPlay,
    ticketSafehouseNights,
    ticketStatusString,
    ticketRank,
    ticketPotClaim,
  }
}

export const ExitGameActive = () => {
  const { phase, ticketStatusString, ticketId } = useStore()

  const exitGameActive: boolean =
    (phase === 'day' || phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') &&
    ticketStatusString !== 'exited' &&
    ticketId > 0

  return exitGameActive
}

const ExitGame = () => {
  const {
    phase,
    updateCompletionModal,
    ownedTicket,
    ticketStatus,
    ticketCount,
    ticketIsInPlay,
    ticketStatusString,
    ticketRank,
    ticketPotClaim,
  } = useStore()
  const active = ExitGameActive()

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'rankClaim',
        args: [BigInt(ticketCount)],
        // enabled: !!ticketCount,
      },
      {
        ...defaultContractObj,
        functionName: 'giveUpCount',
      },
      {
        ...defaultContractObj,
        functionName: 'killedCount',
      },
      {
        ...defaultContractObj,
        functionName: 'rankShare',
      },
      {
        ...defaultContractObj,
        functionName: 'prizeFactor',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketId',
      },
    ],
  })

  const rankClaim = data?.[0].result || BigInt(0)
  const giveUpCount = data?.[1].result || BigInt(0)
  const killedCount = data?.[2].result || BigInt(0)
  const rankShare = data?.[3].result || BigInt(0)
  const prizeFactor = data?.[4].result || BigInt(0)
  const totalJoined = data?.[5].result || BigInt(0)

  const exitClaim = formatUnits(rankClaim, 18)
  const lastManClaim = formatUnits(prizeFactor, 18)
  const ticketClaimed = formatUnits(BigInt(ticketPotClaim), 18)

  let exitRank: number

  if (ticketIsInPlay) {
    if (phase === 'peacefound' || phase === 'drain') {
      exitRank = Number(rankShare) // rank not assigned to ticket before they exit. hence must reference separately.
    } else {
      exitRank = ticketCount
    }
  } else {
    exitRank = Number(ticketRank)
  }

  // have a ticket rank only if you are killed when you exit. if alive, no ticket rank
  const { data: claimIfKilled } = useContractRead({
    ...defaultContractObj,
    functionName: 'rankClaim',
    args: [BigInt(ticketRank)],
    enabled: !!ticketRank,
  })

  const killClaim = formatUnits(claimIfKilled || BigInt(0), 18)

  let playerClaim: string

  if (ticketStatusString === 'exited') {
    playerClaim = ticketClaimed
  } else if (ticketStatusString === 'dead') {
    playerClaim = ticketClaimed
  } else {
    playerClaim = exitClaim
  }

  // console.log(killClaim)

  // Contract write
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: exitData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'exitGame',
  })

  const exitGameHandler = async () => {
    try {
      const tx = await writeAsync()
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'exitGame',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Exit Arena failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const {} = useWaitForTransaction({
    hash: exitData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  const exitGameBackupImg = (event: any) => {
    event.target.src = '/lore/ExitGame.png'
  }

  const exitGameMobileBackupImg = (event: any) => {
    event.target.src = '/lore/ExitGameMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Exit game</div>
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
          src={EXIT_GAME_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="exit-game"
          onError={exitGameMobileBackupImg}
        />
      </div>
      <Image
        priority
        src={EXIT_GAME_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="exit-game"
        onError={exitGameBackupImg}
      />

      <div className="capitalize text-center h2-last">
        {ticketStatusString === 'exited' ? 'Redeemed value' : 'Ticket value'}
      </div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-3xl text-center border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 shadow-md rounded-xl items-center p-2 gap-3">
          <p className="font-digit">
            {formatNumber(playerClaim, {
              maximumFractionDigits: 6,
              minimumFractionDigits: 3,
            })}{' '}
            ETH
          </p>
        </div>
        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
        >
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Still in game?</p>
              <p className="text-right"> {ticketIsInPlay ? 'Yes' : 'No'}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Claimed pot?</p>
              <p className="text-right">{ticketIsInPlay ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            isLoading={isLoading}
            onClick={exitGameHandler}
            className="w-full"
            disabled={false}
          >
            Claim ticket
          </Button>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ExitGame), { ssr: false })
