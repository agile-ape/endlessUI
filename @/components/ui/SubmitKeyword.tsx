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
import HCaptcha from '@hcaptcha/react-hcaptcha'
import Image from 'next/image'
import { Send } from 'lucide-react'

import { useStoreActions, useStoreState } from '../../../store'
import dynamic from 'next/dynamic'

function SubmitKeyword() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="submit" className="w-full text-2xl">
          Submit <Send size={16} className="text-sm ml-1"></Send>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
              Submit the keyword of the day
              <div className="day-last">
                <span className="font-headline">Day</span> Action
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
                    <AccordionTrigger>Notes</AccordionTrigger>
                    <AccordionContent>
                      <p>Solve the captcha and the word will be revealed.</p>
                      <p>Key in and submit the word to stay safe during the {' '} 
                        <span className="font-headline night-last">Night</span>.
                      </p>
                      <p></p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}

                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Solve the captcha and reveal the word of the day.</p>
                  <p className="mb-2">
                    Submit the word to stay safe during the{' '}
                    <span className="font-headline night-last">Night</span>.
                  </p>
                </div>

                {/* Captcha */}
                <div className="w-[240px] mx-auto flex flex-col justify-center items-center">
                  <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize text-zinc-500 dark:text-zinc-400">
                    Solve Captcha
                  </div>

                  <HCaptcha
                    sitekey="38e2ff83-f255-4b90-88ff-c65a443e82db"
                    onVerify={(token, ekey) => console.log(token, ekey)}
                    loadAsync={true}
                    tabIndex={0}
                    // onError={onError}
                    // onExpire={onExpire}
                  />
                </div>

                <div
                  className="w-[240px] rounded-xl
                   flex flex-col items-center mx-auto mb-4
                    py-2"
                >
                  <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize text-zinc-500 dark:text-zinc-400">
                    Submit
                  </div>
                  <div
                    className="
                      m-4 mt-0
                      rounded-xl py-3 px-3
                      bg-green-700
                      capitalize text-center text-white
                      flex flex-col gap-5
                      "
                  >
                    <p className="text-xl">keyword of the day</p>

                    <OtpInput
                      value={otpInput}
                      onChange={(e: string) => {
                        if (excludeSpecialChar.test(e)) setOtpInput(e)
                      }}
                      numInputs={4}
                      inputStyle={{
                        width: '90%',
                        height: '50px',
                        // color: theme === 'light' ? 'black' : 'white',
                        borderRadius: '12px',
                        margin: '0 auto',
                        fontSize: '36px',
                      }}
                      placeholder="****"
                      className="dark:text-white text-black"
                    />

                    <Button
                      variant="submit"
                      size="lg"
                      // disabled={phase !== 'day'}
                      onClick={async () => {
                        if (otpInput) {
                          await onSubmit(otpInput)
                          setOtpInput('')
                        }
                      }}
                    >
                      Submit
                    </Button>
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

export default dynamic(() => Promise.resolve(SubmitKeyword), {
  ssr: false,
})
