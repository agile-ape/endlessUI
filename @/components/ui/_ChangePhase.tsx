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


function ChangePhase() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="change" size="lg" className="w-full mt-4 text-xl">
          Change Phase 
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">Change Day to Night, Night to Day, and more
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
                      <p>Anyone can change the current phase once the countdown time has completed.</p>
                      <p>The phase will not change unless a player changes it.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Any player can change the current phase once the countdown time has elapsed.</p>
                  <p className="mb-2">The phase will not change unless a player changes it.</p>
                </div>
                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">Change Phase?</div>
                
                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">


                  <Button
                    variant="change"
                    size="lg"
                    className="w-[100%]"
                  >
                    {/* {IsCurrentRound>=CheckOutDay ? 'Kick out' : 'Not yet'} */}
                    
                    Change Phase
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

export default ChangePhase
