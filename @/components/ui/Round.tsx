import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../../store'
import { Badge } from './badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// type RoundType = {
//   round: IApp['round']
//   phaseType: IApp['phase']
// }

// Adjust later to pull from blockchain
const Round = () => {
  const round = useStoreState((state) => state.round)

  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
  }

  const stageOn = 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-black border border-transparent'

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-4xl">
          Round <span className="text-4xl underline">{round}</span>
        </p>
      </div>

      <div className="flex flex-row gap-2 text-sm">
        <button
          onClick={handleClick}
          className={`
          border border-zinc-700 dark:border-zinc-100
          bg-transparent
          inline-flex items-center rounded-full
          px-3 py-0.5
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300

          ${isActive ? stageOn : ''}`}
        >
          Stage 1
        </button>

        <button
          onClick={handleClick}
          className={`
          border border-zinc-700 dark:border-zinc-100
          bg-transparent
          inline-flex items-center rounded-full
          px-3 py-0.5
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300

          ${isActive ? stageOn : ''}`}
        >
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>Stage 2</TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                  Stage 2 will be triggered on Round 25
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>

        <button
          onClick={handleClick}
          className={`
          border border-zinc-700 dark:border-zinc-100
          bg-transparent
          inline-flex items-center rounded-full
          px-3 py-0.5
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 dark:focus:ring-zinc-300

          ${isActive ? stageOn : ''}`}
        >
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>Stage 3</TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                  Join us on Telegram to find out when Stage 3 will be triggered
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </button>
      </div>
    </div>
  )
}

export default Round
