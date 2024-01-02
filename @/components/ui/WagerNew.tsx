import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import dynamic from 'next/dynamic'

import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  useContractEvent,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { Button } from './button'
import Image from 'next/image'
import { LogIn, ChevronUp, ChevronDown, AlertTriangle, AlertCircle } from 'lucide-react'
// import { , ChevronDownIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import Prompt from './Prompt'
import { formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
// import { tokenContractObj } from '../../../services/constant'
import OnSignal from './OnSignal'
import {
  defaultContractObj,
  tokenContractObj,
  wagerContractObj,
  DOCS_URL_safehouse,
  DOCS_URL,
  WEBSOCKET_ENDPOINT,
} from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { io } from 'socket.io-client'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const stage = useStoreState((state) => state.stage)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  return {
    phase,
    stage,
    updateCompletionModal,
    ownedTicket,
  }
}

export const WagerActive = () => {
  // Active condition - place bets before stage 2 || claim reward when ending is found
  const { phase, stage } = useStore()

  let wagerActive: boolean
  let wagerStatus: number

  if (stage === 1 && !(phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain')) {
    wagerStatus = 1
  } else if (phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') {
    wagerStatus = 2
  } else {
    wagerStatus = 0
  }

  wagerStatus === 1 || wagerStatus === 2 ? (wagerActive = true) : (wagerActive = false)

  return { wagerActive, wagerStatus }
}

const WagerNew = () => {
  const { phase, stage, updateCompletionModal } = useStore()
  const { wagerActive: active, wagerStatus: status } = WagerActive()
  const { address, isConnected } = useAccount()
  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...wagerContractObj,
        functionName: 'playerBet',
        args: [address as `0x${string}`],
      },
      {
        ...wagerContractObj,
        functionName: 'playerBetSize',
        args: [address as `0x${string}`],
      },
      {
        ...wagerContractObj,
        functionName: 'betCounts',
        args: [4],
      },
      {
        ...wagerContractObj,
        functionName: 'betCounts',
        args: [5],
      },
      {
        ...wagerContractObj,
        functionName: 'betCounts',
        args: [6],
      },
      {
        ...wagerContractObj,
        functionName: 'betSize',
        args: [4],
      },
      {
        ...wagerContractObj,
        functionName: 'betSize',
        args: [5],
      },
      {
        ...wagerContractObj,
        functionName: 'betSize',
        args: [6],
      },
      {
        ...wagerContractObj,
        functionName: 'endingPhase',
      },
    ],
  })

  const playerBet = Number(data?.[0].result || BigInt(0))
  const playerBetSize = data?.[1].result || BigInt(0)
  const lmfBetCount = data?.[2].result || BigInt(0)
  const pfBetCount = data?.[3].result || BigInt(0)
  const dBetCount = data?.[4].result || BigInt(0)
  const lmfBetSize = data?.[5].result || BigInt(0)
  const pfBetSize = data?.[6].result || BigInt(0)
  const dBetSize = data?.[7].result || BigInt(0)
  const endingPhase = data?.[8].result || BigInt(0)

  // Compute payoff - before or after fees?

  // Contract write
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [betAmount, setBetAmount] = useState<string>('')
  const [radioValue, setRadioValue] = useState<string>('')

  // const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: betEndingData,
    writeAsync: betEnding,
    isLoading: betEndingLoad,
  } = useContractWrite({
    ...wagerContractObj,
    functionName: 'bet',
    value: parseUnits(String(betAmount), 18),
  })

  const placeBet = async () => {
    try {
      const doBetEnding = await betEnding()

      const hash = doBetEnding.hash
      setBetAmount('')

      // setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'betMade',
      })
    } catch (error: any) {
      console.log({ error })
      setBetAmount('')
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Bet failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: betEndingData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  function claimHandler() {
    const radioParam: Record<string, number> = {
      'option-one': 4,
      'option-two': 5,
      'option-three': 6,
    }

    const param = radioParam[radioValue]
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-16 body-last">
      <div className="sm:hidden block flex flex-col">
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Place Bet</div>
        </div>
        <Image
          priority
          src="/lore/CheckIntoSafehouseMobile.png"
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="check-into-safehouse"
        />
      </div>
      <Image
        priority
        src="/lore/CheckIntoSafehouse.png"
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="enter-into-the-pepe"
      />

      <div className="text-center">
        <p className="mb-2">Everyone can bet on how the game ends.</p>
        <p className="mb-2">1 address = 1 chance</p>
        <p className="mb-2">Bet fee increases every round.</p>
        <p className="mb-2">Place bets before Stage 2 comes.</p>
        <a href={DOCS_URL} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div>
      {/* Pay for stay */}
      <div className="m-1 capitalize text-center h2-last">Place your bet</div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center">
        <RadioGroup
          defaultValue="option-one"
          className="flex flex-col md:grid md:grid-cols-3 gap-4"
          onValueChange={(value) => setRadioValue(value)}
        >
          <div className="flex flex-col items-center border rounded-md border-zinc-400 dark:border-zinc-200 space-x-2">
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger className="flex flex-col items-center justify-center">
                  <Label
                    htmlFor="option-one"
                    className="my-2 cursor-pointer border p-2 rounded-md flex flex-col justify-center items-center text-center text-base mb-2"
                  >
                    <Image
                      priority
                      src="/indicator/lastmanfoundIndicator.svg"
                      height={300}
                      width={100}
                      alt="last-man-found-ending"
                      className="shrink-0 mb-1"
                    />
                    <div>Last Man Standing</div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <p className="px-3 py-1 max-w-[280px] text-sm cursor-default">
                    Only 1 player is left. Everyone gives up or is killed.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <RadioGroupItem value="option-one" id="option-one" />
            <div>Payoff</div>
          </div>
          <div className="flex flex-col items-center border rounded-md border-zinc-400 dark:border-zinc-200 space-x-2">
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger className="flex flex-col items-center justify-center">
                  <Label
                    htmlFor="option-two"
                    className="my-2 cursor-pointer border p-2 rounded-md flex flex-col justify-center items-center text-center text-base mb-2"
                  >
                    <Image
                      priority
                      src="/indicator/peacefoundIndicator.svg"
                      height={300}
                      width={100}
                      alt="peace-found-ending"
                      className="shrink-0 mb-1"
                    />
                    <div>Peace found.</div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <p className="px-3 py-1 max-w-[280px] text-sm cursor-default">
                    Majority of players that are remaining vote to split pot.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <RadioGroupItem value="option-two" id="option-two" />
            <div>Payoff</div>
          </div>
          <div className="flex flex-col items-center border rounded-md border-zinc-400 dark:border-zinc-200 space-x-2">
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger className="flex flex-col items-center justify-center">
                  <Label
                    htmlFor="option-three"
                    className="my-2 cursor-pointer border p-2 rounded-md flex flex-col justify-center items-center text-center text-base mb-2"
                  >
                    <Image
                      priority
                      src="/indicator/drainIndicator.svg"
                      height={300}
                      width={100}
                      alt="drain-ending"
                      className="shrink-0 mb-1"
                    />
                    <div>Pot drained.</div>
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <p className="px-3 py-1 max-w-[280px] text-sm cursor-default">
                    Players play till the end without splitting the pot.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <RadioGroupItem value="option-three" id="option-three" />
            <div>Payoff</div>
          </div>
        </RadioGroup>
        {/* </div> */}

        {/* Bet amount component */}
        <div
          className="rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col 
          gap-4 justify-center items-center h3-last
          "
        >
          <label htmlFor="bet">Bet Amount (ETH) </label>
          <input
            type="text"
            id="bet"
            required
            className="w-[6rem] rounded-md px-1 text-center border border-zinc-500 dark:border-zinc-400"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />

          <Button
            variant="wager"
            size="lg"
            className="w-[220px]"
            onClick={placeBet}
            isLoading={betEndingLoad}
            disabled={!active && status !== 1}
          >
            Bet
          </Button>
        </div>

        {/* Claim */}
        <div className="m-1 capitalize text-center h2-last">Claim your winnings</div>

        <div
          className="rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col 
          gap-4 justify-center items-center h3-last
          "
        >
          <label htmlFor="bet">You won </label>
          {/* If win. If lose */}

          <div className="text-2xl text-center text-purple-800 dark:text-purple-300 shadow-md border-[2px] border-violet-800 dark:border-violet-300 rounded-xl items-center p-2 gap-3">
            <p>
              {formatNumber(0.1, {
                maximumFractionDigits: 6,
                minimumFractionDigits: 3,
              })}{' '}
              ETH
            </p>
          </div>

          {!(active && status === 1) && (
            <>
              <Button variant="wager" size="lg" className="w-[220px]" disabled>
                Claim
              </Button>
              <Prompt docLink={DOCS_URL_safehouse} />
            </>
          )}
        </div>

        {active && status === 2 && (
          <>
            <Button
              variant="wager"
              size="lg"
              className="w-[220px]"
              onClick={claimHandler}
              isLoading={isLoading}
            >
              Claim
            </Button>
          </>
        )}
        {/* </div> */}
      </div>
    </div>
  )
}
export default dynamic(() => Promise.resolve(WagerNew), { ssr: false })
