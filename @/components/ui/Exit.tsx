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
} from 'wagmi'
import { Button } from './button'
import {
  defaultContractObj,
  tokenContractObj,
  DOCS_URL_safehouse,
  WEBSOCKET_ENDPOINT,
  CHECK_INTO_SAFEHOUSE_IMG,
  CHECK_INTO_SAFEHOUSE_MOBILE_IMG,
  CHAIN_ID,
  EXIT_GAME_IMG,
  EXIT_GAME_MOBILE_IMG,
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
import { formatNumber } from '@/lib/utils'
import { formatUnits } from 'viem'

const useStore = () => {
  // const ownedTicket = useStoreState((state) => state.ownedTicket)
  const potFlag = useStoreState((state) => state.potFlag)
  const tokenBalance = useStoreState((state) => state.tokenBalance)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  return {
    //   ownedTicket,
    potFlag,
    tokenBalance,
    updateCompletionModal,
  }
}

type ExitType = {
  id?: number
}

const Exit: FC<ExitType> = ({ id }) => {
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

  let exitTitle: string
  let displayValue: string
  let stillInGame: string

  if (ticketIsInPlay) {
    exitTitle = 'Value'
    displayValue = formatNumber(formatUnits(BigInt(ticketValue), 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })
    stillInGame = 'Yes'
  } else {
    exitTitle = 'Redeemed'
    displayValue = formatNumber(formatUnits(BigInt(ticketRedeemValue), 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })
    stillInGame = 'No'
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'exitGame',
  })

  const exitHandler = async () => {
    try {
      const tx = await writeAsync()
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'exitGame',
        result: 0,
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Exit failed',
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
            onClick={exitHandler}
            isLoading={isLoading}
            disabled={!ticketIsInPlay}
          >
            🚪 {ticketIsInPlay ? 'Exit' : 'Exited'}
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="center"
          className="bg-slate-700 border border-slate-400/50 px-4 py-2"
        >
          <p className="font-digit text-center text-lg">Collect value</p>
          {/* buyTicketDelay and feeShare for next time. and canBuyTicket. Everything they need for now is here  */}

          <div className="flex flex-col gap-2 justify-center text-base">
            <p>
              {exitTitle}: <span className="font-digit">{displayValue}</span> ETH
            </p>
            <p>
              Claimed pot?:{' '}
              <span className="font-digit">
                {' '}
                {ticketIsInPlay && potFlag > ticketId ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Exit
