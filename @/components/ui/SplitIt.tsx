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
import { Button } from './button'

import Image from 'next/image'
import { Split, AlertTriangle, AlertCircle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import Prompt from './Prompt'
import { tokenConversion, formatNumber } from '@/lib/utils'
import { defaultContractObj, DOCS_URL_split, TWITTER_URL } from '../../../services/constant'
import { useStoreActions, useStoreState } from '../../../store'
import OnSignal from './OnSignal'
import { statusPayload } from '@/lib/utils'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useContractEvent,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'

function SplitIt({ playerTicket }: { playerTicket: any }) {
  // State variables
  const phase = useStoreState((state) => state.phase)
  // const round = useStoreState((state) => state.round)
  const stage = useStoreState((state) => state.stage)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'suddenDeath',
      },
      {
        ...defaultContractObj,
        functionName: 'currentPot',
      },
      {
        ...defaultContractObj,
        functionName: 'voteCount',
      },
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
        functionName: 'drainSwitch',
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
    ],
  })

  const suddenDeath = Number(data?.[0].result || BigInt(0))
  const currentPot = data?.[1].result || BigInt(0)
  const voteCount = Number(data?.[2].result || BigInt(0))
  const voteThreshold = Number(data?.[3].result || BigInt(0))
  const minPotSize = data?.[4].result || BigInt(0)
  const drainStart = Number(data?.[5].result || 0)
  const drainSwitch = Boolean(data?.[6].result || 0)
  const drainRate = data?.[7].result || BigInt(0)
  const drainPerRound = data?.[8].result || BigInt(0)
  const amountDrained = data?.[9].result || BigInt(0)
  const drainPot = data?.[10].result || BigInt(0)

  console.log(amountDrained)
  const drainShare = formatUnits(drainRate, 1)
  const minPot = formatUnits(minPotSize, 1)
  const drainFromPot = formatUnits(amountDrained, 18)
  const amountInPot = formatUnits(currentPot, 18)
  const potToDrain = formatUnits(drainPot, 18)

  // const suddenDeath = useStoreState((state) => state.suddenDeath)
  // const currentPot = useStoreState((state) => state.currentPot)
  // const voteCount = useStoreState((state) => state.voteCount)
  // const voteThreshold = useStoreState((state) => state.voteThreshold)
  // const amountDrained = useStoreState((state) => state.amountDrained)
  // const drainStart = useStoreState((state) => state.drainStart)
  // const drainSwitch = useStoreState((state) => state.drainSwitch)

  const drainAmount = (Number(drainShare) / 100) * Number(potToDrain)
  const potToEnd = (Number(minPot) / 100) * Number(potToDrain)

  const splitAmountPerPlayer = Number(amountInPot) / ticketCount

  const thresholdCount = Math.floor((voteThreshold * ticketCount) / 100) + 1

  // if (drainSwitch === true) {
  // }

  // const voteShare = voteCount / ticketCount
  // const amountDrainedConverted = amountDrained / tokenConversion

  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  // Address read
  const { address, isConnected } = useAccount()

  // const { data: playerTicket } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'playerTicket',
  //   args: [address as `0x${string}`],
  // })

  // let ticketStatus = Number(playerTicket?.[3] || BigInt(0))
  // let ticketIsInPlay = Boolean(playerTicket?.[5] || 0)
  // let ticketVote = Boolean(playerTicket?.[6] || 0)

  const ticketStatus = ownedTicket?.status || 0
  const ticketIsInPlay = ownedTicket?.isInPlay || false
  const ticketVote = ownedTicket?.vote || false

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  // Active condition
  // let stage: number

  // if (round === 0) {
  //   stage = 0
  // } else if (round < suddenDeath) {
  //   stage = 1
  // } else if (round >= suddenDeath && drainSwitch === false) {
  //   stage = 2
  // } else if (round > suddenDeath && round >= drainStart && drainSwitch === true) {
  //   stage = 3
  // } else {
  //   stage = 0
  // }

  let splitActive: boolean
  splitActive =
    phase === 'day' &&
    (stage === 2 || stage === 3) &&
    ticketStatusString !== 'safe' &&
    ticketIsInPlay === true
  // splitActive = true

  // Contract write
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'toggleSplitPot',
  })

  const splitHandler = async () => {
    try {
      // const originalVote = ticketVote

      const tx = await writeAsync()

      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        // references initial ticketVote.
        state: ticketVote ? 'voteNo' : 'voteYes',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Split failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  useContractEvent({
    ...defaultContractObj,
    eventName: 'DrainTriggered',
    listener: (event) => {
      const args = event[0]?.args
      const { drainRound, drainRate, time } = args
      refetch()
    },
  })

  useContractEvent({
    ...defaultContractObj,
    eventName: 'PhaseChange',
    listener: (event) => {
      refetch()
    },
  })

  useContractEvent({
    ...defaultContractObj,
    eventName: 'VoteYes',
    listener: (event) => {
      refetch()
    },
  })

  useContractEvent({
    ...defaultContractObj,
    eventName: 'VoteNo',
    listener: (event) => {
      refetch()
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="splitPot" className="w-full text-xl flex justify-start">
          <OnSignal active={splitActive} own={true} />
          Split Pot
          {/* <Split size={16} className="text-sm ml-1"></Split> */}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              <div>
                <span>Vote to split pot</span>
                {/* <span className="text-md sm:text-lg md:text-xl ">(Stage 2 and 3)</span> */}
              </div>
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
                <span className="font-headline">Day</span> Action (Stage 2 and 3)
              </div> */}
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <div className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/SplitPot.png"
                  // layout="fill"
                  // objectFit='cover'
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                <div className="w-[100%] text-base sm:text-lg md:text-xl text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2 leading-tight">
                    Players can vote to split pot post-Stage 1 in the{' '}
                    <span className="font-headline day-last">Day</span>.
                  </p>
                  <p className="mb-2 leading-tight">
                    Once count to split pot is reached, the game ends.
                  </p>

                  <p className="mb-2 leading-tight">
                    Remaining pot is split among remaining players.
                  </p>

                  <p className="mb-2 leading-tight">
                    Players can change their mind and vote back No.
                  </p>

                  <a
                    href={DOCS_URL_split}
                    target="_blank"
                    className="link mb-2 text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>
                {/* Voting information */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Do you want to split pot?
                </div>

                <div className="w-[320px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left leading-tight">Current pot</p>
                      <p className="text-right">
                        {' '}
                        {formatNumber(amountInPot, {
                          maximumFractionDigits: 3,
                          minimumFractionDigits: 0,
                        })}{' '}
                        ETH
                      </p>
                    </div>
                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left leading-tight"> Stage 2 starts on</p>
                      <p className="text-right">
                        {' '}
                        Round <span className="round-last">{suddenDeath}</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left leading-tight"> Stage 3 starts on</p>
                      <p className="text-right">
                        {stage !== 3 && (
                          <p>
                            {' '}
                            <a href={TWITTER_URL} className="link">
                              {' '}
                              Follow for update
                            </a>{' '}
                          </p>
                        )}
                        {stage === 3 && (
                          <p>
                            {' '}
                            Round <span className="round-last">{drainStart}</span>
                          </p>
                        )}
                      </p>
                    </div>

                    <Accordion type="multiple">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="text-xl text-zinc-500 dark:text-zinc-400">
                            Stage 2 and 3
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="gap-1">
                          <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight">Split now and get </p>
                            <p className="text-right">
                              {' '}
                              {formatNumber(splitAmountPerPlayer, {
                                maximumFractionDigits: 3,
                                minimumFractionDigits: 0,
                              })}{' '}
                              ETH each
                            </p>
                          </div>
                          <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight"> Yes / Split pot count</p>
                            <p className="text-right">
                              <TooltipProvider delayDuration={10}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    {voteCount} / {thresholdCount}
                                  </TooltipTrigger>
                                  <TooltipContent side="top" align="center">
                                    <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                                      {voteThreshold}% of tickets that are in play
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </p>
                          </div>
                          {/* <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight"> Count to split pot </p>
                            <p className="text-right"> {thresholdCount}</p>
                          </div> */}
                          {/* <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight"> Stage 3 starts on</p>{' '}
                            {drainSwitch === true && (
                              <p className="text-right underline">Round {drainStart}</p>
                            )}
                          </div> */}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>
                          <div className="text-xl text-zinc-500 dark:text-zinc-400">Stage 3</div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight">Stage 3 pot size</p>
                            {drainSwitch === true && (
                              <p className="text-right">
                                {' '}
                                {formatNumber(potToDrain, {
                                  maximumFractionDigits: 3,
                                  minimumFractionDigits: 0,
                                })}
                                ETH
                              </p>
                            )}{' '}
                          </div> */}
                          <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight">Drain per round</p>
                            <p className="text-right">
                              <TooltipProvider delayDuration={10}>
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
                                      {formatNumber(drainShare, {
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
                              </TooltipProvider>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight">Game ends once pot</p>
                            <p className="text-right">
                              <TooltipProvider delayDuration={10}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    {'<'}
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
                              </TooltipProvider>
                            </p>
                          </div>
                          <div className="grid grid-cols-2 text-lg gap-1">
                            <p className="text-left leading-tight"> Amount drained so far </p>
                            {stage === 3 && (
                              <p className="text-right">
                                {' '}
                                {formatNumber(drainFromPot, {
                                  maximumFractionDigits: 6,
                                  minimumFractionDigits: 0,
                                })}{' '}
                                ETH
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="text-xl md:text-2xl lg:text-3xl m-1 mt-4 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                      Your Vote
                    </div>

                    <div className="flex justify-center text-2xl gap-4">
                      <span>No</span>
                      {splitActive && (
                        <Switch defaultChecked={ticketVote} onCheckedChange={splitHandler} />
                      )}
                      {!splitActive && <Switch defaultChecked={ticketVote} disabled />}

                      <span>Yes</span>
                    </div>
                    {!splitActive && <Prompt docLink={DOCS_URL_split} />}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SplitIt
