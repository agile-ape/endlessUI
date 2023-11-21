import React, { useState } from 'react'
import Image from 'next/image'

import { Button } from './button'
import { Gem, Users } from 'lucide-react'
import TicketUI from './TicketUI'
import { useStoreState } from '../../../store'
import { useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { tokenConversion } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type TicketListType = {
  stage: string
}

const TicketList: React.FC<TicketListType> = ({ stage }) => {
  const [ticketState, setTicketState] = useState<string>('aroundMe') // default 'aroundMe'

  const ticketList = useStoreState((state) => state.tickets)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const ticketId = useStoreState((state) => state.ticketId)
  const currentPot = useStoreState((state) => state.currentPot)
  const totalPot = useStoreState((state) => state.totalPot)

  // const totalTicketCount = ticketId - 1
  const totalTicketCount = 2
  const totalPotConverted = totalPot / tokenConversion
  const currentPotConverted = currentPot / tokenConversion

  // const { data, write } = useContractWrite({
  //   ...defaultContractObj,
  //   functionName: 'checkTicket',
  //   onSuccess(data, variables, context) {
  //     console.log({ data })
  //   },
  //   onError(error, variables, context) {
  //     console.log({ error })
  //   },
  // })

  return (
    <>
      <summary
        className="list-none
        relative px-3 py-0 flex flex-col"
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex text-2xl gap-3 text-zinc-500 dark:text-zinc-200 items-center grow leading-7 capitalize py-2">
            <span className=""> Players</span>

            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Users size={18} className="mr-1" />
                    <div className="text-3xl text-amber-600 dark:text-amber-300 tracking-wide">
                      {ticketCount}
                    </div>
                    <span className="text-md">/{totalTicketCount}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1 max-w-[240px] text-sm">Players left / total joined</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Gem size={18} className="mr-1" />
                    <div className="text-3xl text-amber-600 dark:text-amber-300 tracking-wide">
                      {currentPotConverted}
                    </div>
                    <span className="text-md">/{totalPotConverted} </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1 max-w-[240px] text-sm">Pot left / total pot (in ETH)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                <HelpCircle
                    size={24}
                    className="align-end ml-1 stroke-slate-900 dark:stroke-slate-100"
                    />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                    Shows every ticket info and their status (
                      <span className="bg-purple-800 text-white rounded-xs">New</span>
                      {', '}
                    <span className="bg-green-800 text-white rounded-xs">Check-in</span>
                    {', '}
                    <span className="bg-blue-800 text-white rounded-xs">Checked</span>
                    {', '}
                    <span className="bg-gray-800 text-white rounded-xs">Left</span>).
                    <br />
                    Check others tickets here. Checks can only be done during the Night.
                    </p>
                    </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}
          {/* <div className="flex px-2">
            <GameFeedButton />
          </div> */}

          <div className="grid grid-cols-2 sm:flex gap-3 justify-center mt-2 mb-4">
            <Button
              onClick={() => setTicketState('aroundMe')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'aroundMe'}
            >
              Around Me
            </Button>
            <Button
              onClick={() => setTicketState('inPlay')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'inPlay'}
            >
              In Play
            </Button>

            {/* exit or dead */}
            <Button
              onClick={() => setTicketState('mostValue')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'mostValue'}
            >
              Not In Play
            </Button>
            <Button
              onClick={() => setTicketState('safehouse')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'safehouse'}
            >
              In Safehouse
            </Button>
          </div>
        </div>
      </summary>

      {!totalTicketCount && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center place-content-center">
            <div className="relative">
              <Image
                priority
                src="/pepe/sun.svg"
                className="place-self-center animate-pulse"
                height={300}
                width={300}
                alt="sneak-a-peek-pepe"
              />

              <div className="absolute top-[50px]">
                <Image
                  priority
                  src="/pepe/pepe-robe.svg"
                  className="place-self-center"
                  height={300}
                  width={300}
                  alt="sneak-a-peek-pepe"
                />
              </div>
            </div>
          </div>
          <div className="text-center my-4 text-2xl">We await patiently for our first warrior</div>
        </div>
      )}

      {totalTicketCount && (
        <div
          className="
            flex
            w-[100%]
            justify-evenly
            sm:justify-start
            gap-x-6
            gap-y-6
            flex-wrap
            px-6 py-6
            overflow-y-scroll max-h-[750px]
          "
        >
          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'beforePurchase'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'afterPurchase'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'submittedDay'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'stage1New'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'stage2New'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'stage3New'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'submittedNight'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'attackedButSafu'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'neverSubmit'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'inSafehouse'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'lastManStanding'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'agreedToSplitPot'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'noMorePot'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'killed'} />

          <TicketUI ownTicket={false} ticketNumber={2} ticketLookInput={'exitGame'} />

          {/*
        {ticketList.map((item, i) => (
          <div key={i} className="mt-[27px]">
            <TicketUI
              ownTicket={false}
              ticketId={BigInt(item.id)}
              ticketWidthPx={220}
              ticketLookInput={'beforePurchase'}
            />
            <Button
              onClick={() =>
                write({
                  args: [BigInt(item.id)],
                })
              }
              variant="inspect"
              // size="md"
              disabled={phase != 'night'}
              className="w-full h-10 rounded-xl px-3 leading-6 text-xl mt-3"
            >
              Inspect
            </Button>
          </div>
        ))}*/}
        </div>
      )}
    </>
  )
}

export default TicketList
