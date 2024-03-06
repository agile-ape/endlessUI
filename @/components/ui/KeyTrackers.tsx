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
      <div className="flex flex-row gap-3 items-center py-0 sm:py-2 ">
        <>
          <div className="flex flex-row items-center cursor-default tracking-wide">
            <div className="text-2xl flash tracking-wide">Round [1] </div>
          </div>

          <div className="flex flex-row items-center cursor-default tracking-wide">
            <div className="text-2xl flash tracking-wide">Pot [21 ETH]</div>
          </div>

          <div className="flex flex-row items-center cursor-default text-md tracking-wide">
            <div className="text-2xl flash tracking-wide">Active [30]</div>
          </div>
        </>
      </div>
    </div>
  )
}

export default KeyTrackers
