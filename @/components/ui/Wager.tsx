import React, { useRef, useState } from 'react'
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
} from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'

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
    ],
  })

  const playerBet = data?.[0].result || BigInt(0)
  const playerBetSize = data?.[1].result || BigInt(0)
  const lmfBetCount = data?.[2].result || BigInt(0)
  const pfBetCount = data?.[3].result || BigInt(0)
  const dBetCount = data?.[4].result || BigInt(0)
  const lmfBetSize = data?.[5].result || BigInt(0)
  const pfBetSize = data?.[6].result || BigInt(0)
  const dBetSize = data?.[7].result || BigInt(0)

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
  const [betAmount, setBetAmount] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  /*

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: checkInData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkIntoSafehouse',
  })

  const checkInHandler = async () => {
    try {
      const tx = await writeAsync({
        args: [BigInt(amountTicket)],
      })
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'checkedIn',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Check into Safehouse failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: checkInData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  // Change in safehouse price
  useContractEvent({
    ...defaultContractObj,
    eventName: 'SafehousePrice',
    listener: (event) => {
      const args = event[0]?.args
      const { price, time } = args
      refetch()
    },
  })

  */

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="wager" className={`w-full text-xl flex justify-start`}>
          <OnSignal active={wagerActive} own={true} />
          {wagerStatus != 2 && <p>Place Bets</p>}
          {wagerStatus === 2 && <p>Claim Wins</p>}
        </Button>
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

                <div className="w-[280px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      {/* Add the 3 bet options */}
                    </div>
                    {/* Bet amount component */}
                    <div className="flex flex-col gap-1 items-center">
                      <label htmlFor="bet">Bet Amount (ETH) </label>
                      <input
                        type="text"
                        id="buddy"
                        className="w-[3rem] border-[2px] border-slate-400 rounded-md px-1 text-center"
                        placeholder={String(betAmount)}
                        onChange={(e) => setBetAmount(e.target.value)}
                      />
                    </div>

                    {wagerActive && wagerStatus === 1 && (
                      <Button
                        variant="wager"
                        size="lg"
                        className="w-[100%]"
                        onClick={wagerInHandler}
                        isLoading={isLoading}
                      >
                        Check In
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

                    {wagerActive && wagerStatus === 2 && (
                      <>
                        <Button
                          variant="claim"
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
                        <Button variant="claim" size="lg" className="w-[100%]" disabled>
                          Claim
                        </Button>
                        <Prompt docLink={DOCS_URL} />
                      </>
                    )}
                  </div>
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
