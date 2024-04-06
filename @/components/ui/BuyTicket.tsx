import React, { useRef, useState, useEffect } from 'react'
import { Button } from './button'
import { useReadContracts, useWriteContract } from 'wagmi'
import { type UseWriteContractParameters } from 'wagmi'
import { formatUnits, parseUnits } from 'viem'
import { rainbowConfig } from '../../../pages/_app'
import { defaultContractObj } from '../../../services/constant'
import { formatNumber } from '@/lib/utils'

export default function BuyTicket() {
  const [value, setValue] = useState('')

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

  const { data: hash, isPending, writeContract, writeContractAsync } = useWriteContract()

  const buyTicketHandler = () => {
    console.log('buyTicketPressed')
    console.log(value)
    writeContract({
      ...defaultContractObj,
      functionName: 'buyTicket',
      value: ticketPrice,
      args: [BigInt(value)],
    })
    console.log('buyTicketPressedEnd')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-4">
      <label htmlFor="number" className="text-xl text-center text-gray-300">
        Pick a number from 0 - 9999
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
          maxLength={4}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <Button
        className="w-[200px] text-2xl"
        variant="buy"
        onClick={buyTicketHandler}
        disabled={!canBuyTicket}
        isLoading={isPending}
      >
        Buy
      </Button>
      <div className="text-left">
        <div className="text-gray-400 text-lg">
          Key price: <span className="font-digit">{formattedTicketPrice}</span> ETH
        </div>
        {/* <div className="text-gray-400">Total keys: {ticketsBought}</div> */}
      </div>
    </div>
  )
}
