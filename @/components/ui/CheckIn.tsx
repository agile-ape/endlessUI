import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
import { LogIn, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react'
// import { , ChevronDownIcon } from '@radix-ui/react-icons'

import { useStoreActions, useStoreState } from '../../../store'

function CheckIn() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)
  const [amountTicket, setAmountTicket] = React.useState<number>(0)

  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  if (isDisabled)
    return (
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="checkIn" className="w-full text-xl" disabled>
              Check In
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <div className="flex flex-row px-3 py-1 max-w-[240px] text-sm cursor-default">
              <AlertTriangle size={16} className="text-sm mr-1"></AlertTriangle>
              <span>You can only check in during the Day</span>
            </div>
            {/* <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
              This is an instruction lalalalala
            </p>
            <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
              This is an instruction lalalalala
            </p> */}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="checkIn" className="w-full text-xl">
          Check In
          {/* <LogIn size={16} className="text-sm ml-1"></LogIn> */}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
              Check into the Safehouse
              <div className="day-last">
                <span className="font-headline">Day</span> Action
              </div>
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/CheckIntoSafehouse.png"
                  // layout="fill"
                  // objectFit='cover'
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                {/* <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Notes
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Payment in $LAST. Pay before you stay.</p>
                      <p>You can check out anytime once you are checked in.</p>
                      <p>Ticket cannot be forfeited in the Safehouse.</p>
                      <p>But if you overstay, you can be kicked out. Your ticket is forfeited when you are kicked out.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Payment in $LAST.</p>
                  <p className="mb-2">You can check out anytime once you are checked in.</p>
                  <p className="mb-2">Ticket cannot be forfeited in the Safehouse.</p>
                  <p className="mb-2">
                    But if you overstay, you can be kicked out. Your ticket is forfeited when you
                    are kicked out.
                  </p>
                </div>
                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  How long would you be staying?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">$LAST in wallet</p>
                      <p className="text-right"> 33 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">
                        Price per night {'('}in $LAST{')'}
                      </p>
                      <p className="text-right"> 2 </p>
                    </div>
                  </div>

                  {/* Add new add/subtract component. Allow user to max nights based on $LAST in wallet / Price per night */}
                  <div className="flex justify-center">
                    <div className="text-2xl flex justify-between items-center p-2 gap-3">
                      Nights:
                    </div>
                    <div className="text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 rounded-xl flex justify-between items-center p-2 gap-3">
                      <p>{amountTicket}</p>
                      <div className="flex flex-col">
                        <button
                          className="w-[20px] h-[20px] flex justify-center items-center"
                          onClick={() => setAmountTicket(amountTicket + 1)}
                        >
                          <ChevronUp />
                        </button>
                        <button
                          className="w-[20px] h-[20px] flex justify-center items-center"
                          onClick={() => amountTicket > 0 && setAmountTicket(amountTicket - 1)}
                        >
                          <ChevronDown />
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button variant="checkIn" size="lg" className="w-[100%]">
                    Check In
                  </Button>
                </div>

                {/* <div
                    className="
                      m-4 mt-0
                      rounded-xl py-3 px-3

                      capitalize text-center text-white
                      flex flex-col gap-5
                      "
                  >
                  </div> */}
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckIn
