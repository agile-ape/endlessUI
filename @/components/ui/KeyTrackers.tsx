import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useStoreState } from '../../../store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { useContractReads } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Gem,
  Users,
  Vote,
  Coins,
  Ticket,
  CookingPot,
  User,
  Menu,
  MenuSquare,
  Link2,
  Unlink2,
  Rss,
  Clock,
  Monitor,
  Target,
  Info,
  Move,
  ChevronDown,
  ChevronUp,
  Send,
  Split,
  LogIn,
  LogOut,
  Dices,
  Gift,
  DoorOpen,
  Ticket as Ticket2,
  Sword,
  Sparkle,
  Hexagon,
  RefreshCw,
  Axe,
} from 'lucide-react'
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
              <div className="flex flex-row gap-3 items-center py-0 sm:py-2 ">
                <div className="flex flex-row items-center align-middle text-2xl blast-arena-last">
                  {/* <Hexagon size={36} strokeWidth={3} /> */}
                  Blast Arena
                </div>

                <div className="flex flex-row items-center cursor-default tracking-wide">
                  <CookingPot size={24} className="mr-1" />
                  <div className="text-2xl flash tracking-wide">{currentPot}</div>
                </div>

                <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                  <Users size={24} className="mr-1" />
                  <div className="text-2xl flash tracking-wide">{ticketCount}</div>
                </div>

                {phase === 'deployed' ||
                  (phase === 'start' && (
                    <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                      <Ticket size={24} className="mr-1" />
                      <div className="text-2xl flash tracking-wide">{nextTicketPrice}</div>
                    </div>
                  ))}

                {!(phase === 'deployed' || phase === 'start') && (
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Vote size={24} className="mr-1" />
                    <div className="text-2xl flash tracking-wide">{voteCount}</div>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="hidden sm:block">
              <p className="px-3 py-1 max-w-[260px] text-sm">
                {`Value in Pot | Players Left | ${
                  phase === 'start' ? 'Next Ticket Price' : 'Yes Votes'
                } `}
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
                <CookingPot size={24} className="mr-1" />
                <div className="text-2xl flash tracking-wide">{currentPot}</div>
              </div>

              <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                <Users size={24} className="mr-1" />
                <div className="text-2xl flash tracking-wide">{ticketCount}</div>
              </div>

              {phase === 'deployed' ||
                (phase === 'start' && (
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Ticket size={24} className="mr-1" />
                    <div className="text-2xl flash tracking-wide">
                      {nextTicketPrice}
                      {/* <span className="text-lg sm:text-xl">ETH</span> */}
                    </div>
                  </div>
                ))}

              {!(phase === 'deployed' || phase === 'start') && (
                <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                  <Vote size={24} className="mr-1" />
                  <div className="text-2xl flash tracking-wide">{voteCount}</div>
                </div>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" align="center">
            <p className="px-3 py-1 max-w-[240px] text-sm">
              {`Value in Pot | Players Left | ${
                phase === 'start' ? 'Next Ticket Price' : 'Yes Votes'
              } `}
            </p>
          </PopoverContent>
        </Popover>
      </span>
    </div>
  )
}

export default KeyTrackers
