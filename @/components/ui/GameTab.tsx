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
import { useContractWrite, useSignMessage } from 'wagmi'
import { encodePacked, keccak256 } from 'viem'
import { defaultContractObj } from '../../../services/constant'
import { toast } from './use-toast'

type GameTabType = {
  onBuy?: () => Promise<void>
  isCouldBuyTicket: boolean
}

const GameTab: React.FC<GameTabType> = ({ isCouldBuyTicket, onBuy }) => {
  const { signMessageAsync } = useSignMessage({})
  const { writeAsync } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkIn',
  })

  const onSubmit = async (input: string) => {
    try {
      const hashedInput = keccak256(encodePacked(['string'], [input]))
      const hash = await signMessageAsync({
        message: hashedInput,
      })

      const r = hash.slice(0, 66) as `0x${string}`
      const s = ('0x' + hash.slice(66, 130)) as `0x${string}`
      const v = '0x' + hash.slice(130, 132)

      const signature = encodePacked(['bytes32', 'bytes32', 'uint8'], [r, s, Number(v)])

      const result = await writeAsync({
        args: [signature],
      })

      toast({
        title: 'Check in success!',
        description: <p className="text-base">You have successfully checked in.</p>,
      })

      console.log(result)
    } catch (error: any) {
      console.log({ error: error?.cause })
      // @ts-ignore
      const errorMsg = error?.cause?.shortMessage || error?.message
      toast({
        variant: 'destructive',
        title: 'Buy ticket failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
    }
  }

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
          <CheckIn onSubmit={onSubmit} />
        </TabsContent>
        <TabsContent value="game">
          <GameFeed />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default GameTab
