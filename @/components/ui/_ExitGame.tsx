import React, { useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import { Button } from './button'
import Image from 'next/image'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useSignMessage,
  useWalletClient,
  useWaitForTransaction,
} from 'wagmi'
import {
  defaultContractObj,
  DOCS_URL_exit,
  EXIT_GAME_IMG,
  EXIT_GAME_MOBILE_IMG,
} from '../../../services/constant'
import { formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import { toast } from '../shadcn/use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits } from 'viem'

const useStore = () => {
  const potFlag = useStoreState((state) => state.potFlag)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  return {
    potFlag,
    ownedTicket,
    updateCompletionModal,
  }
}

const ExitGame = () => {
  const { potFlag, ownedTicket, updateCompletionModal } = useStore()

  const { address, isConnected } = useAccount()

  let ticketId = ownedTicket?.id || BigInt(0)
  let ticketPlayer = ownedTicket?.player
  let ticketIsInPlay = ownedTicket?.isInPlay
  let ticketValue = ownedTicket?.value || BigInt(0)
  let ticketPurchasePrice = ownedTicket?.purchasePrice
  let ticketRedeemValue = ownedTicket?.redeemValue || BigInt(0)
  let ticketPotClaimCount = ownedTicket?.potClaimCount
  let ticketPassRate = ownedTicket?.passRate || 0
  let ticketJoinRound = ownedTicket?.joinRound
  let ticketExitRound = ownedTicket?.exitRound
  let ticketLastCount = ownedTicket?.lastCount || 0

  let exitTitle: string
  let displayValue: string
  let stillInGame: string

  if (ticketIsInPlay) {
    exitTitle = 'Ticket value'
    displayValue = formatNumber(formatUnits(BigInt(ticketValue), 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })
    stillInGame = 'Yes'
  } else {
    exitTitle = 'Value redeemed'
    displayValue = formatNumber(formatUnits(BigInt(ticketRedeemValue), 18), {
      maximumFractionDigits: 3,
      minimumFractionDigits: 3,
    })
    stillInGame = 'No'
  }

  // Contract write
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'exitGame',
  })

  const exitGameHandler = async () => {
    try {
      const tx = await writeAsync()
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'exitGame',
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

  const exitGameBackupImg = (event: any) => {
    event.target.src = '/lore/ExitGame.png'
  }

  const exitGameMobileBackupImg = (event: any) => {
    event.target.src = '/lore/ExitGameMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        <Image
          priority
          src={EXIT_GAME_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="exit-game"
          onError={exitGameMobileBackupImg}
        />
      </div>
      <Image
        priority
        src={EXIT_GAME_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="exit-game"
        onError={exitGameBackupImg}
      />

      <div className="capitalize text-center h2-last">{exitTitle}</div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-3xl text-center border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 shadow-md rounded-xl items-center p-2 gap-3">
          <p className="font-digit">{displayValue}</p>
        </div>
        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
        >
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Still in game?</p>
              <p className="text-right"> {stillInGame}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Claimed pot?</p>
              <p className="text-right">{ticketIsInPlay && potFlag > ticketId ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            isLoading={isLoading}
            onClick={exitGameHandler}
            className="w-ful"
            disabled={!ownedTicket?.isInPlay}
          >
            Claim ticket
          </Button>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ExitGame), { ssr: false })
