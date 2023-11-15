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
import { LogOut, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Prompt from './Prompt'

import { useStoreActions, useStoreState } from '../../../store'

function KickOut() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="kickOut" className="w-full py-1 text-lg h-8 rounded-md">
          Kick Out
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Kick overstayers out
              <Image
                priority
                src={`/indicator/nightIndicator.svg`}
                height={300}
                width={60}
                // fill={true}
                // sizes="max-width:150px"
                className=""
                // layout="fixed"
                alt={`nightIndicator`}
              />
              {/* <div className="night-last">
                <span className="font-headline">Night</span> Action
              </div> */}
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/KickOut.png"
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
                      <p>Player ticket is forfeited if they got kicked out.</p>
                      <p>Kick them out if their check out round is this round or less.</p>
                      <p>Ticket value goes to the player before him.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}

                <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">
                    Player can be kicked out and killed once it is the{' '}
                    <span className="font-headline night-last">Night</span> of his check out round.
                  </p>
                  <div className="flex mb-2 border border-zinc-800 dark:border-zinc-200 rounded-lg py-2 px-3">
                    <AlertCircle size={48} className="align-top mr-2"></AlertCircle>
                    Player's value does not go to the kicker/killer. It goes to the player before
                    him - if #4 is killed, all his value goes to #3
                  </div>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Kick him out?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left"> Check out round</p>
                      <p className="text-right"> 8 </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Current round</p>
                      <p className="text-right"> 7 </p>
                    </div>
                  </div>

                  {!isDisabled && (
                    <Button variant="kickOut" size="lg" className="w-[100%]">
                      {/* {IsCurrentRound>=CheckOutDay ? 'Kick out' : 'Not yet'} */}
                      Kick Out
                    </Button>
                  )}

                  {isDisabled && (
                    <>
                      <Button variant="kickOut" size="lg" className="w-[100%]" disabled>
                        Kick Out
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

export default KickOut
