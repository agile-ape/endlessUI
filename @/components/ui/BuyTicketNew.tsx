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
import { Button } from './button'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import Prompt from './Prompt'
import { formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import dynamic from 'next/dynamic'

import { statusPayload } from '@/lib/utils'
import { defaultContractObj, DOCS_URL_buy } from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { toast } from './use-toast'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import CustomConnectButton from './connect-button'
import OnSignal from './OnSignal'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const nextTicketPrice = useStoreState((state) => state.nextTicketPrice)

  return {
    phase,
    updateCompletionModal,
    ownedTicket,
    nextTicketPrice,
  }
}

export const BuyTicketActive = () => {
  const { phase, ownedTicket } = useStore()
  const buyTicketActive: boolean = phase === 'start' && !ownedTicket
  return buyTicketActive
}

const BuyTicketNew = () => {
  const { phase, updateCompletionModal, ownedTicket, nextTicketPrice } = useStore()
  const active = BuyTicketActive()

  const { address, isConnected } = useAccount()

  const { data: balanceData } = useBalance({
    address: address,
  })
  const ethBalance = formatUnits(balanceData?.value || BigInt(0), 18)

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'increaseInPrice',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketsAvailableAtCurrentPrice',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketsCounter',
      },
    ],
  })

  const increaseInPrice = data?.[0].result || BigInt(0)
  const ticketsAvailableAtCurrentPrice = Number(data?.[1].result || BigInt(0))
  const ticketsCounter = Number(data?.[2].result || BigInt(0))

  const ticketsLeft = ticketsAvailableAtCurrentPrice - ticketsCounter + 1
  const ticketPrice = nextTicketPrice
  const nextPrice = nextTicketPrice + Number(formatUnits(increaseInPrice, 18))

  const [buddyValue, setBuddyValue] = useState('0')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: buyData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'buyTicket',
    value: parseUnits(String(ticketPrice), 18),
  })

  const buyTicketHandler = async () => {
    try {
      const tx = await writeAsync({
        args: [BigInt(buddyValue)],
      })

      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'afterPurchase',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Buy ticket failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const {} = useWaitForTransaction({
    hash: buyData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  function resetState() {
    setBuddyValue('')
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-20 body-last">
      <div className="sm:hidden block flex flex-col">
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Join game</div>
          <Image
            priority
            src={`/indicator/startIndicator.svg`}
            height={300}
            width={60}
            className=""
            alt="dayIndicator"
          />
        </div>
        <Image
          priority
          src="/lore/InsertCoinMobile.png"
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="insert-coin-to-play"
        />
      </div>

      <Image
        priority
        src="/lore/InsertCoin.png"
        className="hidden sm:blockplace-self-center rounded-xl"
        height={400}
        width={650}
        alt="insert-coin-to-play"
      />

      <div className="text-center">
        <p className="mb-2">Buy a ticket to join.</p>
        <p className="mb-2">
          {/* <span className="font-headline day-last">Day</span> comes = Can no longer join. */}
          Once timer ends, can no longer join.
        </p>
        <p className="mb-2">Entry price increase slowly as more people joins.</p>
        <p className="mb-2">Join with buddy to increase $LAST earn.</p>
        <a href={DOCS_URL_buy} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div>

      {/* Pay for stay */}
      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col 
          gap-4 justify-center items-center h3-last
          "
      >
        <div className="m-1 capitalize text-center h2-last">Join us?</div>

        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div className="">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">ETH in wallet</p>
              <p className="text-right">
                {' '}
                {formatNumber(ethBalance, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}{' '}
                ETH{' '}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Current price</p>
              <p className="text-right"> {ticketPrice} ETH </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">
                <p>Tickets left</p>
                <p>(at current price)</p>
              </p>
              <p className="text-right"> {ticketsLeft} </p>
            </div>

            <div className="grid grid-cols-2 text-lg gap-1">
              <p className="text-left leading-tight">Next price</p>
              <p className="text-right align-middle"> {nextPrice} ETH </p>
            </div>
          </div>

          {/* <div className="flex mt-4 px-4 items-center w-[100%]"> */}
          {/* <div className="w-[100%] rounded-lg flex gap-1 flex flex-col justify-center items-center text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400"> */}
          <div className="flex flex-col justify-center items-center">
            <label htmlFor="buddy">(Optional) Buddy #</label>
            <input
              type="text"
              id="buddy"
              className="w-[6rem] text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 rounded-xl flex justify-between items-center p-2 gap-3"
              placeholder={buddyValue}
              onChange={(e) => setBuddyValue(e.target.value)}
            />
          </div>

          <Button
            disabled={!active}
            variant="enter"
            size="lg"
            className="rounded-full w-[100%]"
            onClick={buyTicketHandler}
            isLoading={isLoading}
          >
            Buy Ticket
          </Button>
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}

export default dynamic(() => Promise.resolve(BuyTicketNew), { ssr: false })
