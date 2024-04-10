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
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { DOCS_URL } from '../../../services/constant'
import Image from 'next/image'
import {
  useAccount,
  useReadContracts,
  useSendTransaction,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'
import { defaultContractObj, BLOCK_EXPLORER, GAME_ADDRESS } from '../../../services/constant'
import { formatUnits, parseEther } from 'viem'
import { formatNumber } from '@/lib/utils'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { toast } from '@/components/shadcn/use-toast'
import { useStoreActions, useStoreState } from '../../../store'

function AddToPot() {
  const { address, isConnected } = useAccount()

  const [value, setValue] = useState('')
  /* read contract 
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
      {
        ...defaultContractObj,
        functionName: 'fundedAmount',
      },
      {
        ...defaultContractObj,
        functionName: 'fundersToAmt',
        args: [address as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'fundersShare',
      },
      {
        ...defaultContractObj,
        functionName: 'fundersPot',
      },
      {
        ...defaultContractObj,
        functionName: 'fundersClaimed',
        args: [address as `0x${string}`],
      },
    ],
  })

  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'PotAdded',
    onLogs() {
      refetch()
    },
    poll: true,
  })

  const canBuyTicket = Boolean(data?.[0].result || false)
  const fundedAmount = data?.[1].result || false
  const fundersToAmt = data?.[2].result || false
  const fundersShare = Number(data?.[3].result || false)
  const fundersPot = data?.[4].result || false
  const fundersClaimed = Boolean(data?.[5].result || false)

  const totalFunded = formatNumber(formatUnits(BigInt(fundedAmount), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const playerContribution = formatNumber(formatUnits(BigInt(fundersToAmt), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const potToShare = formatNumber(formatUnits(BigInt(fundersPot), 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })
  */

  const canBuyTicket = useStoreState((state) => state.canBuyTicket)
  const fundedAmount = useStoreState((state) => state.fundedAmount)
  const fundersToAmt = useStoreState((state) => state.fundersToAmt)
  const fundersPot = useStoreState((state) => state.fundersPot)
  const fundersClaimed = useStoreState((state) => state.fundersClaimed)

  const potentialPotShare = formatNumber(
    ((Number(fundersToAmt) + Number(value)) / (Number(fundedAmount) + Number(value))) * 100,
    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    },
  )

  const percentOfPot = formatNumber((Number(fundersToAmt) / Number(fundedAmount)) * 100, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  const claimAmount = formatNumber((Number(percentOfPot) / 100) * Number(fundersPot), {
    maximumFractionDigits: 5,
    minimumFractionDigits: 0,
  })

  const { isPending, sendTransactionAsync } = useSendTransaction()
  const {
    data: writeData,
    isPending: isLoading,
    writeContract,
    writeContractAsync,
  } = useWriteContract()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const addToPotHandler = async () => {
    try {
      const tx = await sendTransactionAsync({
        to: GAME_ADDRESS,
        value: parseEther(value),
      })
      setIsModalOpen(false)
      if (tx) {
        const txLink = `${BLOCK_EXPLORER}/tx/${tx}`

        toast({
          variant: 'success',
          description: (
            <p>
              🔴{' '}
              <a href={txLink} target="_blank" className="text-xl text-black underline">
                Added to pot!
              </a>
            </p>
          ),
        })
      }
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const claimFundersHandler = async () => {
    try {
      const tx = await writeContractAsync({
        ...defaultContractObj,
        functionName: 'fundersClaim',
      })

      if (tx) {
        const txLink = `${BLOCK_EXPLORER}/tx/${tx}`

        toast({
          variant: 'success',
          description: (
            <p>
              🔴{' '}
              <a href={txLink} target="_blank" className="text-xl text-black underline">
                Pot share claimed!
              </a>
            </p>
          ),
        })
      }

      // else {
      //   const errorMsg = tx?.cause?.reason || tx?.cause?.shortMessage || 'Error here!'
      //   toast({
      //     variant: 'destructive',
      //     description: <p>{errorMsg}</p>,
      //   })
      //   onError(errorMsg)
      // }
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
    // setIsModalOpen(false)
  }

  return (
    <Dialog onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="claim" className="w-full px-8 py-2 mt-2 flex justify-center items-center">
          <span className="text-sm mr-1">🔴</span> {canBuyTicket ? 'Add' : 'Claim'}
        </Button>
      </DialogTrigger>
      <DialogContent ref={modalRef}>
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">🍎 The juicy apple</DialogTitle>
          <DialogDescription className="text-center text-neutral-100 text-2xl">
            Add ETH and claim from 🔴 funders pot when game ends.
          </DialogDescription>
        </DialogHeader>

        {canBuyTicket ? (
          <div className="flex flex-col items-center justify-center gap-2 p-2">
            <div
              className="w-[100%] rounded-xl p-3 m-1 border border-zinc-200 bg-zinc-800 flex flex-col
                gap-4 justify-center items-center text-2xl
                "
            >
              <span>
                You contributed <span className="font-digit flash">{fundersToAmt}</span> ETH (out of{' '}
                <span className="font-digit flash">{fundedAmount}</span> ETH) and own{' '}
                <span className="font-digit flash">{percentOfPot}</span>% of the funders pot.
              </span>
            </div>

            <div className="flex flex-col gap-4 justify-center bg-zinc-800 items-center border border-neutral-200 p-6 rounded-lg">
              <label htmlFor="number" className="text-3xl text-center text-gray-300 flex flex-col">
                <span>Contribute to pot (in ETH)</span>
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
                  placeholder="0"
                  maxLength={5}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              {Number(value) > 0 && (
                <p className="font-digit text-2xl mt-2 text-center">
                  You will own {potentialPotShare}% of pot
                </p>
              )}

              <Button
                className="w-[200px] text-2xl"
                variant="claim"
                onClick={addToPotHandler}
                disabled={!canBuyTicket}
                isLoading={isPending}
              >
                Add
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 justify-center bg-zinc-800 items-center border border-neutral-200 p-6 rounded-lg">
              <div className="text-center text-gray-300 flex flex-col gap-2">
                <span className="text-3xl">Claim ETH from pot</span>
                <span className="text-2xl">
                  The funders pot has <span className="font-digit">{fundersPot}</span> ETH
                </span>
                <span className="text-2xl">
                  {' '}
                  You own {percentOfPot}% of the pot and can claim {claimAmount} ETH{' '}
                </span>
              </div>

              <Button
                className="w-[200px] text-2xl mt-4"
                variant="claim"
                onClick={claimFundersHandler}
                isLoading={isLoading}
                disabled={fundersClaimed || !Number(fundersToAmt)}
              >
                {fundersClaimed ? 'You have claimed' : 'Claim'}
              </Button>
              <div>
                {/* Amount added: <span className="font-digit">{formattedFundedAmount}</span> ETH */}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AddToPot
