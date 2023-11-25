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
    <div className="flex flex-col items-center lg:items-end lg:gap-8 lg:flex-row">
      <div>
        <p
          className={cn(
            'text-lg sm:text-2xl whitespace-nowrap',
            round === 0 ? 'text-zinc-600 dark:text-zinc-400' : '',
          )}
        >
          Round <span className="underline">{round}</span>
        </p>
      </div>

      <div className="flex flex-row gap-4">
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger className={stage === 1 ? On : Off}>Stage 1</TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                Time is halved after every 4 rounds.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger className={stage === 2 ? On : Off}>Stage 2</TooltipTrigger>
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
            <TooltipTrigger className={stage === 3 ? On : Off}>Stage 3</TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                <p>
                  Pot begins to get drained at {drainRateConverted}% per round, until the pot is
                  left with {minPotSizeConverted}% of pot size
                </p>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* <div className="flex justify-center">
          <Image
            priority
            src={`/icon/triangle-up.svg`}
            height={18}
            width={18}
            // fill={true}
            // sizes="max-width:150px"
            className=""
            // layout="fixed"
            alt={`arrow`}
          />
        </div>

        <div></div>

        <div></div> */}
      </div>
    </div>
  )
}

export default Round
