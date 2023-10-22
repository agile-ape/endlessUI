import React, { useEffect, useRef } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from './button'
import { Cross1Icon } from '@radix-ui/react-icons'
import dynamic from 'next/dynamic'

interface SubmitKeywordModalType {
  toggle: () => void
}
const SubmitKeywordModal: React.FC<SubmitKeywordModalType> = ({ toggle }) => {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/

  const modalRef = useRef(null)
  const captchaRef = useRef<HCaptcha>(null)
  const handleCloseModal = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      toggle()
    }
  }

  useEffect(() => {
    // Add a click event listener to the overlay to close the modal when clicking outside
    document.addEventListener('click', handleCloseModal)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleCloseModal)
    }
  }, [toggle])

  const onCaptchaClick = () => {
    if (captchaRef.current) {
      captchaRef.current.execute()
    }
  }

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black"
        ref={modalRef}
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[90%] mx-auto bg-zinc-800 outline-none focus:outline-none overflow-auto text-white">
            <div className="flex items-start justify-between p-5 rounded-t">
              <h3 className="text-2xl text-center font-semibold ">Submit Keyword</h3>
              <button className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                <span
                  className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none"
                  onClick={toggle}
                >
                  <Cross1Icon />
                </span>
              </button>
            </div>
            <ScrollArea className="h-[350px] md:h-[600px] rounded-md p-4">
              <div className="w-[85%] mx-auto flex flex-col gap-3">
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
                <div
                  className="w-[100%] border-slate-400 mx-auto flex justify-center items-center"
                  style={{ zIndex: '99999' }}
                >
                  <Button onClick={onCaptchaClick}>Verify Captcha</Button>
                  <HCaptcha
                    sitekey="38e2ff83-f255-4b90-88ff-c65a443e82db"
                    onVerify={(token, ekey) => console.log(token, ekey)}
                    loadAsync={true}
                    tabIndex={0}
                    size="invisible"
                    ref={captchaRef}
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
              </div>
            </ScrollArea>
            {/* <HCaptcha
              sitekey="38e2ff83-f255-4b90-88ff-c65a443e82db"
              onVerify={(token, ekey) => console.log(token, ekey)}
              loadAsync={true}
              tabIndex={0}
              // onError={onError}
              // onExpire={onExpire}
            /> */}
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-4"></div>
    </>
  )
}

export default dynamic(() => Promise.resolve(SubmitKeywordModal), {
  ssr: false,
})
