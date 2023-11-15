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
import { Split, AlertTriangle, ExternalLink } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'

function Token() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  //   if (isDisabled)
  //     return (
  //       <TooltipProvider delayDuration={10}>
  //         <Tooltip>
  //           <TooltipTrigger>
  //             <Button variant="splitPot" className="w-full text-xl" disabled>
  //               Split Pot
  //             </Button>
  //           </TooltipTrigger>
  //           <TooltipContent side="top" align="center">
  //             <div className="flex flex-row px-3 py-1 max-w-[240px] text-sm cursor-default">
  //               <AlertTriangle size={16} className="text-sm mr-1"></AlertTriangle>
  //               <span>
  //                 Players can only vote to split pot during the Day, and only after Stage 1.
  //               </span>
  //             </div>
  //           </TooltipContent>
  //         </Tooltip>
  //       </TooltipProvider>
  //     )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        {/* <Button variant="splitPot" className="w-full text-xl">
          Split Pot
          <Split size={16} className="text-sm ml-1"></Split>
        </Button> */}
        <div className="flex justify-center items-center border border-transparent rounded-full px-2 sm:px-3 py-0 sm:py-1 hover:border-zinc-300 hover:bg-zinc-200/50 hover:cursor-pointer">
          <Image
            priority
            src="/logo/token.svg"
            height={32}
            width={32}
            alt="$last token"
            className="shrink-0 inline mr-2"
          />
          <span className="text-lg sm:text-xl font-whitrabt">200</span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
              Buy or Transfer $LAST tokens
              {/* <div className="day-last">
                <span className="font-headline">Day</span> Action (Stage 2 and 3)
              </div> */}
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/TokenImage.png"
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
                    Buy $LAST tokens, or transfer $LAST tokens to another in-game player
                  </p>
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">$LAST tokens held</p>
                      <p className="text-right"> 200 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">$LAST price</p>
                      <p className="text-right"> 3 ETH </p>
                    </div>
                  </div>
                </div>
                {/* 2 columns */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 capitalize flex justify-start text-zinc-500 dark:text-zinc-400">
                      Buy $LAST
                    </div>
                    <a
                      href="https://app.uniswap.org/"
                      target="_blank"
                      rel="noreferrer"
                      className=""
                    >
                      <Button variant="buy" className="w-full bg-blue-950">
                        Buy on Uniswap{' '}
                        <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
                      </Button>
                    </a>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 capitalize flex justify-start text-zinc-500 dark:text-zinc-400">
                      Transfer
                    </div>
                    <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border">
                      <div className="flex md:flex-row flex-col justify-center items-center md:justify-between my-2">
                        <p>Player #</p>

                        <div className="flex gap-1 items-center">
                          <input
                            type="text"
                            name=""
                            id=""
                            className="w-[3rem] rounded-md border px-1 text-center"
                          />
                        </div>
                      </div>
                      <div className="flex md:flex-row flex-col justify-center items-center md:justify-between my-2">
                        <p>Tokens</p>
                        <input
                          type="text"
                          name=""
                          id=""
                          className="w-[3rem] rounded-md border px-1 text-center"
                        />
                      </div>
                      <Button variant="transfer" className="w-full h-8 px-4 mt-2 py-2">
                        Transfer
                      </Button>
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

export default Token
