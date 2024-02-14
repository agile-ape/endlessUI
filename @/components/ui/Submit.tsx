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
  SUBMIT_KEYWORD_IMG,
  SUBMIT_KEYWORD_MOBILE_IMG,
} from '../../../services/constant'
import { encodeSvg, statusPayload } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import { toast } from './use-toast'
import { encodePacked, toBytes, keccak256, hashMessage } from 'viem'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const ticketStatus = ownedTicket?.status || 0
  const ticketIsInPlay = ownedTicket?.isInPlay || false
  const ticketLastSeen = ownedTicket?.lastSeen || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  return {
    phase,
    round,
    updateCompletionModal,
    ticketIsInPlay,
    ticketLastSeen,
    ticketStatusString,
  }
}

export const SubmitActive = () => {
  const { phase, ticketStatusString, ticketIsInPlay } = useStore()
  const submitActive: boolean =
    phase === 'day' && ticketStatusString !== 'safe' && ticketIsInPlay === true
  return submitActive
}

const Submit = () => {
  const { phase, round, updateCompletionModal, ticketLastSeen, ticketStatusString } = useStore()
  const active = SubmitActive()
  const { data: walletClient } = useWalletClient()
  const [otpInput, setOtpInput] = React.useState<string>('')
  const [svgKeyword, setSvgKeyword] = React.useState<string>('')

  // let ticketStatus = Number(playerTicket?.[3] || BigInt(0))
  // let ticketStatus = ownedTicket?.status || 0
  // const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  // Contract Write

  const excludeSpecialChar = /^[a-zA-Z0-9]+$/

  const captchaRef = useRef<HCaptcha>(null)

  const onCaptchaClick = () => {
    if (captchaRef.current) {
      captchaRef.current.removeCaptcha()
    }
  }

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

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => {
    setIsModalOpen(false)
  })

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

      // toggle()

      // console.log(result)

      setIsModalOpen(false)

      updateCompletionModal({
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

  const submitBackupImg = (event: any) => {
    event.target.src = '/lore/SubmitKeyword.png'
  }

  const submitMobileBackupImg = (event: any) => {
    event.target.src = '/lore/SubmitKeywordMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Submit keyword</div>
          <Image
            priority
            src={`/indicator/dayIndicator.svg`}
            height={300}
            width={60}
            className=""
            alt="dayIndicator"
          />
        </div> */}
        <Image
          priority
          src={SUBMIT_KEYWORD_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="submit-keyword"
          onError={submitMobileBackupImg}
        />
      </div>

      <Image
        priority
        src={SUBMIT_KEYWORD_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="submit-keyword"
        onError={submitBackupImg}
      />

      <div className="text-center">
        <p className="mb-2">Solve captcha to reveal word.</p>
        <p className="mb-2">Submit word for Pepe Protection.</p>
        <p className="mb-2">So others can't kill you in the night.</p>
        <a href={DOCS_URL_submit} target="_blank" className="h6-last align-top">
          Learn more
        </a>
      </div>

      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
      >
        <div className="m-1 capitalize text-center h2-last">Fight On?</div>

        <div className="mx-auto flex flex-col justify-center items-center">
          {phase === 'day' ? (
            <>
              <div className="text-center h3-last">Solve Captcha</div>
              <HCaptcha
                sitekey={HCAPCTCHA_KEY}
                onVerify={(token, ekey) => verifyCaptcha(token)}
                tabIndex={0}
                size="normal"
                id={crypto.randomUUID()}
                // onError={onError}
                // onExpire={onExpire}
              />
            </>
          ) : (
            <>
              <div className="text-center digit-last">Not time to submit</div>
            </>
          )}
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
          className="w-[220px] mx-auto rounded-xl p-3 border border-zinc-400 dark:border-zinc-200
          flex flex-col gap-4 m-4 mb-0 text-white bg-green-700 capitalize text-center
          "
        >
          <div className="text-white h2-last">
            {ticketStatusString === 'submitted' && ticketLastSeen === round ? (
              <span>You have submitted. Submit again?</span>
            ) : (
              <span>Submit keyword</span>
            )}
          </div>

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
            className="dark:text-white text-black font-digit"
          />

          <Button
            variant="submit"
            size="lg"
            onClick={() => submitKeyword(otpInput)}
            isLoading={isLoading}
            disabled={!active || !svgKeyword}
            style={{
              backgroundImage: `url(/ticket/motif.svg)`,
            }}
            className="opacity-100 text-green-950 hover:text-green-50"
          >
            Submit
          </Button>
        </div>
        <div className="digit-last">
          {ticketStatusString === 'safe' ? <>In Safehouse</> : <Prompt docLink={DOCS_URL_submit} />}
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Submit), { ssr: false })
