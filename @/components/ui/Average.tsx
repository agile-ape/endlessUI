import React, { useEffect, useState } from 'react'
import { useReadContracts, useWatchContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import BuyTicket from './BuyTicket'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import Grid from './Grid'
import { Button } from './button'

export default function Average() {
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
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
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
  const canBuyTicket = Boolean(data?.[3].result || false)

  let winningNumbers: number[] = []

  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }

  return (
    <div
      className="gap-2 py-2 px-2 my-2 \
      flex flex-col items-center justify-center"
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="average"
            className="h-20 flex flex-col items-center \
      rounded-lg px-6"
          >
            {canBuyTicket ? 'Current Average' : 'Final Average'}

            <div className="font-digit flash text-3xl">{currentAverage}</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <Grid />
        </DialogContent>
      </Dialog>

      <BuyTicket />

      {/* <div className="text-gray-400 mb-2">Winning keys (#)</div>
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
      <div className="text-gray-400">Total keys: {ticketsBought}</div> */}
    </div>
  )
}
