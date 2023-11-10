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

import { useStoreActions, useStoreState } from '../../../store'

function CheckOut() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  if (isDisabled)
    return (
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="checkOut" className="w-full text-xl" disabled>
              Check Out
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <div className="flex flex-row px-3 py-1 max-w-[240px] text-sm cursor-default">
              <AlertTriangle size={16} className="text-sm mr-1"></AlertTriangle>
              <span>Players can only check out during the Day</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="checkOut" className="w-full text-xl">
          Check Out
          {/* <LogOut size={16} className="text-sm ml-1"></LogOut> */}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
              Check out of the Safehouse
              <div className="day-last">
                <span className="font-headline">Day</span> Action
              </div>
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/CheckOutOfSafehouse.png"
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
                      <p>You can check in again after you have checked out.</p>
                      <p>Remember to Submit keyword once checked out. You are back in the game!</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Be sure to check out on or before the check out round.</p>
                  <p className="mb-2">You can check in again after you have checked out.</p>
                  <p className="mb-2">
                    Remember to Submit keyword once checked out. You are back in the game!
                  </p>
                </div>
                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  How long do you have with us?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">Checked in on</p>
                      <p className="text-right"> 5 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Nights bought</p>
                      <p className="text-right"> 3 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left"> Check out day (Checked in + Nights Bought) </p>
                      <p className="text-right"> 8 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Current round</p>
                      <p className="text-right"> 7 </p>
                    </div>
                  </div>

                  <Button variant="checkOut" size="lg" className="w-[100%]">
                    Check Out
                  </Button>
                </div>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckOut
