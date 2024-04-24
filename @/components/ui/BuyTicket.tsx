import React, { useRef, useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { Button } from '../shadcn/button'
import { useReadContracts, useWriteContract } from 'wagmi'
import { type UseWriteContractParameters } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { rainbowConfig } from '../../../pages/_app'
import { defaultContractObj } from '../../../services/constant'
import { formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '../shadcn/use-toast'

const numberSchema = z
  .number()
  .max(1000, { message: 'Number must be less than 1000' })
  .min(0, { message: 'No negative numbers' })

export default function BuyTicket() {
  const [value, setValue] = useState<number>()

  /*
  const { data } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'currentAverage',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketIdCounter',
      },
      {
        ...defaultContractObj,
        functionName: 'computeLeaderboard',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketPrice',
      },
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
    ],
  })

  const currentAverage = Number(data?.[0].result || BigInt(0))
  const ticketsBought = Number(data?.[1].result || BigInt(0))
  const leaderboard: readonly bigint[] = data?.[2].result || []
  const ticketPrice = data?.[3].result || BigInt(0)
  const canBuyTicket = data?.[4].result || false

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

  const formattedTicketPrice = formatNumber(formatUnits(ticketPrice, 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  })

  */

  const canBuyTicket = useStoreState((state) => state.canBuyTicket)

  const currentAverage = useStoreState((state) => state.currentAverage)

  const leaderboard = useStoreState((state) => state.leaderboard)

  const ticketsBought = useStoreState((state) => state.ticketsBought)
  const ticketPrice = useStoreState((state) => state.ticketPrice)

  console.log(canBuyTicket)
  const { data: hash, isPending, writeContract, writeContractAsync } = useWriteContract()

  const formattedTicketPrice = formatNumber(formatUnits(ticketPrice, 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  })

  const buyTicketHandler = async () => {
    console.log('buyTicketPressed')

    try {
      const validatedData = numberSchema.parse(value)
      await writeContractAsync({
        ...defaultContractObj,
        functionName: 'buyTicket',
        value: ticketPrice,
        args: [BigInt(validatedData)],
      })
      console.log('buyTicketPressedEnd')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))

        const errorMsg = fieldErrors[0].message

        toast({
          variant: 'destructive',
          description: <p className="text-xl">{errorMsg}</p>,
        })
      } else {
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-4">
      <label htmlFor="number" className="text-xl text-center text-gray-300">
        Pick a number from 0 - 999
      </label>
      <div
        className="border-[2px] border-gray-400 \
          bg-slate-700 rounded-xl \
          flex flex-col justify-center items-center"
      >
        <input
          type="number"
          id="number"
          max={1000}
          className="w-[200px] bg-transparent font-digit \
            text-center text-4xl text-gray-300 \
            flex justify-between items-center py-2"
          // placeholder="0"
          onInput={(e: ChangeEvent<HTMLInputElement>) => setValue(parseInt(e.target.value))}
        />
      </div>

      <Button
        className="w-[200px] text-3xl h-[48px]"
        variant="buy"
        onClick={buyTicketHandler}
        disabled={!canBuyTicket}
        isLoading={isPending}
      >
        <span className="text-sm mr-1"></span>
        {canBuyTicket ? 'Buy' : 'Buying ended'}
      </Button>
      <div className="text-left">
        <div className="text-gray-400 text-lg text-center">
          <div>
            Disk price: <span className="font-digit">{formattedTicketPrice}</span> ETH
          </div>
          <div>
            Disks bought: <span className="font-digit">{ticketsBought}</span>
          </div>
        </div>
        {/* <div className="text-gray-400">Total keys: {ticketsBought}</div> */}
      </div>
    </div>
  )
}
