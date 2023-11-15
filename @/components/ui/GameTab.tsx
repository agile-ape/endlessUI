import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import ExitTicketUI from './ExitTicketUI'
import SplitPot from './_SplitPot'
import { useStoreActions, useStoreState } from '../../../store'
import { formatUnits } from 'viem'

import GameFeed from './GameFeed'
import GameTextVariant from './GameTextVariant'
import CheckIn from './_CheckInBox'
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
  const [defaultView, setdefaultView] = useState<string>('ticket')

  // const handleViewChange = useEffect(() => {
  //   setdefaultView(isConnected ? 'ticket' : 'game')
  //   ;[isConnected]
  // })

  // console.log(defaultView)
  const { address, isConnected } = useAccount({
    // onConnect() {
    //   setdefaultView('ticket')
    // },
    // onDisconnect() {
    //   setdefaultView('game')
    // },
  })

  const tabDefaultValue = isConnected ? 'ticket' : 'game'

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

  const id = playerTicket?.[0] || BigInt(0)
  const nextTicketPrice = BigInt(2)

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
    // <div className="flex flex-col items-center justify-center">
    <Tabs defaultValue={tabDefaultValue} className="w-[240px] mx-auto">
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
            {Number(id) === 0 && phase === 'countdown' && (
              <div className="mb-2">
                <div className="text-2xl text-center py-2 leading-7 capitalize">Enter Game</div>
                <TicketUI
                  ownTicket={true}
                  ticketNumber={nextTicketPrice}
                  ticketLookInput={'beforePurchase'}
                />
                <BuyTicket />
                {/* <ExitGame /> */}
              </div>
            )}

            {/* if you have a ticket and not day */}
            {Number(id) === 0 && phase !== 'countdown' && (
              <div className="mb-2">
                <div className="text-2xl text-center py-2 leading-7 capitalize">You</div>
                <TicketUI ownTicket={true} ticketNumber={id} ticketLookInput={'attackedButSafu'} />
                <ExitGame />
              </div>
            )}

            {/* if no ticket for rest of phase */}
            {Number(id) > 0 && (
              // <div className="mb-2 flex justify ">
              <div className="flex flex-col gap-2 justify-center text-xl text-center py-2 mb-2 leading-7 capitalize">
                <div className="">Want to join the fun?</div>
                <Image
                  priority
                  src="/pepe/pepe-lost.svg"
                  className="place-self-center"
                  height={150}
                  width={110}
                  alt="pepe-in-thoughts"
                />
                <div className="text-center text-lg">
                  Follow us for <a href="https://twitter.com/lastman0x">updates</a>
                </div>
              </div>
              // </div>
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
