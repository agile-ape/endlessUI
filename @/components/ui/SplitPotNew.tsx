import React, { useEffect, useRef, useState } from 'react'
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
import dynamic from 'next/dynamic'

import Image from 'next/image'
import { Split, AlertTriangle, AlertCircle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import Prompt from './Prompt'
import { formatNumber } from '@/lib/utils'
import {
  defaultContractObj,
  DOCS_URL_split,
  TWITTER_URL,
  WEBSOCKET_ENDPOINT,
} from '../../../services/constant'
import { useStoreActions, useStoreState } from '../../../store'
import OnSignal from './OnSignal'
import { statusPayload } from '@/lib/utils'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'
import { io } from 'socket.io-client'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'
import type path from 'path'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const stage = useStoreState((state) => state.stage)
  const suddenDeath = useStoreState((state) => state.suddenDeath)
  const currentPot = useStoreState((state) => state.currentPot)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const voteCount = useStoreState((state) => state.voteCount)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const ticketStatus = ownedTicket?.status || 0
  const ticketIsInPlay = ownedTicket?.isInPlay || false
  const ticketVote = ownedTicket?.safehouseNights || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  return {
    phase,
    updateCompletionModal,
    stage,
    suddenDeath,
    currentPot,
    ticketCount,
    voteCount,
    ownedTicket,
    ticketStatus,
    ticketIsInPlay,
    ticketVote,
    ticketStatusString,
  }
}

export const SplitPotActive = () => {
  const { phase, stage, ticketStatusString, ticketIsInPlay } = useStore()
  const splitPotActive: boolean =
    phase === 'day' &&
    (stage === 2 || stage === 3) &&
    ticketStatusString !== 'safe' &&
    ticketIsInPlay === true
  return splitPotActive
}

export const SplitPotNew = () => {
  const {
    phase,
    updateCompletionModal,
    stage,
    suddenDeath,
    currentPot,
    ticketCount,
    voteCount,
    ownedTicket,
  } = useStore()
  const active = SplitPotActive()

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'voteThreshold',
      },
      {
        ...defaultContractObj,
        functionName: 'minPotSize',
      },
      {
        ...defaultContractObj,
        functionName: 'drainStart',
      },
      {
        ...defaultContractObj,
        functionName: 'drainRate',
      },
      {
        ...defaultContractObj,
        functionName: 'drainPerRound',
      },
      {
        ...defaultContractObj,
        functionName: 'amountDrained',
      },
      {
        ...defaultContractObj,
        functionName: 'drainPot',
      },
      {
        ...defaultContractObj,
        functionName: 'nextPotWallet',
      },
      {
        ...defaultContractObj,
        functionName: 'rankClaim',
        args: [BigInt(ticketCount)],
      },
      {
        ...defaultContractObj,
        functionName: 'prizeFactor',
      },
    ],
  })

  const voteThreshold = Number(data?.[0].result || BigInt(0))
  const minPotSize = data?.[1].result || BigInt(0)
  const drainStart = Number(data?.[2].result || 0)
  const drainRate = data?.[3].result || BigInt(0)
  const drainPerRound = data?.[4].result || BigInt(0)
  const amountDrained = data?.[5].result || BigInt(0)
  const drainPot = data?.[6].result || BigInt(0)
  const nextPotWallet = data?.[7].result || BigInt(0)
  const rankClaim = data?.[8].result || BigInt(0)
  const prizeFactor = data?.[9].result || BigInt(0)

  const minPot = formatUnits(minPotSize, 1)
  const potToDrain = formatUnits(drainPot, 18)

  const drainAmount = formatUnits(drainPerRound, 18)
  const potToEnd = (Number(minPot) / 100) * Number(potToDrain)

  const splitAmountPerPlayer = currentPot / ticketCount
  const thresholdCount = Math.floor((voteThreshold * ticketCount) / 100) + 1

  const ticketVote = ownedTicket?.vote || false

  const [isVoteYes, setIsVoteYes] = useState(ticketVote)

  const exitClaim = formatUnits(rankClaim, 18)
  const lastManClaim = formatUnits(prizeFactor, 18)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'toggleSplitPot',
  })

  const splitHandler = async () => {
    try {
      const tx = await writeAsync()

      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        // references initial ticketVote - hence opposite
        state: ticketVote ? 'voteNo' : 'voteYes',
      })
    } catch (error: any) {
      setIsVoteYes(ticketVote)
      refetch()

      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Split failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const events: Event[] = [
    {
      name: 'events',
      handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'DrainTriggered') {
          const { drainRound, drainRate, time } = dataJson
          refetch()
        }

        if (event === 'PhaseChange') {
          const { caller, previousPhase, newPhase, time } = dataJson
          refetch()
        }

        if (event === 'VoteYes') {
          const { caller, time } = dataJson
          refetch()
        }

        if (event === 'VoteNo') {
          const { caller, time } = dataJson
          refetch()
        }
      },
    },
  ]

  useSocketEvents(events)

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-16 body-last">
      <div className="sm:hidden block flex flex-col">
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Split Pot</div>
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
          src="/lore/SplitPotMobile.png"
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="split-pot"
        />
      </div>

      <Image
        priority
        src="/lore/SplitPot.png"
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="split-pot"
      />

      <div className="text-center">
        <p className="mb-2">Vote to split once Stage 2 comes.</p>
        <p className="mb-2">Games ends once Yes hits threshold.</p>
        <p className="mb-2">Remaining players share remaining pot.</p>
        <p className="mb-2">You can change your mind.</p>
        <a
          href={DOCS_URL_split}
          target="_blank"
          className="link mb-2 text-xs sm:text-sm md:text-base"
        >
          Learn more
        </a>
      </div>
      {/* Voting information */}
      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col 
                gap-4 justify-center items-center h3-last
                "
      >
        <div className="m-1 capitalize text-center h2-last">Do you want to split pot?</div>

        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div className="">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Stage 2 starts on</p>
              <p className="text-right">
                {' '}
                Round <span className="round-last">{suddenDeath}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Stage 3 starts on</p>
              <p className="text-right">
                {stage !== 3 && (
                  <>
                    {' '}
                    <a href={TWITTER_URL} className="link">
                      {' '}
                      Follow for update
                    </a>{' '}
                  </>
                )}
                {stage === 3 && (
                  <p>
                    {' '}
                    Round <span className="round-last">{drainStart}</span>
                  </p>
                )}
              </p>
            </div>
          </div>

          {/* <div className="h2-last mt-2">Stage 2 and 3</div> */}

          <div className="">
            <div className="underline">Votes</div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Players left</p>
              <div className="text-right">
                <p>{ticketCount}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Vote threshold</p>
              <div className="text-right">
                <p>{voteThreshold}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Yes votes</p>
              <div className="text-right">
                <p>{voteCount}</p>

                {/* <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger>{voteCount}</TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                                {voteThreshold}% of tickets that are in play
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider> */}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Threshold to hit</p>
              <div className="text-right">
                <p>{thresholdCount}</p>
                {/* <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger>{thresholdCount}</TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                                {voteThreshold}% of tickets that are in play
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider> */}
              </div>
            </div>
            {voteCount < thresholdCount ? (
              <p className="text-xl text-amber-600 text-center">
                {thresholdCount - voteCount} more vote(s) to go
              </p>
            ) : (
              <p className="text-xl text-green-600 text-center">We have hit the threshold!</p>
            )}
          </div>

          <div className="">
            <div className="underline">Split payoff</div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Split and get </p>
              {stage === 2 ||
                (stage === 3 && (
                  <p className="text-right">
                    {' '}
                    {formatNumber(splitAmountPerPlayer, {
                      maximumFractionDigits: 3,
                      minimumFractionDigits: 0,
                    })}{' '}
                    ETH each
                  </p>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Exit now and get </p>
              <p className="text-right">
                {formatNumber(exitClaim, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                })}{' '}
                ETH
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Lastman gets</p>
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

          <div className="">
            <div className="underline">Drain</div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Drain rate </p>
              <p className="text-right">
                {formatNumber(formatUnits(drainRate, 1), {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 0,
                })}
                %
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Stage 3 pot </p>
              <p className="text-right">
                {formatNumber(potToDrain, {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 0,
                })}{' '}
                ETH
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Drain per round</p>
              <div className="text-right">
                <p>
                  {formatNumber(drainAmount, {
                    maximumFractionDigits: 6,
                    minimumFractionDigits: 0,
                  })}{' '}
                  ETH
                </p>

                {/* <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger>
                              {formatNumber(drainAmount, {
                                maximumFractionDigits: 6,
                                minimumFractionDigits: 0,
                              })}{' '}
                              ETH
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                                {formatNumber(formatUnits(drainRate, 1), {
                                  maximumFractionDigits: 6,
                                  minimumFractionDigits: 0,
                                })}
                                % of{' '}
                                {formatNumber(potToDrain, {
                                  maximumFractionDigits: 6,
                                  minimumFractionDigits: 0,
                                })}{' '}
                                ETH (Stage 3 pot size)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider> */}
              </div>
            </div>
          </div>

          <div className="">
            <div className="underline">Game ends when</div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Pot floor </p>
              <p className="text-right">
                {formatNumber(minPot, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                })}
                %
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">{`Ends when pot <`} </p>
              <p className="text-right">
                {formatNumber(potToEnd, {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 0,
                })}{' '}
                ETH
                {/* <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger>
                              {formatNumber(potToEnd, {
                                maximumFractionDigits: 6,
                                minimumFractionDigits: 0,
                              })}{' '}
                              ETH
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                                {formatNumber(minPot, {
                                  maximumFractionDigits: 3,
                                  minimumFractionDigits: 0,
                                })}
                                % of{' '}
                                {formatNumber(potToDrain, {
                                  maximumFractionDigits: 6,
                                  minimumFractionDigits: 0,
                                })}{' '}
                                ETH (Stage 3 pot size)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider> */}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Current pot</p>
              <p className="text-right"> {currentPot} ETH</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left"> Amount drained so far</p>
              {stage === 3 && (
                <p className="text-right">
                  {' '}
                  {formatNumber(formatUnits(amountDrained, 18), {
                    maximumFractionDigits: 6,
                    minimumFractionDigits: 0,
                  })}{' '}
                  ETH
                </p>
              )}
            </div>
          </div>

          {/* <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="h3-last">Stage 3</div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="body-last">
                    
                  </div>
                </AccordionContent>
              </AccordionItem> */}

          <div className="h2-last m-1 mt-4 capitalize flex justify-center">Your Vote</div>

          <div className="flex justify-center text-2xl gap-4">
            <span>No</span>
            {active ? (
              <Switch defaultChecked={isVoteYes} onCheckedChange={splitHandler} />
            ) : (
              <>
                <Switch defaultChecked={isVoteYes} disabled />
                <Prompt docLink={DOCS_URL_split} />
              </>
            )}

            <span>Yes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(SplitPotNew), { ssr: false })
