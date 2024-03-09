import React, { useRef, useState } from 'react'
import { Button } from './button'
import Image from 'next/image'
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
import {
  defaultContractObj,
  DOCS_URL_buy,
  BUY_TICKET_IMG,
  BUY_TICKET_MOBILE_IMG,
} from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { toast } from '../shadcn/use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

const useStore = () => {
  const buyFlag = useStoreState((state) => state.buyFlag)
  const potFlag = useStoreState((state) => state.potFlag)
  const ticketId = useStoreState((state) => state.ticketId)
  const canBuyTicket = useStoreState((state) => state.canBuyTicket)
  const ticketPrice = useStoreState((state) => state.ticketPrice)
  const buyTicketDelay = useStoreState((state) => state.buyTicketDelay)
  const startingPassRate = useStoreState((state) => state.startingPassRate)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  return {
    buyFlag,
    potFlag,
    ticketId,
    canBuyTicket,
    ticketPrice,
    buyTicketDelay,
    startingPassRate,
    updateCompletionModal,
  }
}

const JoinGame = () => {
  const {
    buyFlag, // build buyDelay?
    potFlag,
    ticketId,
    canBuyTicket,
    ticketPrice,
    buyTicketDelay, // build buyDelay
    startingPassRate,
    updateCompletionModal,
  } = useStore()

  // Retrieve player's ETH balance
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({
    address: address,
  })

  const formattedEthBalance = formatNumber(formatUnits(balanceData?.value || BigInt(0), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  })

  // variables
  const queueToPot = ticketId - potFlag

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'buyTicket',
    value: parseUnits(String(ticketPrice), 18),
  })

  const buyTicketHandler = async () => {
    try {
      const tx = await writeAsync({})
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

      <div className="capitalize text-center h2-last">Current price</div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-3xl text-center border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 shadow-md rounded-xl items-center p-2 gap-3">
          <p className="font-digit">
            {ticketPrice}
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
                {formattedEthBalance}
                ETH
              </p>
            </div>

            <div className="font-digit flex justify-center my-2">Game</div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Next ticket #</p>
              <p className="text-right"> {ticketId + 1} </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Pass rate</p>
              <p className="text-right"> {startingPassRate}% </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Hold pot in _ rounds</p>
              <p className="text-right">{queueToPot}</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={buyTicketHandler}
            isLoading={isLoading}
            disabled={!canBuyTicket}
          >
            Buy Ticket
          </Button>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(JoinGame), { ssr: false })
