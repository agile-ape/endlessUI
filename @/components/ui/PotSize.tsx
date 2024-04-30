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
import { Button } from '../shadcn/button'
import { useStoreActions, useStoreState } from '../../../store'

export default function PotSize() {
  /* read contract
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
  */

  const canBuyTicket = useStoreState((state) => state.canBuyTicket)
  const potSize = useStoreState((state) => state.potSize)
  const winnersShare = useStoreState((state) => state.winnersShare)
  const playersShare = useStoreState((state) => state.playersShare)
  const rolloverShare = useStoreState((state) => state.rolloverShare)
  const ethPrice = useStoreState((state) => state.ethPrice)

  const currentPotSize = formatNumber(formatUnits(potSize, 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const currentWinnersPot = formatNumber((Number(formatUnits(potSize, 18)) * winnersShare) / 100, {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const currentPlayersPot = formatNumber((Number(formatUnits(potSize, 18)) * playersShare) / 100, {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  })

  const currentRolloverPot = formatNumber(
    (Number(formatUnits(potSize, 18)) * rolloverShare) / 100,
    {
      maximumFractionDigits: 3,
      minimumFractionDigits: 0,
    },
  )

  const potSizeInUSD = formatNumber(Number(currentPotSize) * Number(ethPrice), {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger className="cursor-default">
          <div className="py-2 px-2 mb-2 inner-last">
            <div className="flex flex-col justify-center items-center">
              <div className="text-stone-400">
                {canBuyTicket ? 'Total Pot Size' : 'Final Pot Size'}

                <span className="ml-1">(ETH)</span>
              </div>
              <div className="flex flex-col items-end">
                <div
                  className="
            font-digit text-4xl text-stone-200 \
            transition-all ease-linear place-self-center animate-pulse"
                >
                  {currentPotSize}
                </div>
                <div className="text-2xl text-stone-100/50">
                  <span className="text-lg">≈ </span>${potSizeInUSD}
                </div>
              </div>
              {/* <AddToPot /> */}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <div className="px-3 py-1 max-w-[240px] text-lg cursor-default">
            <span className="text-base">🟣</span> Players share:{' '}
            <span className="font-digit text-2xl">{currentPlayersPot} </span>
          </div>
          <div className="px-3 py-1 max-w-[240px] text-lg cursor-default">
            <span className="text-base">🟡</span> Winners share:{' '}
            <span className="font-digit text-2xl">{currentWinnersPot} </span>
          </div>
          <div className="px-3 py-1 max-w-[240px] text-lg cursor-default">
            <span className="text-base">🔵</span> Rollover share:{' '}
            <span className="font-digit text-2xl">{currentRolloverPot} </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
