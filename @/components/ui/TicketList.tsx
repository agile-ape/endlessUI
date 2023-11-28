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
  const phase = useStoreState((state) => state.phase)

  const ticketList = useStoreState((state) => state.tickets)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const ticketId = useStoreState((state) => state.ticketId)
  const currentPot = useStoreState((state) => state.currentPot)
  const totalPot = useStoreState((state) => state.totalPot)

  const totalTicketCount = ticketList.length
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
                    {/* <Image
                      priority
                      src="/logo/diamondEth.svg"
                      className=""
                      height={18}
                      width={18}
                      alt="sneak-a-peek-pepe"
                    /> */}
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

      {phase === 'deployed' && (
        <>
          <div className="flex flex-col justify-center">
            <div className="text-center mt-4 text-2xl">Recap of ticket looks</div>
          </div>

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
            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'beforePurchase'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'afterPurchase'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'stage1New'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'stage2New'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'stage3New'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'submittedDay'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'submittedNight'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'attackedButSafu'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'inSafehouse'} />

            {/* <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'neverSubmit'} /> */}

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'killed'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'exitGame'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'lastManStanding'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'agreedToSplitPot'} />

            <TicketUI ownTicket={false} ticketNumber={0} ticketLookInput={'noMorePot'} />
          </div>
        </>
      )}

      {phase !== 'deployed' && (
        <div>
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
              <div className="text-center my-4 text-2xl">
                We await patiently for our first warrior
              </div>
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
              {ticketList.map((item, i) => (
                <TicketUI
                  key={item.id}
                  ownTicket={false}
                  ticketNumber={item.id}
                  ticketLookInput={'afterPurchase'}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default TicketList
