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
import { Split, AlertTriangle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'

function SplitIt() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  if (isDisabled)
    return (
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="splitPot" className="w-full text-xl" disabled>
              Split Pot
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <div className="flex flex-row px-3 py-1 max-w-[240px] text-sm cursor-default">
              <AlertTriangle size={16} className="text-sm mr-1"></AlertTriangle>
              <span>
                Players can only vote to split pot during the Day, and only after Stage 1.
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

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
            <DialogTitle className="text-3xl text-center font-normal">
              Vote to split the remaining pot
              <div className="day-last">
                <span className="font-headline">Day</span> Action (Stage 2 and 3)
              </div>
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
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">
                    The pot is split among remaining players once the votes crosses the threshold.
                  </p>
                  <p className="mb-2">You can change your mind and vote No later too.</p>
                </div>
                {/* Voting information */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Do you want to split pot?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">Current pot</p>
                      <p className="text-right"> 5 ETH </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">If split now, each gets </p>
                      <p className="text-right"> 3 ETH </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left"> Yes votes</p>
                      <p className="text-right"> 8 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Vote threshold</p>
                      <p className="text-right"> 7 </p>
                    </div>

                    <div className="text-xl md:text-2xl lg:text-3xl m-1 mt-4 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                      Your Vote
                    </div>

                    <div className="flex justify-center text-2xl gap-4">
                      <span>No</span>
                      <Switch
                      // disabled={round < suddenDeathRound}
                      />
                      <span>Yes</span>
                    </div>
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
