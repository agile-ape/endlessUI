import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useStoreState } from '../../../store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { Gem, Users, Vote, Coins, Ticket } from 'lucide-react'
import { useContractReads } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const KeyTrackers = () => {
  const currentPot = useStoreState((state) => state.currentPot)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const voteCount = useStoreState((state) => state.voteCount)
  const nextTicketPrice = useStoreState((state) => state.nextTicketPrice)
  const phase = useStoreState((state) => state.phase)
  const { forcedTheme } = useTheme()
  const { xs } = useWindowSize()

  return (
    <div className="">
      <span className="hidden sm:inline">
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex flex-row gap-3 items-center py-0 sm:py-2 h4-last">
                <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                  <Coins size={xs ? 18 : 24} className="mr-1" />
                  <div className="text-2xl sm:text-3xl flash tracking-wide">{currentPot}</div>
                </div>

                <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                  <Users size={xs ? 18 : 24} className="mr-1" />
                  <div className="text-2xl sm:text-3xl flash tracking-wide">{ticketCount}</div>
                </div>

                {phase === 'deployed' ||
                  (phase === 'start' && (
                    <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                      <Ticket size={xs ? 18 : 24} className="mr-1" />
                      <div className="text-2xl sm:text-3xl flash tracking-wide">
                        {nextTicketPrice}
                      </div>
                    </div>
                  ))}

                {!(phase === 'deployed' || phase === 'start') && (
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Vote size={xs ? 18 : 24} className="mr-1" />
                    <div className="text-2xl sm:text-3xl flash tracking-wide">{voteCount}</div>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="hidden sm:block">
              <p className="px-3 py-1 max-w-[240px] text-sm">
                Value in Pot | Players Left | Next Ticket Price or Yes Votes
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>

      <span className="inline sm:hidden">
        <Popover>
          <PopoverTrigger>
            <div className="flex flex-row gap-3 items-center py-0 sm:py-2 h4-last">
              <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                <Coins size={xs ? 18 : 24} className="mr-1" />
                <div className="text-2xl sm:text-3xl flash tracking-wide">{currentPot}</div>
              </div>

              <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                <Users size={xs ? 18 : 24} className="mr-1" />
                <div className="text-2xl sm:text-3xl flash tracking-wide">{ticketCount}</div>
              </div>

              {phase === 'deployed' ||
                (phase === 'start' && (
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Ticket size={xs ? 18 : 24} className="mr-1" />
                    <div className="text-2xl sm:text-3xl flash tracking-wide">
                      {nextTicketPrice}
                    </div>
                  </div>
                ))}

              {!(phase === 'deployed' || phase === 'start') && (
                <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                  <Vote size={xs ? 18 : 24} className="mr-1" />
                  <div className="text-2xl sm:text-3xl flash tracking-wide">{voteCount}</div>
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" align="center">
            <p className="px-3 py-1 max-w-[240px] text-sm">
              Value in Pot | Players Left | Next Ticket Price or Yes Votes
            </p>
          </PopoverContent>
        </Popover>
      </span>
    </div>
  )
}

export default KeyTrackers
