import React, { useEffect, useState } from 'react'
import { useReadContracts } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'

export default function Average() {
  // const currentAverage = 5102
  // const ticketsBought = 100

  const { data, refetch } = useReadContracts({
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
    ],
  })

  const currentAverage = Number(data?.[0].result || BigInt(0))
  const ticketsBought = Number(data?.[1].result || BigInt(0))
  const leaderboard: readonly bigint[] = data?.[2].result || []

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

  return (
    <div
      className="inner-last py-2 px-2 my-2 \
      flex flex-col items-center justify-center"
    >
      <div className="text-gray-400">Current Average</div>
      <div className="font-digit text-3xl">{currentAverage}</div>
    </div>
  )
}
