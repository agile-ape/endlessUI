import React, { useEffect, useState } from 'react'
import { formatUnits, parseUnits, parseEther } from 'viem'
import { useReadContracts, useSendTransaction, useWatchContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { formatNumber } from '../../lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { Button } from './button'
import AddToPot from './AddToPot'

export default function PotSize() {
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
      {
        ...defaultContractObj,
        functionName: 'potAmount',
      },
    ],
  })

  const canBuyTicket = data?.[0].result || false
  const potSize = data?.[1].result || BigInt(0)

  const formattedPotSize = formatNumber(formatUnits(potSize, 18), {
    maximumFractionDigits: 6,
    minimumFractionDigits: 3,
  })

  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'NewTicketBought',
    onLogs() {
      refetch()
    },
    poll: true,
  })

  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'PotAdded',
    onLogs() {
      refetch()
    },
    poll: true,
  })

  return (
    <div className="py-2 px-2 mb-2 inner-last">
      <div
        className=" \
      flex flex-col justify-center items-center"
      >
        <div className="text-stone-400">
          {canBuyTicket ? 'Pot Size' : 'Final Pot Size'}

          <span className="ml-1">(ETH)</span>
        </div>
        <div className="flex items-end">
          <div
            className="
          font-digit text-4xl text-stone-200 \
          transition-all ease-linear place-self-center animate-pulse"
          >
            {formattedPotSize}
          </div>
        </div>
        <AddToPot />
      </div>
    </div>
  )
}
