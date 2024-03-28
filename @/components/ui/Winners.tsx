import React, { useEffect, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'

export default function Winners() {
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'currentAverage',
      },
      {
        ...defaultContractObj,
        functionName: 'computeLeaderboard',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketIdCounter',
      },
    ],
  })
  const currentAverage = Number(data?.[0].result || BigInt(0))
  const leaderboard: readonly bigint[] = data?.[1].result || []
  const ticketsBought = Number(data?.[2].result || BigInt(0))

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

  return (
    <div
      className="inner-last gap-2 py-2 px-2 my-2 \
      flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center mb-2">
        <div className="text-gray-400">Current Average</div>
        <div className="font-digit text-3xl">{currentAverage}</div>
      </div>

      <div className="text-gray-400 mb-2">Winning keys</div>
      <div
        className="text-gray-400 mb-2 border px-1 border-stone-500 \
        rounded-sm text-2xl font-digit \
        flex overflow-auto"
      >
        {winningNumbers.map((number, index) => (
          <span key={index}>{number}</span>
        ))}
      </div>
      <div className="text-gray-400">Total keys bought: {ticketsBought}</div>
    </div>
  )
}
