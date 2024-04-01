import React, { useRef, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Button } from './button'
import Link from 'next/link'
import { DOCS_URL } from '../../../services/constant'
import Image from 'next/image'
import { useReadContracts, useSendTransaction, useWriteContract } from 'wagmi'
import { defaultContractObj, GAME_ADDRESS } from '../../../services/constant'
import { formatUnits, parseEther } from 'viem'
import { formatNumber } from '@/lib/utils'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { toast } from '@/components/shadcn/use-toast'

function AddToPot() {
  const [value, setValue] = useState('')

  const { data } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
      //   {
      //     ...defaultContractObj,
      //     functionName: 'fundedAmount',
      //   },
    ],
  })

  const canBuyTicket = Boolean(data?.[0].result || false)
  //   const totalFundedAmount = data?.[1].result || BigInt(0)

  //   const formattedFundedAmount = formatNumber(formatUnits(totalFundedAmount, 18), {
  //     maximumFractionDigits: 3,
  //     minimumFractionDigits: 3,
  //   })

  const { isPending, sendTransactionAsync } = useSendTransaction()
  const { isPending: isLoading, writeContract, writeContractAsync } = useWriteContract()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const addToPotHandler = async () => {
    try {
      const tx = sendTransactionAsync({
        to: GAME_ADDRESS,
        value: parseEther(value),
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
    setIsModalOpen(false)
  }

  const claimFundersHandler = async () => {
    try {
      const tx = writeContractAsync({
        ...defaultContractObj,
        functionName: 'fundersClaim',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
    setIsModalOpen(false)
  }

  return (
    <Dialog onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="action" className="w-full px-8 py-2 mt-2">
          {canBuyTicket ? 'Add' : 'Claim'}
        </Button>
      </DialogTrigger>
      <DialogContent ref={modalRef}>
        {canBuyTicket ? (
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <label htmlFor="number" className="text-xl text-center text-gray-300 flex flex-col">
              <span>Add ETH to pot</span>
              <span>Share in 30% of pot when game ends</span>
            </label>
            <div
              className="border-[2px] border-gray-400 \
          bg-slate-700 rounded-xl \
          flex flex-col justify-center items-center"
            >
              <input
                type="text"
                id="number"
                className="w-[200px] bg-transparent font-digit \
            text-center text-4xl text-gray-300 \
            flex justify-between items-center py-2"
                placeholder="0 ETH"
                maxLength={5}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <Button
              className="w-[200px] text-2xl"
              variant="buy"
              onClick={addToPotHandler}
              disabled={!canBuyTicket}
              isLoading={isPending}
            >
              Add
            </Button>
            <div>
              {/* Amount added: <span className="font-digit">{formattedFundedAmount}</span> ETH */}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4">
            <label htmlFor="number" className="text-xl text-center text-gray-300 flex flex-col">
              <span>Claim ETH from pot</span>
              <span>Your share</span>
              <span>40%</span>
            </label>

            <Button
              className="w-[200px] text-2xl"
              variant="buy"
              onClick={claimFundersHandler}
              isLoading={isLoading}
            >
              Claim
            </Button>
            <div>
              {/* Amount added: <span className="font-digit">{formattedFundedAmount}</span> ETH */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddToPot
