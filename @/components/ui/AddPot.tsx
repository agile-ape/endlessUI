import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  useSignMessage,
  useSendTransaction,
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

import { formatNumber } from '@/lib/utils'
import { formatUnits, parseUnits } from 'viem'

import { useStoreActions, useStoreState } from '../../../store'
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
import { toast } from '../shadcn/use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

const useStore = () => {
  const currentPot = useStoreState((state) => state.currentPot)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const potFlag = useStoreState((state) => state.potFlag)
  const tokenBalance = useStoreState((state) => state.tokenBalance)
  const lastMultiplier = useStoreState((state) => state.lastMultiplier)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  return {
    currentPot,
    ownedTicket,
    potFlag,
    tokenBalance,
    lastMultiplier,
    updateCompletionModal,
  }
}

const AddPot = () => {
  const { ownedTicket, potFlag, tokenBalance, lastMultiplier, updateCompletionModal } = useStore()

  const { address, isConnected } = useAccount()

  // initialize state
  const [addAmt, setAddAmt] = React.useState<string>('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { sendTransactionAsync, isLoading } = useSendTransaction()

  const addToPotHandler = async () => {
    try {
      const tx = await sendTransactionAsync({
        to: GAME_ADDRESS,
        value: parseUnits(String(addAmt), 18),
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

      <div className="capitalize text-center h2-last">1 $LAST for </div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-3xl text-center border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 shadow-md rounded-xl items-center p-2 gap-3">
          <p className="font-digit">0.0002 ETH </p>
        </div>

        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
        >
          <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
            <div className="w-full">
              <div className="capitalize text-center h2-last font-digit">You have</div>
              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">ETH in wallet</p>
                <p className="text-right">
                  <span className="font-digit">{tokenBalance}</span>
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">{TOKEN_NAME} in wallet</p>
                <p className="text-right">
                  <span className="font-digit">{tokenBalance}</span>
                </p>
              </div>

              <div className="capitalize text-center h2-last mt-4 font-digit">Current sale</div>

              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">$LAST available for sale</p>
                <p className="text-right">
                  {' '}
                  <span className="font-digit">6</span>m{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">Circulating supply</p>
                <p className="text-right">
                  {' '}
                  <span className="font-digit">60</span>m{' '}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <p className="col-span-2 text-left">$LAST valuation at price </p>
                <p className="text-right">
                  {' '}
                  <span className="font-digit">3000</span> ETH{' '}
                </p>
              </div>
            </div>

            <div className="w-full flex flex-col justify-center items-center gap-2">
              <label htmlFor="addToPot" className="text-2xl">
                Add ETH Get $LAST:
              </label>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="text"
                  id="addToPot"
                  required
                  className="w-[12rem] font-digit text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl flex justify-between items-center p-2 gap-3"
                  value={addAmt}
                  placeholder="0"
                  onChange={(e) => setAddAmt(e.target.value)}
                />
                <span>ETH</span>
              </div>
            </div>
            <div className="digit-last text-2xl">
              {parseUnits(String(addAmt), 18) > Number(tokenBalance) ? (
                <p className="text-center">You don't have enough tokens</p>
              ) : (
                <></>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={addToPotHandler}
              isLoading={isLoading}
            >
              Add to pot
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(AddPot), { ssr: false })
