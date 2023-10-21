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

import { useStoreActions, useStoreState } from '../../../store'
import { formatUnits } from 'viem'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { formatNumber } from '@/lib/utils'

export default function GameStats() {
  const totalTicketCount = useStoreState((state) => state.totalTicketCount)
  const currentTicketCount = useStoreState((state) => state.currentTicketCount)

  return (
    <div className="mx-auto flex justify-center items-center rounded-xl text-sm">
      <Collapsible className="rounded-xl bg-zinc-100/50 dark:bg-zinc-700/50 border-2 border-zinc-200 dark:border-zinc-800 text-base px-4 py-2">
        <CollapsibleTrigger className="max-w-[240px] sm:max-w-none mx-auto flex justify-center text-xl items-center">
          Game Stats
          <ChevronsUpDown
            size={20}
            className="ml-1 border rounded-full hover:bg-white hover:text-black"
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="sm:grid sm:grid-cols-5 gap-4 flex flex-col ">
          <div className="flex flex-col w-32 border border-black dark:border-white rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Total players
              <Users size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{totalTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Still in play
              <User size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Top prize
              <Trophy size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Total pot
              <PiggyBank size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{totalTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Forfeit count
              <Skull size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{totalTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white  rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Give up count
              <Flag size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white  rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Next claim
              <Gem size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white  rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Vote %
              <Vote size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white  rounded-xl p-1 items-center">
            <div className="flex capitalize items-center">
              Threshold %
              <Gauge size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div>

          <div className="flex flex-col w-32 border border-black dark:border-white  rounded-xl p-1 items-center">
            <div className="flex items-center">
              Random Number
              <Dice6 size={16} className="ml-1" />
            </div>
            <div className="text-2xl">{currentTicketCount}</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
