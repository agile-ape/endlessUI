import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import GameFeed from './GameFeed'
import GameTextVariant from './GameTextVariant'
import CheckIn from '../ui/CheckIn'
import { HelpCircle } from 'lucide-react'

type GameTabType = {
  onBuy?: () => Promise<void>
  isCouldBuyTicket: boolean
}

const GameTab: React.FC<GameTabType> = ({ isCouldBuyTicket, onBuy }) => {
  return (
    <Tabs defaultValue="ticket" className="mx-auto">
      <TabsList className="flex justify-center rounded-xl w-[220px] mx-auto px-2 py-2">
        <TabsTrigger value="ticket" className="rounded-xl w-[50%] p-1 text-xl">
          Ticket
        </TabsTrigger>

        <TabsTrigger value="game" className="rounded-xl w-[50%] p-1 text-xl">
          Game
        </TabsTrigger>
      </TabsList>

      <div className="mt-2 flex justify-center">
        <TabsContent value="ticket" className="flex flex-col justify-center">
          {isCouldBuyTicket && (
            <>
              <div className="flex justify-center items-center text-xl">
                Next Ticket
                <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger>
                      {/* <QuestionMarkCircledIcon className="w-[20px] h-[20px]" /> */}
                      <HelpCircle
                        size={16}
                        className="ml-1 stroke-slate-900 dark:stroke-slate-100"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                        Every next ticket price increase by 0.001ETH.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TicketUI />
              <Button
                // disabled={!write || isAddressBoughtTickets}
                size="lg"
                variant="enter"
                className="mx-2 mb-4"
                onClick={onBuy}
              >
                Buy Ticket
              </Button>
            </>
          )}

          {!isCouldBuyTicket && <div className="flex justify-center mb-4">Your Ticket</div>}
          <CheckIn />
        </TabsContent>
        <TabsContent value="game">
          <GameFeed />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default GameTab
