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
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { Button } from './button'
import Image from 'next/image'
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
// import { , ChevronDownIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import Prompt from './Prompt'
import { formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
// import { tokenContractObj } from '../../../services/constant'
import OnSignal from './_OnSignal'
import {
  defaultContractObj,
  tokenContractObj,
  DOCS_URL_safehouse,
  WEBSOCKET_ENDPOINT,
  CHECK_INTO_SAFEHOUSE_IMG,
  CHECK_INTO_SAFEHOUSE_MOBILE_IMG,
  CHAIN_ID,
  TOKEN_NAME,
  GAME_ADDRESS,
  LIQUIDITY_POOL,
} from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'
import { io } from 'socket.io-client'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'

const useStore = () => {
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const potFlag = useStoreState((state) => state.potFlag)
  const tokenBalance = useStoreState((state) => state.tokenBalance)
  const lastMultiplier = useStoreState((state) => state.lastMultiplier)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  return {
    ownedTicket,
    potFlag,
    tokenBalance,
    lastMultiplier,
    updateCompletionModal,
  }
}

const LoadLast = () => {
  const { ownedTicket, potFlag, tokenBalance, lastMultiplier, updateCompletionModal } = useStore()

  const { address, isConnected } = useAccount()

  // initialize state
  const [last, setLast] = React.useState<string>('')

  const totalLast = lastMultiplier * Number(last)

  let ticketId = ownedTicket?.id
  let ticketPlayer = ownedTicket?.player
  let ticketIsInPlay = ownedTicket?.isInPlay
  let ticketValue = ownedTicket?.value || BigInt(0)
  let ticketPurchasePrice = ownedTicket?.purchasePrice
  let ticketRedeemValue = ownedTicket?.redeemValue
  let ticketPotClaimCount = ownedTicket?.potClaimCount
  let ticketPassRate = ownedTicket?.passRate || 0
  let ticketJoinRound = ownedTicket?.joinRound
  let ticketExitRound = ownedTicket?.exitRound
  let ticketLastCount = ownedTicket?.lastCount || 0

  let netPass: number = 0
  if (ticketLastCount >= ticketPassRate) {
    netPass = 0
  } else {
    netPass = ticketPassRate - ticketLastCount
  }

  let estPassValue: number
  estPassValue = (netPass * Number(ticketValue)) / 100

  const formattedEstPassValue = formatNumber(formatUnits(estPassValue || BigInt(0), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'loadLast',
  })

  const loadLastHandler = async () => {
    try {
      const tx = await writeAsync({
        args: [BigInt(ownedTicket?.id || 0), BigInt(last)],
      })
      const hash = tx.hash
      console.log(hash)

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'lastLoaded',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Fail to load last',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const checkInBackupImg = (event: any) => {
    event.target.src = '/lore/CheckIntoSafehouse.png'
  }

  const checkInMobileBackupImg = (event: any) => {
    event.target.src = '/lore/CheckIntoSafehouseMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        <Image
          priority
          src={CHECK_INTO_SAFEHOUSE_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="check-into-safehouse"
          onError={checkInMobileBackupImg}
        />
      </div>

      <Image
        priority
        src={CHECK_INTO_SAFEHOUSE_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="check-into-safehouse"
        onError={checkInBackupImg}
      />

      <div className="capitalize text-center h2-last">1 $LAST reduces pass rate by</div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-3xl text-center border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 shadow-md rounded-xl items-center p-2 gap-3">
          <p className="font-digit">{lastMultiplier}%</p>
        </div>

        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
        >
          <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
            <div className="w-full">
              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">Ticket pass rate this round</p>
                <p className="text-right"> {netPass} %</p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">Est. value passed next round</p>
                <p className="text-right"> 1 ETH++ </p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">{TOKEN_NAME} in wallet</p>
                <p className="text-right">{tokenBalance}</p>
              </div>
            </div>

            <div className="w-full flex flex-col justify-center items-center gap-2">
              <label htmlFor="checkIn" className="text-2xl">
                $LAST loaded:
              </label>
              <div className="flex gap-2 justify-center items-center">
                <button
                  className="flex justify-center items-center"
                  onClick={() => Number(last) > 0 && setLast(String(Number(last) - 1))}
                >
                  <MinusCircle size={28} />
                </button>

                <input
                  type="text"
                  id="checkIn"
                  required
                  className="w-[6rem] font-digit text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl flex justify-between items-center p-2 gap-3"
                  value={last}
                  placeholder="0"
                  onChange={(e) => setLast(e.target.value)}
                />

                <button
                  className="flex justify-center items-center"
                  onClick={() => setLast(String(Number(last) + 1))}
                >
                  <PlusCircle size={28} />
                </button>
              </div>
            </div>
            <div className="digit-last text-2xl">
              {totalLast > Number(tokenBalance) ? (
                <p className="text-center">You don't have enough tokens</p>
              ) : (
                <div className="">
                  <div className="">{totalLast} % of pass rate</div>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={loadLastHandler}
              isLoading={isLoading}
              disabled={!ownedTicket?.isInPlay || ownedTicket?.id < potFlag}
            >
              Load LAST
            </Button>

            <Button variant="secondary" size="lg" className="w-full" disabled={true}>
              <a
                href={LIQUIDITY_POOL}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center"
              >
                Buy $LAST <ExternalLink size={16} className="text-xl ml-2"></ExternalLink>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(LoadLast), { ssr: false })
