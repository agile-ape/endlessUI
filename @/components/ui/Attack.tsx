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

function Attack() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="attack" className="px-2 py-1 h-8 mt-2 text-md">
          Attack
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
              Inspect the ticket for their keyword
              <div className="night-last">
                <span className="font-headline">Night</span> Action
              </div>
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/AttackPlayer.png"
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
                      <p>If keyword is wrong, his ticket is forfeited.</p>
                      <p>Ticket value goes to player before him - if Ticket #4 is forfeited, ticket #4's value goes to Player #3</p>
                      <p>Each check earns you some $LAST during Normal rounds.</p>
                      <p>Ticket can only be checked once per night.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}

                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Ticket is forfeited if keyword is wrong.</p>
                  <p className="mb-2">
                    Ticket value goes to player before him - if Ticket #4 is forfeited, ticket #4's
                    value goes to Player #3
                  </p>
                  <p className="mb-2">
                    Each check earns you some $LAST{' '}
                    <span className="font-semibold">during Normal rounds</span>.
                  </p>
                  <p className="mb-2">
                    Ticket can only be checked once per{' '}
                    <span className="font-headline night-last">Night</span>.
                  </p>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Check this ticket?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">$LAST per check</p>
                      <p className="text-right"> 3</p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Ticket value</p>
                      <p className="text-right"> 30 ETH</p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Last seen at</p>
                      <p className="text-right underline"> 4 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Last action </p>
                      <p className="text-right"> Entered game </p>
                    </div>
                  </div>

                  <Button variant="attack" size="lg" className="w-[100%]">
                    Check ticket
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

export default Attack
