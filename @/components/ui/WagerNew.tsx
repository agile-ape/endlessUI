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
  const round = useStoreState((state) => state.round)
  const stage = useStoreState((state) => state.stage)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  return {
    phase,
    round,
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
  const { phase, stage, round, updateCompletionModal } = useStore()
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
        functionName: 'endingBetCount',
        args: [4],
      },
      {
        ...wagerContractObj,
        functionName: 'endingBetCount',
        args: [5],
      },
      {
        ...wagerContractObj,
        functionName: 'endingBetCount',
        args: [6],
      },
      {
        ...wagerContractObj,
        functionName: 'endingBetAmount',
        args: [4],
      },
      {
        ...wagerContractObj,
        functionName: 'endingBetAmount',
        args: [5],
      },
      {
        ...wagerContractObj,
        functionName: 'endingBetAmount',
        args: [6],
      },
      {
        ...wagerContractObj,
        functionName: 'endingPhase',
      },
      {
        ...wagerContractObj,
        functionName: 'fee',
      },
      {
        ...wagerContractObj,
        functionName: 'feeMultiplier',
      },
    ],
  })

  const playerBet = Number(data?.[0].result || BigInt(0))
  const playerBetSize = data?.[1].result || BigInt(0)
  const lmfBetCount = data?.[2].result || BigInt(0)
  const pfBetCount = data?.[3].result || BigInt(0)
  const dBetCount = data?.[4].result || BigInt(0)
  const lmfBetSize = Number(data?.[5].result || BigInt(0))
  const pfBetSize = Number(data?.[6].result || BigInt(0))
  const dBetSize = Number(data?.[7].result || BigInt(0))
  const endingPhase = data?.[8].result || BigInt(0)
  const fee = Number(data?.[9].result || BigInt(0))
  const feeMultiplier = Number(data?.[10].result || BigInt(0))

  const nextRoundFee = (round + 1) * feeMultiplier

  // Compute payoff - before or after fees?
  const totalBetSize = lmfBetSize + pfBetSize + dBetSize
  const lmfOdds = totalBetSize / lmfBetSize
  const pfOdds = totalBetSize / pfBetSize
  const dOdds = totalBetSize / dBetSize

  // Contract write
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [betAmount, setBetAmount] = useState<string>('')
  const [radioValue, setRadioValue] = useState<string>('')

  // const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => setIsModalOpen(false))

  /*---------------------- place bet ----------------------*/

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
      const doBetEnding = await betEnding({
        args: [Number(radioValue)],
      })

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

  // function betHandler() {
  //   const radioParam: Record<string, number> = {
  //     'option-one': 4,
  //     'option-two': 5,
  //     'option-three': 6,
  //   }

  //   return radioParam[radioValue]
  // }

  /*---------------------- claim ----------------------*/

  const {
    data: claimWinningsData,
    writeAsync: claimWinnings,
    isLoading: claimWinningsLoad,
  } = useContractWrite({
    ...wagerContractObj,
    functionName: 'claimWinnings',
  })

  const claimWin = async () => {
    try {
      const doClaim = await claimWinnings()

      const hash = doClaim.hash

      // setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'claimWin',
      })
    } catch (error: any) {
      console.log({ error })
      setBetAmount('')
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Claim failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: claimWinningsData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Place Bet</div>
        </div> */}
        <Image
          priority
          src="/lore/WagerMobile.png"
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="check-into-safehouse"
        />
      </div>
      <Image
        priority
        src="/lore/Wager.png"
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="enter-into-the-pepe"
      />

      <div className="text-center">
        <p className="mb-2">Bet on how game ends.</p>
        <p className="mb-2">1 bet per address.</p>
        <p className="mb-2">Bet fee increases each round.</p>
        <p className="mb-2">No more bets once Stage 2 comes.</p>
        <a href={DOCS_URL} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div>
      {/* Pay for stay */}
      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
          gap-4 justify-center items-center h3-last
          "
      >
        <div className="m-1 capitalize text-center h2-last">Feeling lucky?</div>

        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Current bet fee</p>
              <p className="text-right"> {fee}%</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Next round bet fee</p>
              <p className="text-right"> {nextRoundFee}%</p>
            </div>
          </div>
        </div>
        <div className="mx-auto flex flex-col gap-4 justify-center items-center">
          <RadioGroup
            defaultValue="option-one"
            className="flex flex-col gap-4"
            onValueChange={(value) => setRadioValue(value)}
          >
            <div className="flex flex-col items-center border rounded-md border-zinc-300 dark:border-zinc-100 space-x-2">
              {/* <TooltipProvider delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger className="flex flex-col items-center justify-center">
                    <Label
                      htmlFor="option-one"
                      className="my-2 mx-8 cursor-pointer p-2 rounded-md flex flex-col justify-center items-center text-center text-2xl"
                    >
                      <Image
                        priority
                        src="/indicator/lastmanfoundIndicator.svg"
                        height={300}
                        width={100}
                        alt="last-man-found-ending"
                        className="shrink-0 mb-1"
                      />
                      <div>Lastman</div>
                    </Label>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                    <p className="px-3 py-1 max-w-[280px] text-sm cursor-default">
                    Only 1 player is left. Everyone gives up or is killed.
                    </p>
                    </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}

              <Label
                htmlFor="option-one"
                className="my-2 mx-8 cursor-pointer p-2 rounded-md flex flex-col justify-center items-center text-center text-2xl"
              >
                <Image
                  priority
                  src="/indicator/lastmanfoundIndicator.svg"
                  height={300}
                  width={100}
                  alt="last-man-found-ending"
                  className="shrink-0 mb-1"
                />
                <div>Lastman</div>
              </Label>
              <RadioGroupItem value="option-one" id="option-one" />
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(#) </p>
                <p className=""> {Number(lmfBetCount)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Odds </p>
                <p className="">
                  {' '}
                  {formatNumber(lmfOdds, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                  : 1
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center border rounded-md border-zinc-300 dark:border-zinc-100 space-x-2">
              {/* <TooltipProvider delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger className="flex flex-col items-center justify-center">
                    <Label
                      htmlFor="option-two"
                      className="my-2 mx-8 cursor-pointer p-2 rounded-md flex flex-col justify-center items-center text-center text-2xl"
                    >
                      <Image
                        priority
                        src="/indicator/peacefoundIndicator.svg"
                        height={300}
                        width={100}
                        alt="peace-found-ending"
                        className="shrink-0 mb-1"
                      />
                      <div>Peace</div>
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <p className="px-3 py-1 max-w-[280px] text-sm cursor-default">
                      Majority of players that are remaining vote to split pot.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              <Label
                htmlFor="option-two"
                className="my-2 mx-8 cursor-pointer p-2 rounded-md flex flex-col justify-center items-center text-center text-2xl"
              >
                <Image
                  priority
                  src="/indicator/peacefoundIndicator.svg"
                  height={300}
                  width={100}
                  alt="peace-found-ending"
                  className="shrink-0 mb-1"
                />
                <div>Peace</div>
              </Label>
              <RadioGroupItem value="option-two" id="option-two" />
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(#) </p>
                <p className=""> {Number(pfBetCount)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Odds </p>
                <p className="">
                  {' '}
                  {formatNumber(pfOdds, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                  : 1
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center border rounded-md border-zinc-300 dark:border-zinc-100 space-x-2">
              {/* <TooltipProvider delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger className="flex flex-col items-center justify-center">
                    <Label
                      htmlFor="option-three"
                      className="my-2 mx-8 cursor-pointer p-2 rounded-md flex flex-col justify-center items-center text-center text-2xl"
                    >
                      <Image
                        priority
                        src="/indicator/drainIndicator.svg"
                        height={300}
                        width={100}
                        alt="drain-ending"
                        className="shrink-0 mb-1"
                      />
                      <div>Drained</div>
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    <p className="px-3 py-1 max-w-[280px] text-sm cursor-default">
                      Players play till the end without splitting the pot.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              <Label
                htmlFor="option-three"
                className="my-2 mx-8 cursor-pointer p-2 rounded-md flex flex-col justify-center items-center text-center text-2xl"
              >
                <Image
                  priority
                  src="/indicator/drainIndicator.svg"
                  height={300}
                  width={100}
                  alt="drain-ending"
                  className="shrink-0 mb-1"
                />
                <div>Drained</div>
              </Label>
              <RadioGroupItem value="option-three" id="option-three" />
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(#) </p>
                <p className=""> {Number(dBetCount)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Odds </p>
                <p className="">
                  {' '}
                  {formatNumber(dOdds, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                  : 1
                </p>
              </div>
            </div>
          </RadioGroup>
          {/* </div> */}

          {/* Bet amount component */}
          <div
            className="rounded-xl p-3 border border-zinc-300 dark:border-zinc-100 flex flex-col
          gap-4 justify-center items-center h2-last
          "
          >
            <label htmlFor="bet">Bet Amount (ETH) </label>
            <input
              type="text"
              id="bet"
              required
              className="w-[6rem] rounded-md px-1 text-center border border-zinc-500 dark:border-zinc-400 bg-slate-100 dark:bg-slate-700"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />

            <Button
              variant="wager"
              size="lg"
              className="w-[220px] rounded-full"
              onClick={placeBet}
              isLoading={betEndingLoad}
              disabled={!(active && status === 1)}
            >
              Bet
            </Button>

            <div className="whtrabt-last">
              {!(active && status === 1) && <Prompt docLink={DOCS_URL_safehouse} />}
            </div>
          </div>

          {/* Claim */}
          <div className="m-1 capitalize text-center h2-last">Claim your winnings</div>
          {status === 2 && (
            <div
              className="rounded-xl p-3 border border-zinc-300 dark:border-zinc-100 flex flex-col
          gap-4 justify-center items-center h2-last
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

              <Button
                variant="wager"
                size="lg"
                className="w-[220px]"
                onClick={claimWin}
                isLoading={claimWinningsLoad}
              >
                Claim
              </Button>
              <Prompt docLink={DOCS_URL_safehouse} />
            </div>
          )}

          {status !== 2 && <div>It's not time to claim winnings yet</div>}
        </div>
      </div>
    </div>
  )
}
export default dynamic(() => Promise.resolve(WagerNew), { ssr: false })
