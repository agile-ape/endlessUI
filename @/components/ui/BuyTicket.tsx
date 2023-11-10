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
import { LogOut } from 'lucide-react'

import { useStoreActions, useStoreState } from '../../../store'

function BuyTicket() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button
          variant="enter"
          className="rounded-full px-1 py-1 leading-10 h-12 w-full mt-4 text-2xl"
        >
          Buy for 0.05 ETH
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
              Buy ticket to enter game
              <div className="beginnings-last">
                <span className="font-headline">Start Game</span> Action
              </div>
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/EnterGame.png"
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
                      <p>Ticket price increases as more tickets are bought.</p>
                      <p>Price is split to wallet (30%), pot(60%), and treasury(10%).</p>
                      <p>Players can no longer join the game once it begins.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Ticket price increases as more tickets are bought.</p>
                  <p className="mb-2">Price is split to wallet, pot and treasury (30,60,10).</p>
                  <p className="mb-2">Players can no longer join the game once it begins.</p>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Join us?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Next ticket price</p>
                      <p className="text-right"> 0.5ETH </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Tickets left at this price </p>
                      <p className="text-right"> 30 </p>
                    </div>
                  </div>

                  <Button variant="enter" size="lg" className="rounded-full w-[100%]">
                    Buy Ticket
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

export default BuyTicket
