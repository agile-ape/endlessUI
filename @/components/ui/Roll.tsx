import React, { useRef, useState } from 'react'
import type { FC } from 'react'
import dynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog-unblur'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
  useContractEvent,
} from 'wagmi'
import { Button } from './button'
import {
  defaultContractObj,
  tokenContractObj,
  DOCS_URL_safehouse,
  WEBSOCKET_ENDPOINT,
  WAGER_IMG,
  WAGER_MOBILE_IMG,
  CHAIN_ID,
  TOKEN_NAME,
  GAME_ADDRESS,
  LIQUIDITY_POOL,
} from '../../../services/constant'
import Image from 'next/image'
import { toast } from '../shadcn/use-toast'

import { useStoreActions, useStoreState } from '../../../store'
import type { Ticket } from '../../../types/app'

import { useOutsideClick } from '../../../hooks/useOutclideClick'
import {
  LogIn,
  ChevronUp,
  ChevronDown,
  MinusCircle,
  PlusCircle,
  AlertTriangle,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'

const useStore = () => {
  // const ownedTicket = useStoreState((state) => state.ownedTicket)
  const potFlag = useStoreState((state) => state.potFlag)
  const tokenBalance = useStoreState((state) => state.tokenBalance)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  return {
    potFlag,
    tokenBalance,
    updateCompletionModal,
  }
}

type RollType = {
  id?: number
}

const Roll: FC<RollType> = ({ id }) => {
  const { potFlag, tokenBalance, updateCompletionModal } = useStore()

  const ticket = useContractRead({
    ...defaultContractObj,
    functionName: 'idToTicket',
    args: [BigInt(id || 0)],
  })

  let ticketId = ticket?.data?.[0] || 0
  const ticketPlayer = ticket?.data?.[1] || 0
  let ticketIsInPlay = ticket?.data?.[2] || false
  let ticketValue = ticket?.data?.[3] || BigInt(0)
  let ticketPurchasePrice = ticket?.data?.[4] || BigInt(0)
  let ticketRedeemValue = ticket?.data?.[5] || BigInt(0)
  let ticketPotClaimCount = ticket?.data?.[6] || BigInt(0)
  let ticketPassRate = Number(ticket?.data?.[7] || BigInt(0))
  let ticketJoinRound = ticket?.data?.[8] || BigInt(0)
  let ticketExitRound = ticket?.data?.[9] || BigInt(0)

  const valueSavedPerRate = (Number(ticketValue) * ticketPassRate) / 100

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  useContractEvent({
    ...defaultContractObj,
    eventName: 'Roll',
    listener(log) {
      console.log(log)
    },
  })

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'roll',
    args: [BigInt(id || 0)],
  })

  const rollHandler = async () => {
    try {
      updateCompletionModal({
        isOpen: true,
        state: 'roll',
        result: 0,
      })

      const tx = await writeAsync({
        args: [BigInt(id || 0)],
      })

      const waitForTransaction = useWaitForTransaction({
        hash: tx.hash,
      })

      // waitForTransaction.data?.logs.find(log => log. === 'Roll')

      // const receipt = await tx.wait();
      // console.log(hash)

      // const newPassRate = tx.gasPrice;

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'roll',
        result: 0,
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Failed to roll',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger className="flex cursor-default flex-col sm:flex-row px-5 mx-2 sm:mx-0 sm:px-0 sm:justify-start sm:flex-col items-center lg:items-end lg:gap-4 lg:flex-row">
          <Button
            variant="primary"
            className="p-1 h-12 w-11/12 flex mx-auto text-2xl shadow-sm text-[#FCFDC7] bg-[#404833]/80 border-[#FCFDC7]
                      hover:-translate-y-1 hover:brightness-100 hover:bg-opacity-100
                  active:-translate-y-0 active:brightness-200"
            onClick={rollHandler}
            isLoading={isLoading}
            disabled={!ticketIsInPlay || ticketId < potFlag}
          >
            🎲 {tokenBalance > 0 ? 'Roll' : 'No POOH'}
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="center"
          className="bg-slate-700 border border-slate-400/50 px-4 py-2"
        >
          <p className="font-digit text-center text-lg">Reduce pass rate</p>
          {/* buyTicketDelay and feeShare for next time. and canBuyTicket. Everything they need for now is here  */}

          <div className="flex flex-col gap-2 justify-center text-base">
            <p>
              Current rate: <span className="font-digit">{ticketPassRate} %</span>
            </p>
            <p>
              Range post roll: <span className="font-digit">1 - 8 %</span>
            </p>
            <p>
              1% reduction: <span className="font-digit">{valueSavedPerRate} ETH</span>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Roll
