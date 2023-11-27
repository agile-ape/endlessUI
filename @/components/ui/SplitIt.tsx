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
import { tokenConversion } from '@/lib/utils'
import { defaultContractObj, DOCS_URL_split } from '../../../services/constant'
import { useStoreActions, useStoreState } from '../../../store'
import OnSignal from './OnSignal'
import { statusPayload } from '@/lib/utils'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { toast } from './use-toast'

function SplitIt() {
  // State variables
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const suddenDeath = useStoreState((state) => state.suddenDeath)
  const currentPot = useStoreState((state) => state.currentPot)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const voteCount = useStoreState((state) => state.voteCount)
  const voteThreshold = useStoreState((state) => state.voteThreshold)
  const amountDrained = useStoreState((state) => state.amountDrained)
  const drainStart = useStoreState((state) => state.drainStart)
  const drainSwitch = useStoreState((state) => state.drainSwitch)

  const splitAmountPerPerson = currentPot / tokenConversion / ticketCount
  const voteShare = voteCount / ticketCount
  const amountDrainedConverted = amountDrained / tokenConversion

  // Address read
  const { address, isConnected } = useAccount()

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
  })

  let ticketStatus = Number(playerTicket?.[3] || BigInt(0))
  let ticketIsInPlay = Boolean(playerTicket?.[5] || 0)
  let ticketVote = Boolean(playerTicket?.[6] || 0)

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  // Active condition
  let stage: number

  if (round === 0) {
    stage = 0
  } else if (round < suddenDeath) {
    stage = 1
  } else if (round >= suddenDeath && round < drainStart && drainSwitch === false) {
    stage = 2
  } else if (round > suddenDeath && round >= drainStart && drainSwitch === true) {
    stage = 3
  } else {
    stage = 0
  }

  let splitActive: boolean
  splitActive =
    phase === 'day' &&
    (stage === 2 || stage === 3) &&
    ticketStatusString !== 'safe' &&
    ticketIsInPlay === true
  // splitActive = true

  // Contract write
  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'toggleSplitPot',
  })

  const splitHandler = async () => {
    try {
      const tx = await writeAsync()
      const hash = tx.hash
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Split failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
    }
  }

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
                    Once vote threshold is crossed, the game ends.
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
                    className="mb-2 underline text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>
                {/* Voting information */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Do you want to split pot?
                </div>

                <div className="w-[280px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left">Current pot</p>
                      <p className="text-right"> {currentPot} ETH </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left">If split, each gets </p>
                      <p className="text-right"> {splitAmountPerPerson} ETH </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left"> Yes votes</p>
                      <p className="text-right"> {voteCount}</p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left"> Yes share</p>
                      <p className="text-right"> {voteShare}%</p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left">Vote threshold</p>
                      <p className="text-right"> {voteThreshold}% </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className={`text-left`}>Amount drained (Stage 3)</p>
                      <p className="text-right"> {amountDrainedConverted} ETH </p>
                    </div>

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
                    {!splitActive && <Prompt />}
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
