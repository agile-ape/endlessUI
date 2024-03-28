import React, { useEffect, useState } from 'react'
import { formatUnits, parseUnits } from 'viem'
import { useReadContracts } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { formatNumber } from '../../lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'

export default function PotSize() {
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'potAmount',
      },
    ],
  })

  const potSize = data?.[0].result || BigInt(0)

  const formattedPotSize = formatNumber(formatUnits(potSize, 18), {
    maximumFractionDigits: 6,
    minimumFractionDigits: 3,
  })

  // const ticketsBought = Number(data?.[1].result || BigInt(0))

  return (
    <div
      className="py-2 px-2 mb-2 inner-last \
        flex flex-col justify-center items-center"
    >
      <div className="secondary-text-last">
        Pot Size
        <span className="ml-1">(ETH)</span>
      </div>
      <div className="flex items-end">
        <div
          className="
        font-digit text-3xl text-[#dae5db]"
        >
          {formattedPotSize}
        </div>
      </div>
    </div>
  )
}
