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
  // const levelUp = useStoreState((state) => state.levelUp)

  /*---
  Replace 4 wth levelUp variable

  Stage 1: default when game starts
  Stage 2: round >= suddenDeath
  Stage 3: round >= drainStart && drainStart != 0

  ---*/

  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    setIsActive(!isActive)
  }

  const On =
    'text-black dark:text-white text-md sm:text-xl whitespace-nowrap font-medium tracking-wider'
  const Off = 'text-zinc-600 dark:text-zinc-800 text-sm sm:text-lg whitespace-nowrap tracking-tight'

  return (
    <div className="flex flex-col items-center lg:items-end lg:gap-8 lg:flex-row">
      <div>
        <p className="text-lg sm:text-2xl whitespace-nowrap">
          Round <span className="underline">{round}</span>
        </p>
      </div>

      <div className="flex flex-row gap-4">
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger className={On}>Stage 1</TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                Time is halved after every 4 rounds.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger className={isActive ? On : Off}>Stage 2</TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                <p>Time stops halving.</p>
                <p>Tokens emission stops.</p>
                <p>Split pot option activated.</p>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger className={isActive ? On : Off}>Stage 3</TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                <p>Pot begins to get drained at 10% per round.count</p>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default Round
