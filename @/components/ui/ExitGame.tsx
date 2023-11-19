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
import { LogOut, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { defaultContractObj } from '../../../services/constant'

import { useStoreActions, useStoreState } from '../../../store'
import Prompt from './Prompt'

function ExitGame() {
  // const [otpInput, setOtpInput] = React.useState<string>('')
  // const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const giveUpCount = useStoreState((state) => state.giveUpCount)
  const killedCount = useStoreState((state) => state.killedCount)
  const rankShare = useStoreState((state) => state.rankShare)
  const prizeFactor = useStoreState((state) => state.prizeFactor)

  // nextClaim adjusted for phases
  const { data: nextClaim } = useContractRead({
    ...defaultContractObj,
    functionName: 'rankClaim',
    args: [ticketCount],
  })

  let exitRank: number

  if (phase === 'peacefound' || phase === 'drain') {
    exitRank = rankShare
  } else {
    exitRank = ticketCount
  }

  const [isDisabled, setIsDisabled] = React.useState<boolean>(true)

  // if (isDisabled)
  //   return (
  //     <TooltipProvider delayDuration={10}>
  //       <Tooltip>
  //         <TooltipTrigger>
  //           <Button
  //             variant="exit"
  //             className=" rounded-full px-1 py-1 leading-10 h-12 w-full mt-4 text-2xl"
  //             disabled
  //           >
  //             Exit Game
  //           </Button>
  //         </TooltipTrigger>
  //         {/* <TooltipContent side="top" align="center">
  //           <div className="flex flex-row px-3 py-1 max-w-[240px] text-sm cursor-default">
  //             <AlertTriangle size={16} className="text-sm mr-1"></AlertTriangle>
  //             <span>You can only exit duing the DAY</span>
  //           </div>
  //         </TooltipContent>*/}
  //       </Tooltip>
  //     </TooltipProvider>
  //   )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button
          variant="exit"
          className="rounded-full px-5 py-1 leading-10 h-12 w-full mt-4 text-2xl"
        >
          Exit Game and claim {nextClaim} ETH
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
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
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

                {/* <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                        Notes
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Players can claim a pot reward and exit even if their ticket has been forfeited.</p>
                      <p>Psst. Your ticket changes when you exit.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">
                    Players can claim their pot reward and exit anytime in the{' '}
                    <span className="font-headline day-last">DAY</span> (or when game ends).
                  </p>
                  <p>Players can claim even if they are killed.</p>
                  {/* <p className="mb-2">Psst. Your ticket changes when you exit.</p> */}
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Saying Goodbye?
                </div>

                <div className="w-[300px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Exit rank/Exit claim now</p>
                      <p className="text-right">
                        {' '}
                        {exitRank}/{nextClaim} ETH{' '}
                      </p>
                    </div>

                    {/* <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Rank if exit now</p>
                      <p className="text-right">  </p>
                    </div> */}

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Players left</p>
                      <p className="text-right"> {ticketCount} </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Not in play (give up/killed) </p>
                      <p className="text-right">
                        {' '}
                        {ticketCount} ({giveUpCount}/{killedCount})
                      </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Last Man can claim</p>
                      <p className="text-right"> {prizeFactor} ETH </p>
                    </div>
                  </div>
                  {!isDisabled && (
                    <Button variant="exit" size="lg" className="w-[100%]">
                      Exit Game
                    </Button>
                  )}

                  {isDisabled && (
                    <>
                      <Button variant="exit" size="lg" className="w-[100%]" disabled>
                        Exit Game
                      </Button>
                      <Prompt />
                    </>
                  )}
                </div>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExitGame
