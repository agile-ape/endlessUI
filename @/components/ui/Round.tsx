import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../../store'
import { Badge } from './badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Triangle } from 'lucide-react'
import Image from 'next/image'
import { shareConversion } from '@/lib/utils'
import { DOCS_URL_stages } from '../../../services/constant'

// type RoundType = {
//   round: IApp['round']
//   phaseType: IApp['phase']
// }

// Adjust later to pull from blockchain
const Round = () => {
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const suddenDeath = useStoreState((state) => state.suddenDeath)
  const drainStart = useStoreState((state) => state.drainStart)
  const drainSwitch = useStoreState((state) => state.drainSwitch)
  const drainRate = useStoreState((state) => state.drainRate)
  const minPotSize = useStoreState((state) => state.minPotSize)

  const drainRateConverted = drainRate / shareConversion
  const minPotSizeConverted = minPotSize / shareConversion

  let stage: number

  if (round === 0) {
    stage = 0
  } else if (round < suddenDeath) {
    stage = 1
  } else if (round >= suddenDeath && round < drainStart && drainSwitch === false) {
    stage = 2
  } else if (round > suddenDeath && round >= drainStart && drainSwitch === true) {
    stage = 3
  } else {
    stage = 0
  }

  const [isActive, setIsActive] = useState(false)

  // const handleClick = () => {
  //   setIsActive(!isActive)
  // }

  const On =
    'text-zinc-700 dark:text-white text-md sm:text-lg whitespace-nowrap font-medium tracking-wider cursor-default'
  const Off =
    'text-zinc-600 dark:text-zinc-400 text-xs sm:text-base whitespace-nowrap tracking-tight cursor-default'

  return (
    // <div className="flex flex-col items-center lg:items-end lg:gap-8 lg:flex-row">
    // <div>
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger className="flex flex-col items-center lg:items-end lg:gap-8 lg:flex-row">
          <p
            className={cn(
              'text-lg sm:text-2xl whitespace-nowrap',
              round === 0 ? 'text-zinc-600 dark:text-zinc-400' : '',
            )}
          >
            Round <span className="underline">{round}</span>
          </p>

          <div className={cn('flex flex-row gap-4', stage === 1 ? On : Off)}>
            <div className={stage === 1 ? On : Off}>Stage 1</div>
            <div className={stage === 2 ? On : Off}>Stage 2</div>
            <div className={stage === 3 ? On : Off}>Stage 3</div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
            1 round = 1 day and night. Halving every 4 rounds. Diff stages, diff rules.
            <div>
              <a href={DOCS_URL_stages} target="_blank" className="text-xs underline">
                Learn more
              </a>
            </div>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    // </div>
    // </div>
  )
}

export default Round
