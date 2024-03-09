import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import { useStoreActions, useStoreState } from '../../../store'

import GameFeed from './GameFeed'
import { useAccount } from 'wagmi'
import { GAME_ADDRESS, TWITTER_URL } from '../../../services/constant'
import Modal from './Modal'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/carousel'
import type { Ticket } from 'types/app'
import { useWindowSize } from '../../../hooks/useWindowSize'

const GameTab = () => {
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
  const toggleLoad = () => setShowLoadModal((prevState) => !prevState)

  const [showExitModal, setShowExitModal] = React.useState<boolean>(false)
  const toggleExit = () => setShowExitModal((prevState) => !prevState)

  const { address, isConnected } = useAccount()

  let ticket: Ticket | undefined = ownedTicket || {
    id: 0,
    player: address as `0x${string}`,
    isInPlay: false,
    value: 0,
    purchasePrice: 0,
    redeemValue: 0,
    potClaimCount: 0,
    passRate: 0,
    joinRound: 0,
    exitRound: 0,
    lastCount: 0,
  }

  // const yourTicketArray: Ticket[] = [tickets]

  return (
    <div className="flex justify-center w-[280px] mx-auto">
      <>
        {isConnected ? (
          <>
            <div className="mb-2">
              <p
                className="
              pb-2 \
              text-[36px] sm:text-[28px] \
              text-[#FCFDC7] \
              capitalized font-digit \
              text-center\
              flex justify-center"
              >
                Your Tickets
              </p>

              <div className="flex justify-center">
                <Carousel orientation="horizontal" className="w-full mx-auto">
                  <CarouselContent className="">
                    {/* {yourTicketArray.map((index) => (
                    <CarouselItem key={index} className="basis-1/4 justify-items-center">
                      <div className="flex items-center justify-center mx-auto"></div>
                    </CarouselItem>
                  ))} */}
                    <TicketUI ticketSize={2} ticketNumber={ticket.id} ticket={ticket} />
                  </CarouselContent>
                  <CarouselPrevious className="h-6 w-6 -left-[20px]" />
                  <CarouselNext className="h-6 w-6 -right-[20px]" />
                </Carousel>
              </div>

              <div className="flex justify-center">
                <div
                  className="w-[240px] rounded-xl px-2
                  container-last
                  flex flex-col my-6 relative"
                >
                  {/* <div className="bg-[#FCFC03]/80 rounded-md mt-2">
                    <Button
                      variant="primary"
                      className="p-1 h-12 w-full text-2xl shadow-sm
                      hover:-translate-y-1 hover:brightness-100
                  active:-translate-y-0 active:brightness-200"
                      onClick={toggleLoad}
                    >
                      🛡️ Load LAST
                    </Button>
                  </div> */}

                  <div className="bg-[#FCFC03]/80 rounded-md mt-4 mb-2">
                    <Button
                      variant="primary"
                      className="p-1 h-12 w-full text-2xl shadow-sm
                      hover:-translate-y-1 hover:brightness-100
                  active:-translate-y-0 active:brightness-200"
                      onClick={toggleExit}
                    >
                      🚪 Exit Game
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div
                  className="
              pb-2 \
              text-[36px] sm:text-[28px] \
              text-[#FCFDC7] \
              capitalized font-digit \
              text-center\
              flex justify-center"
                >
                  Ticket Log
                </div>
                <GameFeed />
              </div>
            </div>
          </>
        ) : (
          <div className="mb-4">
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="digit-last text-center px-10 py-1 leading-10 h-12 text-2xl">
                Not logged in
              </div>
              <Image
                priority
                src={`/faces/eatchips.svg`}
                height={110}
                width={150}
                className={`h-auto mt-0 mb-0`}
                alt={`guest pepe`}
              />
              <div className="text-center text-lg underline">
                <a href={TWITTER_URL} target="_blank">
                  Follow for updates
                </a>
              </div>
            </div>
          </div>
        )}
      </>

      {showLoadModal && <Modal action={'loadLast'} toggle={toggleLoad} />}
      {showExitModal && <Modal action={'exitGame'} toggle={toggleExit} />}
    </div>
  )
}

export default GameTab
