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

function Wager() {
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const stage = useStoreState((state) => state.stage)

  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  // Address read
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

  // Compute payoff - before fees?

  // Active condition - place bets before stage 2 || claim reward when ending is found
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

  // Contract write
  const [isModalOpen, setIsModalOpen] = useState(false)
  /*

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  /*-------------------- BET AMOUNT --------------------*/

  const [betAmount, setBetAmount] = useState<string>('')

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

      setIsModalOpen(false)

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

  const {} = useWaitForTransaction({
    hash: betEndingData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="rounded-xl p-0.5">
          <Button variant="wager" className={`w-full text-xl flex justify-start`}>
            <OnSignal active={wagerActive} own={true} />
            {wagerStatus != 2 && <p>Which Ending?</p>}
            {wagerStatus === 2 && <p>Claim Wins!</p>}
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              {wagerStatus != 2 && <p>Place Your Bets</p>}
              {wagerStatus === 2 && <p>Claim Your Winnings Now</p>}
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <div className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/CheckIntoSafehouse.png"
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                <div className="w-[100%] text-base sm:text-lg md:text-xl text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2 leading-tight">
                    Bet on how the game ends - Last Man Found, Peace Found, or Drain.
                  </p>
                  <p className="mb-2 leading-tight">
                    You can bet even if you are not playing. Bets must be made before Stage 2 comes.
                  </p>
                  <p className="mb-2 leading-tight">
                    Bet fee increases every round - the longer you take to decide, the more you pay
                    in fees.
                  </p>
                  <p className="mb-2 leading-tight">
                    Every address only gets 1 chance to make a bet. Choice cannot be withdrawn or
                    changed once bet is made.
                  </p>
                  <a
                    href={DOCS_URL}
                    target="_blank"
                    className="link text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>
                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Place your bet
                </div>

                <div className="mx-auto flex flex-col gap-4 justify-center items-center">
                  {/* <div className="w-[100%] "> */}
                  {/* <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl"> */}
                  {/* Add the 3 bet options */}
                  <RadioGroup
                    defaultValue="option-one"
                    className="flex flex-col md:grid md:grid-cols-3 gap-4 text-zinc-800 dark:text-zinc-200"
                  >
                    <div className="flex flex-col items-center border rounded-md border-zinc-800 dark:border-zinc-200 space-x-2">
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
                    <div className="flex flex-col items-center  border rounded-md border-zinc-800 dark:border-zinc-200 space-x-2">
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
                    <div className="flex flex-col items-center  border rounded-md border-zinc-800 dark:border-zinc-200 space-x-2">
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
                  <div className="w-[240px] flex flex-col gap-2 items-center text-2xl">
                    <label htmlFor="bet">Bet Amount (ETH) </label>
                    <input
                      type="text"
                      id="bet"
                      required
                      className="w-[6rem] border-[2px] border-slate-400 rounded-md px-1 text-center"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                    />

                    {wagerActive && wagerStatus === 1 && (
                      <Button
                        variant="wager"
                        size="lg"
                        className="w-[100%]"
                        onClick={placeBet}
                        isLoading={betEndingLoad}
                      >
                        Bet
                      </Button>
                    )}

                    {!(wagerActive && wagerStatus === 1) && (
                      <>
                        <Button variant="wager" size="lg" className="w-[100%]" disabled>
                          Bet
                        </Button>
                        <Prompt docLink={DOCS_URL_safehouse} />
                      </>
                    )}
                  </div>

                  {/* Claim */}
                  <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                    Claim your winnings
                  </div>

                  {/* If win. If lose */}

                  {wagerActive && wagerStatus === 2 && (
                    <>
                      <Button
                        variant="wager"
                        size="lg"
                        className="w-[100%]"
                        onClick={claimHandler}
                        isLoading={isLoading}
                      >
                        Claim
                      </Button>
                    </>
                  )}
                  {!(wagerActive && wagerStatus === 2) && (
                    <>
                      <Button variant="wager" size="lg" className="w-[100%]" disabled>
                        Claim
                      </Button>
                      <Prompt docLink={DOCS_URL} />
                    </>
                  )}
                  {/* </div> */}
                </div>
              </div>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Wager
