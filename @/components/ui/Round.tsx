import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../../store'
import { Badge } from './badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Triangle } from 'lucide-react'
import Image from 'next/image'
import { defaultContractObj, tokenContractObj, DOCS_URL_stages } from '../../../services/constant'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { formatUnits, parseUnits } from 'viem'

const Round = ({ phase }: { phase: string }) => {
  const round = useStoreState((state) => state.round)
  const stage = useStoreState((state) => state.stage)
  const suddenDeath = useStoreState((state) => state.suddenDeath)

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'levelUp',
      },
    ],
  })

  const levelUp = Number(data?.[0].result || 0)

  const On = 'font-medium tracking-wider'
  const Off = 'text-zinc-400 dark:text-zinc-400 tracking-tight'

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger className="flex flex-col items-center lg:items-end lg:gap-8 lg:flex-row">
          <p
            className={cn(
              'text-lg sm:text-2xl whitespace-nowrap',
              round === 0 ? 'text-zinc-600 dark:text-zinc-400' : '',
            )}
          >
            Round <span className="round-last">{round}</span>
          </p>

          <div
            className={cn(
              'flex flex-row items-end gap-4 text-xs sm:text-base whitespace-nowrap cursor-default',
            )}
          >
            <div className={stage === 1 ? On : Off}>Stage 1</div>
            <div className={stage === 2 ? On : Off}>Stage 2</div>
            <div className={stage === 3 ? On : Off}>Stage 3</div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <p className="px-3 py-1 max-w-[280px] text-sm cursor-default">
            1 round = 1 Day + 1 Night. Time halves every {levelUp} rounds. Stage 2 starts on Round{' '}
            {suddenDeath}
            <div>
              <a href={DOCS_URL_stages} target="_blank" className="text-xs link">
                Learn more
              </a>
            </div>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Round
