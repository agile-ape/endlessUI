import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import ExitTicketUI from './_ExitTicketUI'
import SplitPot from './_SplitPot'
import { useStoreActions, useStoreState } from '../../../store'
import { formatUnits } from 'viem'

import GameFeed from './GameFeed'
import GameTextVariant from './_GameTextVariant'
import CheckIn from './_CheckInBox'
import UserActions from './UserActions'
import { HelpCircle } from 'lucide-react'
import {
  useAccount,
  useContractRead,
  useContractEvent,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { encodePacked, keccak256, recoverMessageAddress, verifyMessage, toBytes } from 'viem'
import { defaultContractObj, DOCS_URL, TWITTER_URL } from '../../../services/constant'
import { toast } from './use-toast'
import BuyTicket from './BuyTicket'
import ExitGame from './ExitGame'
import CustomConnectButton from './connect-button'

const GameTab = () => {
  const tabValue = useStoreState((state) => state.gameTab)
  const updateTabValue = useStoreActions((actions) => actions.updateGameTab)
  const phase = useStoreState((state) => state.phase)
  const ticketId = useStoreState((state) => state.ticketId)

  const { address, isConnected } = useAccount()

  const { data: playerTicket, refetch } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
  })

  const id = Number(playerTicket?.[0] || BigInt(0))

  useEffect(() => {
    if (isConnected) {
      updateTabValue('ticket')
    } else {
      updateTabValue('game')
    }
  }, [isConnected])

  function changeTabValue(value: string) {
    updateTabValue(value as 'ticket' | 'game')
  }

  return (
    <Tabs value={tabValue} onValueChange={changeTabValue} className="w-[240px] mx-auto">
      <div className="flex justify-center">
        <TabsList className="rounded-2xl w-3/4 mx-auto mb-2">
          <TabsTrigger value="ticket" className="rounded-xl w-[50%] p-1 text-[1rem]">
            Ticket
          </TabsTrigger>

          <TabsTrigger value="game" className="rounded-xl w-[50%] p-1 text-[1rem]">
            Game
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex justify-center">
        <TabsContent value="ticket" className="flex flex-col gap-3">
          <>
            {!isConnected && (
              <div className="flex flex-col gap-2 justify-center text-xl text-center py-2 mb-2 leading-7 capitalize">
                <div className="">Want to join us?</div>
                <Image
                  priority
                  src="/pepe/pepe-lost.svg"
                  className="place-self-center"
                  height={150}
                  width={110}
                  alt="pepe-in-thoughts"
                />
                <div className="text-center text-lg underline">
                  <a href={TWITTER_URL} target="_blank">
                    Follow us for updates
                  </a>
                </div>

                <div className="flex mt-4 justify-center">
                  <CustomConnectButton />
                </div>
              </div>
            )}

            {isConnected && (
              <>
                {/* deployed phase. buying hasn't started */}
                {id === 0 && phase === 'deployed' && (
                  <div className="mb-2">
                    <div className="text-2xl text-center py-2 leading-7 capitalize">
                      Buying starting soon
                    </div>
                    <TicketUI
                      ownTicket={true}
                      ticketNumber={ticketId}
                      // ticketLookInput={'beforePurchase'}
                    />
                    <BuyTicket />
                    {/* <ExitGame /> */}
                  </div>
                )}

                {/* start phase. haven't bought ticket */}
                {id === 0 && phase === 'start' && (
                  <div className="mb-2">
                    <div className="text-2xl text-center py-2 leading-7 capitalize">Enter Game</div>
                    <TicketUI
                      ownTicket={true}
                      ticketNumber={ticketId}
                      // ticketLookInput={'beforePurchase'}
                    />
                    <BuyTicket />
                    {/* <ExitGame /> */}
                  </div>
                )}

                {/* start phase. ticket bought */}
                {id !== 0 && phase === 'start' && (
                  <div className="mb-2">
                    <div className="text-2xl text-center py-2 leading-7 capitalize">
                      Welcome Sire
                    </div>
                    <TicketUI
                      ownTicket={true}
                      ticketNumber={id}
                      // ticketLookInput={'afterPurchase'}
                    />
                    {/* <BuyTicket /> */}
                    <ExitGame />
                  </div>
                )}

                {/* game begins. got ticket */}
                {id !== 0 && phase !== 'start' && (
                  <div className="mb-2">
                    <div className="text-2xl text-center py-2 leading-7 capitalize">
                      Your Player
                    </div>
                    <TicketUI
                      ownTicket={true}
                      ticketNumber={id}
                      // ticketLookInput={''}
                    />
                    <ExitGame />
                  </div>
                )}

                {/* game begins. no ticket */}
                {id === 0 && !(phase === 'start' || phase === 'deployed') && (
                  // <div className="mb-2 flex justify ">
                  <div className="flex flex-col gap-2 justify-center text-xl text-center py-2 mb-2 leading-7 capitalize">
                    <div className="">Want to join us?</div>
                    <Image
                      priority
                      src="/pepe/pepe-lost.svg"
                      className="place-self-center"
                      height={150}
                      width={110}
                      alt="pepe-in-thoughts"
                    />
                    <div className="text-center text-lg underline">
                      <a href={TWITTER_URL} target="_blank">
                        Follow us for updates
                      </a>
                    </div>
                  </div>
                  // </div>
                )}
              </>
            )}

            <UserActions />
          </>
        </TabsContent>
        <TabsContent value="game">
          <GameFeed />
        </TabsContent>
      </div>
    </Tabs>
    // </div>
  )
}

export default GameTab
