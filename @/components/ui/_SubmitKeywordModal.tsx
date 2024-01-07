import React, { useEffect, useState, useRef } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import { Button } from './button'
import { Cross1Icon } from '@radix-ui/react-icons'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import Prompt from './Prompt'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import {
  API_ENDPOINT,
  defaultContractObj,
  DOCS_URL_submit,
  HCAPCTCHA_KEY,
} from '../../../services/constant'
import { encodeSvg, statusPayload } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import { toast } from './use-toast'
import { encodePacked, toBytes, keccak256, hashMessage } from 'viem'

interface SubmitKeywordModalType {
  toggle: () => void
  active: boolean
  playerTicket: any
}
const SubmitKeywordModal: React.FC<SubmitKeywordModalType> = ({ toggle, active, playerTicket }) => {
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  // Address read
  const { data: walletClient } = useWalletClient()

  // let ticketStatus = Number(playerTicket?.[3] || BigInt(0))
  let ticketStatus = ownedTicket?.status || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  // Contract Write
  const [otpInput, setOtpInput] = React.useState<string>('')
  const [svgKeyword, setSvgKeyword] = React.useState<string>('')

  const excludeSpecialChar = /^[a-zA-Z0-9]+$/

  const modalRef = useRef<HTMLDivElement | null>(null)
  const captchaRef = useRef<HCaptcha>(null)

  const onCaptchaClick = () => {
    if (captchaRef.current) {
      captchaRef.current.removeCaptcha()
    }
  }

  useOutsideClick(modalRef, () => {
    toggle()
  })

  const verifyCaptcha = async (token: string) => {
    const data = await fetch('/api/captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    })
    const res = await data.json()

    if (res?.message === 'success') {
      try {
        const fetchKeyword = await fetch(`${API_ENDPOINT}/keywords`)
        const svgResult = await fetchKeyword.text()

        setSvgKeyword(svgResult)

        console.log({ svgResult })
      } catch (error) {
        console.log({ error })
        setSvgKeyword('')
      }
    }
    console.log({ res })
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data: submitData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'submit',
  })

  async function verifyKeyword(input: string) {
    try {
      const data = await fetch(`${API_ENDPOINT}/keywords/verify`, {
        method: 'POST',
        body: JSON.stringify({
          keyword: input,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const res = await data.json()

      return res
    } catch (error) {
      console.log({ error })
    }
  }

  const submitKeyword = async (input: string) => {
    try {
      if (!input) return

      const verifyResult = await verifyKeyword(input)
      if (verifyResult?.error) {
        toast({
          variant: 'destructive',
          title: 'Invalid keyword',
          description: <p className="text-base">Keyword does not match.</p>,
        })

        return
      }

      const hashedMessage = keccak256(encodePacked(['string'], [input.toLowerCase()]))
      // console.log(hashedMessage)

      const signature = await walletClient?.signMessage({
        message: { raw: hashedMessage },
      })
      const result = await writeAsync({
        args: [signature as `0x${string}`],
      })

      // console.log({ hashedMessage, signature, result })
      // toast({
      //   title: 'Check in success!',
      //   description: <p className="text-base">You have successfully checked in.</p>,
      // })

      toggle()

      // console.log(result)

      setIsModalOpen(false)

      triggerCompletionModal({
        isOpen: true,
        state: 'submitted',
      })
    } catch (error: any) {
      console.log({ error: error?.cause })
      // @ts-ignore
      const errorMsg = error?.cause?.reason || error?.cause?.shortMessage || error?.message
      toast({
        variant: 'destructive',
        title: 'Submit keyword failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div
            ref={modalRef}
            className="h-[40rem] md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-[90%] mx-auto bg-slate-200 dark:bg-slate-800 outline-none focus:outline-none overflow-auto text-white"
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
                <div className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
                  <div className="text-black dark:text-white">Submit keyword of the day</div>
                  <Image
                    priority
                    src={`/indicator/dayIndicator.svg`}
                    height={300}
                    width={60}
                    // fill={true}
                    // sizes="max-width:150px"
                    className=""
                    // layout="fixed"
                    alt={`dayIndicator`}
                  />
                  {/* <div className="day-last">
                    <span className="font-headline">Day</span> Action
                  </div> */}
                </div>
                <ScrollArea className="h-[450px] md:h-[650px] rounded-md p-2">
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

                    {/* <div className="w-[220px] md:w-[320px] mx-auto flex flex-col gap-4 justify-center items-center mb-4"> */}
                    <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                      <p className="mb-2">Solve captcha to reveal keyword of the day.</p>
                      <p className="mb-2">
                        Submit keyword in the <span className="font-headline day-last">Day</span> to
                        stay safe when <span className="font-headline night-last">Night</span>{' '}
                        comes.
                      </p>
                      <a
                        href={DOCS_URL_submit}
                        target="_blank"
                        className="link text-xs sm:text-sm md:text-base leading-tight"
                      >
                        Learn more
                      </a>
                    </div>

                    {/* Captcha */}
                    <div className="mx-auto flex flex-col justify-center items-center">
                      <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize text-zinc-500 dark:text-zinc-400">
                        Solve Captcha
                      </div>

                      <HCaptcha
                        // sitekey="38e2ff83-f255-4b90-88ff-c65a443e82db"
                        sitekey={HCAPCTCHA_KEY}
                        onVerify={(token, ekey) => verifyCaptcha(token)}
                        tabIndex={0}
                        size="normal"
                        id={crypto.randomUUID()}
                        // onError={onError}
                        // onExpire={onExpire}
                      />
                    </div>

                    {svgKeyword && (
                      <div className="flex justify-center">
                        <Image
                          alt="keyword that will be used to submit"
                          src={encodeSvg(svgKeyword)}
                          height={200}
                          width={300}
                        />
                      </div>
                    )}

                    <div
                      className="w-[240px] rounded-xl
                    flex flex-col items-center mx-auto mb-4
                      py-2"
                    >
                      <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize text-center text-zinc-500 dark:text-zinc-400">
                        {ticketStatusString === 'submitted' && (
                          <span>You have already submitted. Submit again?</span>
                        )}
                        {ticketStatusString !== 'submitted' && <span>Submit keyword</span>}
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
                          onClick={() => submitKeyword(otpInput)}
                          disabled={(!active && ticketStatusString !== 'safe') || !svgKeyword}
                          // disabled={!active && ticketStatusString !== 'safe'}
                        >
                          Submit
                        </Button>

                        {!active && ticketStatusString === 'safe' && (
                          <Button variant="submit" size="lg" className="w-[100%]" disabled>
                            In Safehouse
                          </Button>
                        )}
                      </div>

                      {!active && <Prompt docLink={DOCS_URL_submit} />}
                    </div>
                    {/* </div> */}
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
