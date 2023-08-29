import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import GameFeed from './GameFeed'
import GameTextVariant from './GameTextVariant'

type GameTabType = {
  onBuy?: () => Promise<void>
  isCouldBuyTicket: boolean
}

const GameTab: React.FC<GameTabType> = ({ isCouldBuyTicket, onBuy }) => {
  return (
    <Tabs defaultValue="ticket" className="w-[85%] mx-auto">
      <div className="flex justify-center">
        <TabsList className="rounded-2xl w-[190px] h-[41px] mx-auto mb-2">
          <TabsTrigger value="ticket" className="rounded-xl w-[50%] p-1 text-[1rem]">
            Ticket
          </TabsTrigger>

          <TabsTrigger value="game" className="rounded-xl w-[50%] p-1 text-[1rem]">
            Game
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex justify-center min-h-[320px]">
        <TabsContent value="ticket" className="flex flex-col gap-3">
          <TicketUI />
          {isCouldBuyTicket && (
            <Button className="bg-[#31197B] text-[1rem] rounded-xl dark:text-white" onClick={onBuy}>
              Buy Next Ticket
            </Button>
          )}

          {!isCouldBuyTicket && <div className="flex justify-center">Your Ticket (if got buy)</div>}
        </TabsContent>
        <TabsContent value="game">
          <GameFeed />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default GameTab
