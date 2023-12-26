import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useStoreState } from '../../../store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { Gem, Users, Vote } from 'lucide-react'

const KeyTrackers = () => {
  const currentPot = useStoreState((state) => state.currentPot)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const voteCount = useStoreState((state) => state.voteCount)
  const { forcedTheme } = useTheme()
  const { xs } = useWindowSize()

  return (
    <div className="flex text-2xl gap-3 text-zinc-500 dark:text-zinc-200 items-center leading-7 capitalize py-0 sm:py-2">
      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-row items-center cursor-default text-md tracking-wide">
              {forcedTheme === 'dark' ? (
                <Image
                  priority
                  src="/logo/eth-dark.png"
                  className="mr-1"
                  height={14}
                  width={xs ? 10 : 14}
                  alt="eth"
                />
              ) : (
                <Image
                  priority
                  src="/logo/eth-gradient.png"
                  className="mr-1"
                  height={14}
                  width={xs ? 10 : 14}
                  alt="eth"
                />
              )}
              <div className="text-2xl sm:text-3xl flash text-purple-900 dark:text-purple-300 tracking-wide">
                {currentPot}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="hidden sm:block">
            <p className="px-3 py-1 max-w-[240px] text-sm">Value in Pot</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-row items-center cursor-default text-md tracking-wide">
              <Users size={xs ? 18 : 24} className="mr-1" />
              <div className="text-2xl sm:text-3xl flash tracking-wide">{ticketCount}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="hidden sm:block">
            <p className="px-3 py-1 max-w-[240px] text-sm">Players left</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={10}>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-row items-center cursor-default text-md tracking-wide">
              <Vote size={xs ? 18 : 24} className="mr-1" />
              <div className="text-2xl sm:text-3xl flash tracking-wide">{voteCount}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="hidden sm:block">
            <p className="px-3 py-1 max-w-[240px] text-sm">Yes votes.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default KeyTrackers
