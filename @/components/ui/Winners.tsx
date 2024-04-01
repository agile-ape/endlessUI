import React, { useEffect, useState } from 'react'
import { useReadContracts, useWatchContractEvent } from 'wagmi'
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

  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'NewTicketBought',
    onLogs() {
      refetch()
    },
    poll: true,
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
      className="gap-2 py-2 px-2 my-2 \
      flex flex-col items-center justify-center"
    >
      <div
        className="flex flex-col items-center mb-2 \
      border border-indigo-400 rounded-lg px-6 py-2"
      >
        <div className="text-gray-400">Current Average</div>
        <div className="font-digit text-3xl">{currentAverage}</div>
      </div>

      <div className="text-gray-400 mb-2">Winning keys (#)</div>
      <div
        className="text-yellow-500 mb-2  \
         text-4xl \
        flex overflow-auto"
      >
        {winningNumbers.map((number, index) => (
          <span className="border px-3 border-stone-500" key={index}>
            {number}
          </span>
        ))}
      </div>
      <div className="text-gray-400">Total keys bought: {ticketsBought}</div>
    </div>
  )
}
