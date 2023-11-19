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

import { useStoreActions, useStoreState } from '../../../store'

function SplitIt() {
  // const [otpInput, setOtpInput] = React.useState<string>('')
  // const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  // const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const suddenDeath = useStoreState((state) => state.suddenDeath)
  const currentPot = useStoreState((state) => state.currentPot)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const voteCount = useStoreState((state) => state.voteCount)
  const voteThreshold = useStoreState((state) => state.voteThreshold)
  const amountDrained = useStoreState((state) => state.amountDrained)
  const drainStart = useStoreState((state) => state.drainStart)
  const drainSwitch = useStoreState((state) => state.drainSwitch)

  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  const splitAmountPerPerson = currentPot / tokenConversion / ticketCount

  const voteShare = voteCount / ticketCount

  const amountDrainedConverted = amountDrained / tokenConversion

  let stage: number
  if (round < suddenDeath) {
    stage = 1
  } else if (round >= suddenDeath && round < drainStart && drainSwitch === false) {
    stage = 2
  } else if (round > suddenDeath && round >= drainStart && drainSwitch === true) {
    stage = 3
  }

  // if (isDisabled)
  //   return (
  //     <TooltipProvider delayDuration={10}>
  //       <Tooltip>
  //         <TooltipTrigger>
  //           <Button variant="splitPot" className="w-full text-xl" disabled>
  //             Split Pot
  //           </Button>
  //         </TooltipTrigger>
  //         <TooltipContent side="top" align="center">
  //           <div className="flex flex-row px-3 py-1 max-w-[240px] text-sm cursor-default">
  //             <AlertTriangle size={16} className="text-sm mr-1"></AlertTriangle>
  //             <span>
  //               Players can only vote to split pot during the Day, and only after Stage 1.
  //             </span>
  //           </div>
  //         </TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="splitPot" className="w-full text-xl">
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
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
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

                {/* <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                        Notes
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>The pot is split once the votes cross the threshold.</p>
                      <p>You can change your mind and vote No later too.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">
                    Players can only vote to split pot during the{' '}
                    <span className="font-headline day-last">Day</span>, and only after Stage 1.
                  </p>
                  <p className="mb-2">
                    Once vote threshold is crossed, the game ends with pot split among remaining
                    players.
                  </p>
                  <p className="mb-2">You can change your mind and vote back No too.</p>
                </div>
                {/* Voting information */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Do you want to split pot?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Current pot</p>
                      <p className="text-right"> {currentPot} ETH </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">If split now, each gets </p>
                      <p className="text-right"> {splitAmountPerPerson} ETH </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left"> Yes votes / Yes share</p>
                      <p className="text-right">
                        {' '}
                        {voteCount} / {voteShare}%
                      </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Vote threshold</p>
                      <p className="text-right"> {voteThreshold}% </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className={`text-left`}>Amount drained</p>
                      <p className="text-right"> {amountDrainedConverted} ETH </p>
                    </div>

                    <div className="text-xl md:text-2xl lg:text-3xl m-1 mt-4 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                      Your Vote
                    </div>

                    <div className="flex justify-center text-2xl gap-4">
                      <span>No</span>
                      {isDisabled && <Switch disabled />}
                      {!isDisabled && <Switch />}

                      <span>Yes</span>
                    </div>
                    {isDisabled && <Prompt />}
                  </div>
                </div>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SplitIt
