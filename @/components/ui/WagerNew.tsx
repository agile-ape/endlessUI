import { cn } from '@/lib/utils'
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
  useBalance,
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
  WAGER_IMG,
  WAGER_MOBILE_IMG,
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
    ],
  })

  const playerBet = Number(data?.[0].result || BigInt(0))
  const playerBetSize = Number(data?.[1].result || BigInt(0))

  return {
    phase,
    round,
    stage,
    updateCompletionModal,
    ownedTicket,
    playerBet,
    playerBetSize,
  }
}

export const WagerActive = () => {
  // Active condition - place bets before stage 2 || claim reward when ending is found
  const { phase, stage, playerBet } = useStore()

  let wagerActive: boolean
  let wagerStatus: number

  if (
    (stage === 0 || stage === 1) &&
    !(phase === 'lastmanfound' || phase === 'peacefound' || phase === 'drain') &&
    playerBet === 0
  ) {
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
        functionName: 'feeMultiplier',
      },
    ],
  })

  const playerBet = Number(data?.[0].result || BigInt(0))
  const playerBetSize = Number(data?.[1].result || BigInt(0))
  const lmfBetCount = data?.[2].result || BigInt(0)
  const pfBetCount = data?.[3].result || BigInt(0)
  const dBetCount = data?.[4].result || BigInt(0)
  const lmfBetSize = data?.[5].result || BigInt(0)
  const pfBetSize = data?.[6].result || BigInt(0)
  const dBetSize = data?.[7].result || BigInt(0)
  const endingPhase = data?.[8].result || BigInt(0)
  const feeMultiplier = Number(data?.[9].result || BigInt(0))

  const nextRoundFee = (round + 1) * feeMultiplier

  // Compute payoff - before or after fees?
  const totalBetSize = Number(lmfBetSize) + Number(pfBetSize) + Number(dBetSize)
  const lmfOdds = totalBetSize / Number(lmfBetSize)
  const pfOdds = totalBetSize / Number(pfBetSize)
  const dOdds = totalBetSize / Number(dBetSize)

  // Contract write
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const [betAmount, setBetAmount] = useState<string>('')
  const [radioValue, setRadioValue] = useState<string>('')

  // const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => setIsModalOpen(false))

  let fee: number = 0

  if (round === 0) {
    fee = 1
  } else if (round > 0 && stage === 1) {
    fee = feeMultiplier * round
  }

  let playerEnding: string = ''
  let playerEndingIndicator: string = ''
  let playerPayoffRatio: number = 0
  if (playerBet === 4) {
    playerEnding = 'Lastman'
    playerEndingIndicator = 'lastmanfoundIndicator'
    playerPayoffRatio = lmfOdds
  } else if (playerBet === 5) {
    playerEnding = 'Peace'
    playerEndingIndicator = 'peacefoundIndicator'
    playerPayoffRatio = pfOdds
  } else if (playerBet === 6) {
    playerEnding = 'Drained'
    playerEndingIndicator = 'drainIndicator'
    playerPayoffRatio = dOdds
  }

  const playerPayoff = formatUnits(BigInt(playerBetSize * playerPayoffRatio), 18)

  /*---------------------- place bet ----------------------*/
  const { data: balanceData, refetch: refetchETH } = useBalance({
    address: address,
  })

  const ethBalance = formatUnits(balanceData?.value || BigInt(0), 18)
  const playerSize = formatUnits(BigInt(playerBetSize), 18)
  const lmfPot = formatUnits(lmfBetSize, 18)
  const pfPot = formatUnits(pfBetSize, 18)
  const dPot = formatUnits(dBetSize, 18)

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

  const wagerBackupImg = (event: any) => {
    event.target.src = '/lore/Wager.png'
  }

  const wagerMobileBackupImg = (event: any) => {
    event.target.src = '/lore/WagerMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Place Bet</div>
        </div> */}
        <Image
          priority
          src={WAGER_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="wager-pepe"
          onError={wagerMobileBackupImg}
        />
      </div>
      <Image
        priority
        src={WAGER_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="wager-pepe"
        onError={wagerBackupImg}
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

        <div className="mx-auto flex flex-col gap-4 text-lg justify-center items-center">
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
            // defaultValue="option-one"
            className="flex flex-col gap-4"
            onValueChange={(value) => setRadioValue(value)}
          >
            <div
              className={cn(
                radioValue === '4' ? 'bg-[#FCFDC7]/50 dark:bg-[#404833]/50' : '',
                'flex flex-col items-center border rounded-md border-zinc-300 dark:border-zinc-100 space-x-2',
              )}
            >
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
              <RadioGroupItem value="4" id="option-one" />
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(ETH) </p>
                <p className=""> {Number(lmfPot)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(#) </p>
                <p className=""> {Number(lmfBetCount)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Payoff</p>
                <p className="">
                  {' '}
                  {formatNumber(lmfOdds, {
                    maximumFractionDigits: 4,
                    minimumFractionDigits: 3,
                  })}
                </p>
              </div>
            </div>

            <div
              className={cn(
                radioValue === '5' ? 'bg-[#FCFDC7]/50 dark:bg-[#404833]/50' : '',
                'flex flex-col items-center border rounded-md border-zinc-300 dark:border-zinc-100 space-x-2',
              )}
            >
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
              <RadioGroupItem value="5" id="option-two" />
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(ETH) </p>
                <p className=""> {Number(pfPot)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(#) </p>
                <p className=""> {Number(pfBetCount)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Payoff </p>
                <p className="">
                  {' '}
                  {formatNumber(pfOdds, {
                    maximumFractionDigits: 4,
                    minimumFractionDigits: 3,
                  })}
                </p>
              </div>
            </div>

            <div
              className={cn(
                radioValue === '6' ? 'bg-[#FCFDC7]/50 dark:bg-[#404833]/50' : '',
                'flex flex-col items-center border rounded-md border-zinc-300 dark:border-zinc-100 space-x-2',
              )}
            >
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
              <RadioGroupItem value="6" id="option-three" />
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(ETH) </p>
                <p className=""> {Number(dPot)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Bets(#) </p>
                <p className=""> {Number(dBetCount)}</p>
              </div>
              <div className="w-[100%] flex justify-between gap-1 h3-last px-2">
                <p className="">Payoff </p>
                <p className="">
                  {' '}
                  {formatNumber(dOdds, {
                    maximumFractionDigits: 4,
                    minimumFractionDigits: 3,
                  })}
                </p>
              </div>
            </div>
          </RadioGroup>
          {/* </div> */}

          {/* Your bet */}
          {playerBet === 0 ? (
            <div
              className="rounded-xl p-3 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 flex flex-col
          gap-4 justify-center items-center h2-last
          "
            >
              <label htmlFor="bet">Bet Amount (ETH) </label>

              <div className="mx-auto flex flex-col gap-4 text-xl justify-center items-center">
                <div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-left">ETH in wallet</p>
                    <p className="text-right">
                      {' '}
                      {formatNumber(ethBalance, {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 0,
                      })}{' '}
                      ETH{' '}
                    </p>
                  </div>
                </div>
              </div>

              <input
                type="text"
                id="bet"
                required
                className="w-[12rem] font-digit text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl flex justify-between items-center p-2 gap-3"
                value={betAmount}
                placeholder="0.00"
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

              <div className="digit-last">
                {!(active && status === 1) && <Prompt docLink={DOCS_URL_safehouse} />}
              </div>
            </div>
          ) : (
            <>
              <div
                className="rounded-xl p-3 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 flex flex-col
                gap-4 justify-center items-center h2-last
                "
              >
                <div className="capitalize text-center h2-last">Your Bet</div>
                <div className="mx-auto flex flex-col gap-2 text-2xl justify-center items-center">
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-1">
                      <p className="text-left flex items-center">Bet Ending</p>
                      <div className="text-right flex flex-col justify-center items-center">
                        <Image
                          priority
                          src={`/indicator/${playerEndingIndicator}.svg`}
                          height={300}
                          width={100}
                          alt="last-man-found-ending"
                          className="shrink-0 mb-1"
                        />
                        {playerEnding}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      <p className="text-left">Bet Size</p>
                      <p className="text-right">
                        {formatNumber(playerSize, {
                          maximumFractionDigits: 5,
                          minimumFractionDigits: 0,
                        })}{' '}
                        ETH
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <p className="text-left">Payout if win</p>
                      <p className="text-right">
                        {formatNumber(playerPayoff, {
                          maximumFractionDigits: 5,
                          minimumFractionDigits: 0,
                        })}{' '}
                        ETH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

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

          {status !== 2 && <div className="digit-last">It's not time to claim winnings</div>}
        </div>
      </div>
    </div>
  )
}
export default dynamic(() => Promise.resolve(WagerNew), { ssr: false })
