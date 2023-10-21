import {
  ChevronsUpDown,
  User,
  Users,
  Trophy,
  Skull,
  Dice6,
  Gem,
  Flag,
  Vote,
  Gauge,
  PiggyBank,
  HelpCircle,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'

import { useStoreActions, useStoreState } from '../../../store'
import { formatUnits } from 'viem'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { formatNumber } from '@/lib/utils'

export default function GameStats() {
  const totalTicketCount = useStoreState((state) => state.totalTicketCount)
  const currentTicketCount = useStoreState((state) => state.currentTicketCount)

  return (
    <div
      className="mx-auto flex flex-row justify-around items-center
    rounded-xl container-last"
    >
      {/* bg-zinc-100/50 dark:bg-zinc-700/50 border-2 border-zinc-200 dark:border-zinc-800  */}
      {/* <div className=""> */}
      {/* <CollapsibleTrigger className="min-w-[220px] sm:max-w-none mx-auto flex justify-center text-xl items-center">
          Game Stats
          <ChevronsUpDown
            size={20}
            className="ml-1 border rounded-full hover:bg-white hover:text-black"
          />
        </CollapsibleTrigger> */}

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          Total joined
          {/* <Users size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} players</div>
      </div>

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          In play
          {/* <User size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} players</div>
      </div>

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          Top prize
          {/* <Trophy size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} ETH</div>
      </div>

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          Total pot
          {/* <PiggyBank size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} ETH</div>
      </div>

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          Forfeited
          {/* <Skull size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} tickets</div>
      </div>

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          Give ups
          {/* <Flag size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} tickets</div>
      </div>

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          Next claim
          {/* <Gem size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} ETH</div>
      </div>

      <div className="flex flex-col text-left p-1">
        <div className="flex text-base text-zinc-800 dark:text-zinc-100">
          Vote %{/* <Vote size={16} className="ml-1" /> */}
        </div>
        <div className="text-xl text-amber-300">{totalTicketCount} ETH</div>
      </div>

      {/* <div className="flex flex-col w-32 border border-black dark:border-white  rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Threshold %
              <Gauge size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div> */}

      {/* <div className="flex flex-col w-32 border border-black dark:border-white  rounded-xl p-1 items-center">
            <div className="flex items-center">
              Random Number
              <Dice6 size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div> */}
      {/* </div> */}
    </div>
  )
}
