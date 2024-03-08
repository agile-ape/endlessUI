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
import {
  defaultContractObj,
  DOCS_URL_buy,
  BUY_TICKET_IMG,
  BUY_TICKET_MOBILE_IMG,
} from '../../../services/constant'
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

const JoinGame = () => {
  const { phase, updateCompletionModal, ownedTicket, nextTicketPrice } = useStore()

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

  const buyTicketBackupImg = (event: any) => {
    event.target.src = '/lore/BuyTicket.png'
  }

  const buyTicketMobileBackupImg = (event: any) => {
    event.target.src = '/lore/BuyTicketMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        <Image
          priority
          src={BUY_TICKET_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="insert-coin-to-play"
          onError={buyTicketMobileBackupImg}
        />
      </div>

      <Image
        priority
        src={BUY_TICKET_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="insert-coin-to-play"
        onError={buyTicketBackupImg}
      />

      {/* <div className="text-center">
        <p className="mb-2">Buy a ticket to enter arena.</p>
        <p className="mb-2">
          Enter before timer ends.
        </p>
        <p className="mb-2">Price increase as more enters.</p>
        <p className="mb-2">Join with buddy to get more $LAST.</p>
        <a href={DOCS_URL_buy} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div> */}

      {/* Pay for stay */}

      <div className="capitalize text-center h2-last">Current price</div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-3xl text-center border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 shadow-md rounded-xl items-center p-2 gap-3">
          <p className="font-digit">
            {formatNumber(ticketPrice, {
              maximumFractionDigits: 6,
              minimumFractionDigits: 3,
            })}{' '}
            ETH
          </p>
        </div>

        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
          gap-4 justify-center items-center h3-last
          "
        >
          <div className="w-full">
            <div className="font-digit flex justify-center my-2">Your stats</div>
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
              <p className="text-left">Total tickets bought</p>
              <p className="text-right">
                {' '}
                {formatNumber(ethBalance, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}{' '}
              </p>
            </div>

            <div className="font-digit flex justify-center my-2">Game</div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Tickets till hold pot</p>
              <p className="text-right">
                {' '}
                {formatNumber(ethBalance, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}{' '}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Next ticket #</p>
              <p className="text-right"> {ticketPrice} </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={buyTicketHandler}
            isLoading={isLoading}
            disabled={false}
          >
            {/* TODOS - link to canBuyTicket */}
            Buy Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(JoinGame), { ssr: false })
