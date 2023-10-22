import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import ExitTicketUI from './ExitTicketUI'
import SplitPot from './SplitPot'
import { useStoreActions, useStoreState } from '../../../store'
import { formatUnits } from 'viem'

import GameFeed from './GameFeed'
import GameTextVariant from './GameTextVariant'
import CheckIn from './CheckInBox'
import UserActions from './UserActions'
import { HelpCircle } from 'lucide-react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { encodePacked, keccak256, recoverMessageAddress, verifyMessage, toBytes } from 'viem'
import { defaultContractObj } from '../../../services/constant'
import { toast } from './use-toast'
import BuyTicket from './BuyTicket'
import ExitGame from './ExitGame'

type GameTabType = {
  onBuy?: () => Promise<void>
  // isCouldBuyTicket: boolean
}

const GameTab: React.FC<GameTabType> = ({ onBuy }) => {
  const { address } = useAccount()

  // const { playerAddress, isConnected } = useAccount()
  // const { data: playerAddress } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'idToPlayer',
  //   args: [ticketId],
  // })

  // const { data: playerTicket } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'playerTicket',
  //   args: [playerAddress as `0x${string}`],
  // })

  const { data: walletClient } = useWalletClient()

  const { signMessageAsync } = useSignMessage({})

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
  })

  const ticketId = playerTicket?.[0] || BigInt(0)
  // console.log(Number(ticketId));

  const phase = useStoreState((state) => state.phase)
  // const phase = 'day';

  const nextPrizeAmount = useStoreState((state) => state.nextPrizeAmount)
  const totalPrizePool = useStoreState((state) => state.totalPrizePool)

  //  add buyTicket logic

  const { writeAsync } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkIn',
  })

  const onSubmit = async (input: string) => {
    console.log({ input })
    try {
      const hashedMessage = toBytes(input)
      const signature = await walletClient?.signMessage({
        message: { raw: hashedMessage },
      })
      const result = await writeAsync({
        args: [signature as `0x${string}`],
      })
      console.log({ hashedMessage, signature, result })
      toast({
        title: 'Check in success!',
        description: <p className="text-base">You have successfully checked in.</p>,
      })

      // console.log(result)
    } catch (error: any) {
      console.log({ error: error?.cause })
      // @ts-ignore
      const errorMsg = error?.cause?.reason || error?.cause?.shortMessage || error?.message
      toast({
        variant: 'destructive',
        title: 'Buy ticket failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <TabsContent value="ticket" className="flex flex-col items-center justify-center"> */}
      {/* if no ticket, beginnings/countdown = buy */}
      {Number(ticketId) === 0 && (phase === 'beginnings' || 'countdown') && (
        <div className="mb-2">
          <div className="flex justify-center items-center text-3xl py-2 mb-4 leading-7 capitalize">
            Next Card
            {/* <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle
                        size={16}
                        className="ml-1 stroke-slate-900 dark:stroke-slate-100"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                        Ticket price increases over time
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
          </div>
          {/* to adjust how ticket is shown*/}
          <TicketUI ownTicket={true} ticketId={ticketId} ticketWidthPx={240} />
          {/* <ExitTicketUI ticketId={ticketId} ticketWidthPx={240} /> */}

          {/* <Button
              // disabled={!write || isAddressBoughtTickets}
              size="lg"
              variant="enter"
              className="w-[240px] mt-4"
              onClick={onBuy}
              >
                Buy Ticket
              </Button> */}

          <BuyTicket />
        </div>
      )}

      {/* if no ticket for rest of phase */}
      {/* {((Number(ticketId) === 0) && (phase !== 'beginnings' || 'countdown')) &&
            <div className="flex flex-col justify-center mb-4">
              <div className="mt-1 flex justify-center items-center text-3xl pb-4 pt-2 leading-7 capitalize">
                Feeling FOMO?
              </div>
              <Image
                priority
                src="/pepe/pepe-lost.svg"
                className="place-self-center"
                height={200}
                width={200}
                alt="pepe-in-thoughts"
                />
                <div className='text-center text-xl'>
                  Follow us when game begins
                </div>
            </div>
          } */}

      {/* if you have a ticket and not day */}
      {Number(ticketId) > 0 && phase !== 'day' && (
        <div className="mb-4">
          <div className="mt-1 flex justify-center items-center text-3xl pb-4 pt-2 leading-7 capitalize">
            Your Card
          </div>
          <TicketUI ownTicket={true} ticketId={ticketId} ticketWidthPx={240} />
        </div>
      )}

      {/* if you have a ticket and day */}
      {Number(ticketId) > 0 && phase === 'day' && (
        <div className="mb-4">
          <div className="mt-1 flex justify-center items-center text-3xl pb-4 pt-2 leading-7 capitalize">
            Your Card
          </div>

          <TicketUI ownTicket={true} ticketId={ticketId} ticketWidthPx={240} />

          <div className="text-xl text- center leading-tight">
            +{formatUnits(BigInt(totalPrizePool), 18)} ETH if you exit now.
          </div>

          {/* <Button
              // disabled={!write || isAddressBoughtTickets}
              size="lg"
              variant="exit"
              className="w-[240px] mt-1"
              onClick={onBuy}
              >
                Exit Game
              </Button> */}

          <ExitGame />
        </div>
      )}

      {/* <CheckIn /> */}
      {/* <UserActions /> */}

      {/* </TabsContent> */}
      {/* <TabsContent value="game"> */}
      {/* <GameFeed /> */}
      {/* </TabsContent> */}
    </div>
  )
}

export default GameTab
