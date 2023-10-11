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

function SubmitKeyword() {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="submit" className="w-full bg-green-700">
          Submit Keyword
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center">Submit Keyword</DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-4">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <div className="w-[100%] h-[10rem] border-[2px] border-slate-400 justify-center flex items-center">
                  <span>img placeholder</span>
                </div>
                <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Rules</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Tickets can be bought during{' '}
                        <span className="font-headline beginnings-last">Beginnings</span> and{' '}
                        <span className="font-headline beginnings-last">Countdown</span>.
                      </p>
                      <p>Ticket price increases for every subsequent ticket.</p>
                      <p>50% of price paid goes to a pool. 50% remains in the ticket.</p>
                      <p>1 ticket per address.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="w-[100%] h-[6rem] border-[2px] border-slate-400 mx-auto flex justify-center items-center">
                  <HCaptcha
                    sitekey="38e2ff83-f255-4b90-88ff-c65a443e82db"
                    onVerify={(token, ekey) => console.log(token, ekey)}
                    loadAsync={true}
                    tabIndex={0}
                    // onError={onError}
                    // onExpire={onExpire}
                  />
                </div>
                <div className="flex flex-col gap-4 my-10">
                  <p className="text-3xl">Enter keyword for this round</p>
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
                    // onClick={async () => {
                    //   if (otpInput) {
                    //     await onSubmit(otpInput)
                    //     setOtpInput('')
                    //   }
                    // }}
                  >
                    Submit
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

export default SubmitKeyword
