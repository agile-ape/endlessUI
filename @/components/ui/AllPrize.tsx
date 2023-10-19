import PrizeAmount from './PrizeAmount'
import Image from 'next/image'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronsUpDown, HelpCircle } from 'lucide-react'
import { useStoreActions, useStoreState } from '../../../store'
import { formatUnits } from 'viem'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { formatNumber } from '@/lib/utils'

export default function AllPrize() {
  const currentTicketCount = useStoreState((state) => state.currentTicketCount)
  const totalTicketCount = useStoreState((state) => state.totalTicketCount)

  const totalPrizePool = useStoreState((state) => state.totalPrizePool)
  const nextPrizeAmount = useStoreState((state) => state.nextPrizeAmount)
  const topPrize = useStoreState((state) => state.topPrize)
  const bounty = useStoreState((state) => state.bounty)
  const suddenDeathRound = useStoreState((state) => state.suddenDeathRound)

  return (
    <div
      className="sm:grid sm:grid-cols-3 mt-2 flex flex-col
      sm:flex sm:justify-around opacity-90 gap-2
      rounded-lg py-1 px-2 border-2 border-slate-400/50 bg-slate-300/50 dark:bg-slate-500/50 z-10"
    >
      {/* Players Info */}
      <div className="flex flex-col items-center min-w-[150px]">
        <Collapsible>
          <CollapsibleTrigger className="text-xl flex justify-between gap-1 items-center pl-3 pr-8 whitespace-nowrap">
            <div className="text-left">Tickets Info</div>
            <ChevronsUpDown
              size={16}
              className="ml-1 border text-right rounded-full hover:bg-white hover:text-black"
            />
          </CollapsibleTrigger>

          <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger className="leading-tight text-left">Tickets left</TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                    Players still in the game
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-right">{currentTicketCount} </p>
          </div>
          <CollapsibleContent>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Starting</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      Players that bought a ticket
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">{totalTicketCount} </p>
            </div>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Exits</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      Players that left the game without being killed
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">{totalTicketCount} </p>
            </div>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Killed</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      Players that got killed at Night for not checking in / wrong keyword
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">{totalTicketCount} </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Prize Info */}
      <div className="flex flex-col items-center min-w-[150px]">
        <Collapsible>
          <CollapsibleTrigger className="text-xl flex justify-between items-center px-3 whitespace-nowrap">
            <div className="text-left">Pot Info</div>
            <ChevronsUpDown
              size={16}
              className="ml-1 border text-right rounded-full hover:bg-white hover:text-black"
            />
          </CollapsibleTrigger>
          <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger className="leading-tight text-left">Exit value now</TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                    What the next leaver gets
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-right">
              {formatNumber(formatUnits(BigInt(nextPrizeAmount), 18), {
                maximumFractionDigits: 3,
                minimumFractionDigits: 3,
              })}
              <span className="text-sm">ETH</span>
            </p>
          </div>
          <CollapsibleContent>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Total pot</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      What everyone pooled into the pot
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">
                {formatNumber(formatUnits(BigInt(totalPrizePool), 18), {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}
                <span className="text-sm">ETH</span>
              </p>
            </div>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Current pot</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      What is left of the pot
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">
                {formatNumber(formatUnits(BigInt(totalPrizePool), 18), {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}
                <span className="text-sm">ETH</span>
              </p>
            </div>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Top prize</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      What the last man standing gets
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">
                {formatNumber(formatUnits(BigInt(topPrize), 18), {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}
                <span className="ml-0 text-sm">ETH</span>
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Prize Info */}
      <div className="flex flex-col items-center min-w-[150px]">
        <Collapsible>
          <CollapsibleTrigger className="text-xl flex justify-between items-center px-3 whitespace-nowrap">
            <div className="text-left">Game Info</div>
            <ChevronsUpDown
              size={16}
              className="ml-1 border text-right rounded-full hover:bg-white hover:text-black"
            />
          </CollapsibleTrigger>
          <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger className="leading-tight text-left">Sudden death</TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                    Once sudden death round is reached, day and night time is fixed. Players can use
                    the Split Pot? toggle to vote whether to split pot or not.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-right">
              <span className="text-sm">Round </span>
              {suddenDeathRound}
            </p>
          </div>
          <CollapsibleContent>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Split pot %</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      % of players that want to split pot vs. threshold to activate split pot.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">#{totalTicketCount}</p>
            </div>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Assassin</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      The player that killed the most
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">#{totalTicketCount} </p>
            </div>
            <div className="flex leading-tight justify-between text-base bg-neutral-400 dark:bg-neutral-800 border-2 border-slate-400 gap-4 py-1 px-3 rounded-lg mb-1">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger className="leading-tight text-left">Bounty</TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                      What the assassin gets
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-right">
                {formatUnits(BigInt(bounty), 18)} <span className="text-sm">ETH</span>
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
