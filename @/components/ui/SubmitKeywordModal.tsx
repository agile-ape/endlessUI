import React, { useEffect, useState, useRef } from 'react'
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
import Image from 'next/image'
import { AlertTriangle } from 'lucide-react'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SubmitKeywordModalType {
  toggle: () => void
}
const SubmitKeywordModal: React.FC<SubmitKeywordModalType> = ({ toggle }) => {
  const [otpInput, setOtpInput] = React.useState<string>('')
  const excludeSpecialChar = /^[a-zA-Z0-9]+$/

  const modalRef = useRef<HTMLDivElement | null>(null)
  const captchaRef = useRef<HCaptcha>(null)

  const onCaptchaClick = () => {
    if (captchaRef.current) {
      captchaRef.current.execute()
    }
  }

  useOutsideClick(modalRef, () => {
    toggle()
  })

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div
            ref={modalRef}
            className="h-[40rem] md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-[90%] mx-auto bg-white outline-none focus:outline-none overflow-auto text-white"
          >
            <div className="overflow-auto">
              <button className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                <span
                  className="text-white m-1 h-6 w-6 text-2xl outline-none focus:outline-none flex justify-center items-center"
                  onClick={toggle}
                >
                  <Cross1Icon className="text-black" />
                </span>
              </button>
              <div className="items-center pt-10">
                <div className="text-3xl text-center font-normal text-black">
                  Submit the keyword of the day
                  <div className="day-last">
                    <span className="font-headline">Day</span> Action
                  </div>
                </div>
                <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
                  <div className="w-[85%] mx-auto flex flex-col gap-3">
                    <Image
                      priority
                      src="/lore/SubmitKeyword.png"
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
                        size="normal"
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
                        // style={{
                        //   backgroundImage: `url('/ticket/motif.svg')`, // different for true
                        //   backgroundRepeat: 'no-repeat',
                        //   backgroundSize: 'cover',
                        // }}
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
                              // await onSubmit(otpInput)
                              setOtpInput('')
                            }
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
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
