import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import { useStoreActions, useStoreState } from '../../../store'
import { formatUnits } from 'viem'

import GameFeed from './GameFeed'
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
import {
  defaultContractObj,
  DOCS_URL,
  LAST_MAN_STANDING_ADDRESS,
  TWITTER_URL,
} from '../../../services/constant'
import { toast } from './use-toast'
import BuyTicket from './_BuyTicket'
import ExitGame from './_ExitGame'

import Modal from './Modal'

import BuyTicketNew from './BuyTicketNew'
import { BuyTicketActive } from './BuyTicketNew'
import ExitGameNew from './ExitGameNew'
import { ExitGameActive } from './ExitGameNew'
import OnSignal from './OnSignal'

import CustomConnectButton from './connect-button'
import type { Ticket } from 'types/app'
import { fetcher, transformPlayerTicket, statusPayload } from '@/lib/utils'
import useSWR from 'swr'
import { useWindowSize } from '../../../hooks/useWindowSize'

const GameTab = () => {
  const tabValue = useStoreState((state) => state.gameTab)
  const updateTabValue = useStoreActions((actions) => actions.updateGameTab)
  const phase = useStoreState((state) => state.phase)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const { xs } = useWindowSize()

  const buyActive = BuyTicketActive()
  const [showBuyModal, setShowBuyModal] = React.useState<boolean>(false)
  const toggleBuy = () => setShowBuyModal((prevState) => !prevState)

  const exitActive = ExitGameActive()
  const [showExitModal, setShowExitModal] = React.useState<boolean>(false)
  const toggleExit = () => setShowExitModal((prevState) => !prevState)

  const { address, isConnected } = useAccount()

  let ticket: Ticket | undefined = ownedTicket || {
    id: 0,
    user: address as `0x${string}`,
    sign: '',
    status: 0,
    lastSeen: 0,
    isInPlay: false,
    vote: false,
    value: 0,
    purchasePrice: 0,
    potClaim: 0,
    redeemValue: 0,
    attacks: 0,
    attackCount: 0,
    killCount: 0,
    killedBy: 0,
    safehouseNights: 0,
    checkOutRound: 0,
    buddy: 0,
    buddyCount: 0,
    rank: 0,
    contractAddress: LAST_MAN_STANDING_ADDRESS,
  }

  const id = ticket?.id || 0

  let ticketStatus = ownedTicket?.status || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

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
      <div className="justify-center hidden sm:flex">
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
            {isConnected && (
              <>
                <div className="mb-2">
                  <TicketUI ownTicket={true} ticketNumber={id} ticket={ticket} />
                  {id === 0 && (phase === 'deployed' || phase === 'start') && (
                    <Button
                      variant="enter"
                      className="rounded-full px-1 py-1 leading-10 h-12 w-full mt-4 text-2xl"
                      onClick={toggleBuy}
                    >
                      <OnSignal active={buyActive} own={true} />
                      Buy Ticket
                    </Button>
                  )}

                  {id !== 0 && (
                    <Button
                      variant="exit"
                      className="rounded-full px-1 py-1 leading-10 h-12 w-full mt-4 text-2xl"
                      onClick={toggleExit}
                    >
                      <OnSignal active={exitActive} own={true} />
                      {ticketStatusString !== 'exited' && <div>Exit and claim ETH</div>}
                      {ticketStatusString === 'exited' && <div>You have exited</div>}
                    </Button>
                  )}

                  {id === 0 && !(phase === 'start' || phase === 'deployed') && (
                    <div className="text-center text-lg underline">
                      <a href={TWITTER_URL} target="_blank">
                        Follow for updates
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="hidden sm:flex">
              <UserActions />
            </div>
          </>
        </TabsContent>
        <TabsContent value="game" className="hidden sm:flex">
          <GameFeed />
        </TabsContent>
      </div>

      {showBuyModal && <Modal action={'buyTicket'} toggle={toggleBuy} />}
      {showExitModal && <Modal action={'exitGame'} toggle={toggleExit} />}
    </Tabs>
  )
}

export default GameTab
