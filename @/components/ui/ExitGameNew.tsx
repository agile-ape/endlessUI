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
import { defaultContractObj, DOCS_URL_exit } from '../../../services/constant'
import { formatNumber, statusPayload } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import Prompt from './Prompt'
import OnSignal from './OnSignal'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
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
  const { phase, ticketStatusString } = useStore()

  const exitGameActive: boolean =
    (phase === 'day' || phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') &&
    ticketStatusString !== 'exited'

  return exitGameActive
}

const ExitGameNew = () => {
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
        title: 'Exit Game failed',
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

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-16 body-last">
      <div className="sm:hidden block flex flex-col">
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Exit game</div>
          <Image
            priority
            src={`/indicator/dayIndicator.svg`}
            height={300}
            width={60}
            className=""
            alt="dayIndicator"
          />
        </div>
        <Image
          priority
          src="/lore/ExitGameMobile.png"
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="exit-game"
        />
      </div>
      <Image
        priority
        src="/lore/ExitGame.png"
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="exit-game"
      />

      <div className="text-center">
        <p className="mb-2">
          Leave anytime in the <span className="font-headline day-last">DAY</span>.
        </p>
        <p className="mb-2">Or when game ends.</p>
        <p className="mb-2">All gets to claim some ETH from pot.</p>
        <p className="mb-2">Even if killed.</p>
        <a href={DOCS_URL_exit} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div>

      <div className="m-1 capitalize text-center h2-last">
        {ticketStatusString === 'exited' ? 'Amount you have claimed' : 'Amount you can claim'}
      </div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-2xl text-center text-purple-800 dark:text-purple-300 shadow-md border-[2px] border-violet-800 dark:border-violet-300 rounded-xl items-center p-2 gap-3">
          {ticketStatusString === 'exited' && (
            <p>
              {formatNumber(ticketClaimed, {
                maximumFractionDigits: 6,
                minimumFractionDigits: 3,
              })}{' '}
              ETH
            </p>
          )}

          {ticketStatusString === 'dead' && (
            <p>
              {formatNumber(killClaim, {
                maximumFractionDigits: 6,
                minimumFractionDigits: 3,
              })}{' '}
              ETH
            </p>
          )}
          {ticketIsInPlay && (
            <p>
              {formatNumber(exitClaim, {
                maximumFractionDigits: 6,
                minimumFractionDigits: 3,
              })}{' '}
              ETH
            </p>
          )}
        </div>
        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col 
                gap-4 justify-center items-center h3-last
                "
        >
          <div className="m-1 capitalize text-center h2-last">Leaving us?</div>

          <div className="">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Killed?</p>
              <p className="text-right"> {!ticketIsInPlay ? 'Yes' : 'No'}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Current rank</p>
              <p className="text-right">{exitRank}</p>
            </div>

            <div className="h3-last text-center">Game stats</div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Total joined</p>
              <p className="text-right"> {Number(totalJoined)} </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left ml-2">Give up </p>
              <p className="text-right"> {Number(giveUpCount)} </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left ml-2">Killed </p>
              <p className="text-right"> {Number(killedCount)} </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Players left</p>
              <p className="text-right"> {ticketCount} </p>
            </div>

            <div className="text-center h3-last">Claim</div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">If last till now</p>
              <p className="text-right">
                {/* {`${rankClaim} ETH`}  */}
                {formatNumber(exitClaim, {
                  maximumFractionDigits: 5,
                  minimumFractionDigits: 3,
                })}{' '}
                ETH
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Last Man can claim</p>
              <p className="text-right">
                {/* {Number(lastManClaim)} ETH  */}
                {formatNumber(lastManClaim, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}{' '}
                ETH
              </p>
            </div>
          </div>

          {ticketStatusString === 'exited' && (
            <Button variant="exit" size="lg" className="w-[100%]" disabled>
              You have exited
            </Button>
          )}
          {ticketStatusString !== 'exited' && active && (
            <Button
              variant="exit"
              size="lg"
              isLoading={isLoading}
              onClick={exitGameHandler}
              className="w-[100%]"
            >
              {`Exit Game and claim ${formatNumber(exitClaim, {
                maximumFractionDigits: 3,
                minimumFractionDigits: 3,
              })} ETH`}
            </Button>
          )}
          {ticketStatusString !== 'exited' && !active && (
            <>
              <Button variant="exit" size="lg" className="w-[100%]" disabled>
                Exit Game
              </Button>
              <Prompt docLink={DOCS_URL_exit} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ExitGameNew), { ssr: false })
