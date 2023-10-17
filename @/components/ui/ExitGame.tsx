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


function ExitGame() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="exit" className="rounded-full px-5 py-1 leading-10 h-12 w-full mt-4 text-2xl">
          Exit Game
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">Claim your pot reward and exit
                  <div className="day-last">
                  <span className="font-headline">Day
                  </span> Action, or when Game Ends
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
                      <p>Players can claim a pot reward and exit even if their ticket has been forfeited.</p>
                      <p>Psst. Your ticket changes when you exit.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Players can claim a pot reward and exit even if their ticket has been forfeited.</p>
                  <p className="mb-2">Psst. Your ticket changes when you exit.</p>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">Saying Goodbye?</div>
                
                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  

                  <Button
                    variant="exit"
                    size="lg"
                    className="w-[100%]"
                  >
                    Exit Game
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

export default ExitGame
