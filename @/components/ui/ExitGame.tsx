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

function ExitGame() {
  // State variables
  const phase = useStoreState((state) => state.phase)
  const ticketCount = useStoreState((state) => state.ticketCount)

  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  // Address read
  const { address, isConnected } = useAccount()

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
  // const ifSplit = formatUnits(rankShare, 18)
  const lastManClaim = formatUnits(prizeFactor, 18)

  let ticketStatus = ownedTicket?.status || 0
  let ticketIsInPlay = ownedTicket?.isInPlay || false
  let ticketRank = ownedTicket?.rank || 0
  let ticketPotClaim = ownedTicket?.potClaim || 0
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
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  // Active condition
  let exitGameActive: boolean
  exitGameActive =
    (phase === 'day' || phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') &&
    ticketStatusString !== 'exited'

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
      // const nextPrice = parseUnits(String(nextTicketPriceConverted), 18)

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="exit" className="px-5 py-1 leading-10 h-12 w-full mt-4 text-2xl">
          {ticketStatusString !== 'exited' && (
            <div className="flex justify-start items-center">
              <OnSignal active={exitGameActive} own={true} />
              Exit and claim ETH
            </div>
          )}
          {ticketStatusString === 'exited' && (
            <div className=" text-center text-2xl pointer-events-none cursor-default rounded-none border-0">
              You have exited
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Exit Game
              <Image
                priority
                src={`/indicator/dayIndicator.svg`}
                height={300}
                width={60}
                // fill={true}
                // sizes="max-width:150px"
                className=""
                // layout="fixed"
                alt={`dayIndicator`}
              />
              {/* <div className="day-last">
                <span className="font-headline">Day</span> Action, or when Game Ends
              </div> */}
            </DialogTitle>
            <ScrollArea className="h-[450px] md:h-[650px] rounded-md p-2">
              <div className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/ExitGame.png"
                  // layout="fill"
                  // objectFit='cover'
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                <div className="w-[100%] text-base sm:text-lg md:text-xl text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2 leading-tight">
                    Players can decide to leave the game anytime in the{' '}
                    <span className="font-headline day-last">DAY</span> (or when game ends).
                  </p>
                  <p className="mb-2 leading-tight">
                    Every player that leave/exit gets to claim a portion of the pot, even if they
                    are killed.
                  </p>
                  <a
                    href={DOCS_URL_exit}
                    target="_blank"
                    className="link text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  {ticketStatusString === 'exited'
                    ? 'Amount you have claimed'
                    : 'Amount you can claim'}
                </div>

                <div className="w-[220px] md:w-[320px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  {/* <div className="w-[100%] text-zinc-800 dark:text-zinc-200"> */}
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

                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                      <p className="text-left">Killed?</p>
                      <p className="text-right"> {!ticketIsInPlay ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                      <p className="text-left">Current rank</p>
                      <p className="text-right">{exitRank}</p>
                    </div>

                    <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                      Game stats
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                      <p className="text-left">Total joined</p>
                      <p className="text-right"> {Number(totalJoined)} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                      <p className="text-left ml-2">Give up </p>
                      <p className="text-right"> {Number(giveUpCount)} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                      <p className="text-left ml-2">Killed </p>
                      <p className="text-right"> {Number(killedCount)} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                      <p className="text-left">Players left</p>
                      <p className="text-right"> {ticketCount} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
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
                    <div className="grid grid-cols-2 text-lg gap-1 mb-2">
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
                  {ticketStatusString !== 'exited' && exitGameActive && (
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
                  {ticketStatusString !== 'exited' && !exitGameActive && (
                    <>
                      <Button variant="exit" size="lg" className="w-[100%]" disabled>
                        Exit Game
                      </Button>
                      <Prompt docLink={DOCS_URL_exit} />
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExitGame
