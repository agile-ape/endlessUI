import React, { useState } from 'react'
import TicketCardOld from './_TicketCard'
import TicketCard from './TicketCard'
import AllPrize from './AllPrize'
import PrizeInfo from './_PrizeInfo'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'
import TicketUI from './TicketUI'
import { useStoreActions, useStoreState } from '../../../store'
import { useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import GameFeedButton from './_GameFeedButton'

type TicketListType = {
  stage: string
}

const TicketList: React.FC<TicketListType> = ({ stage }) => {
  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const phase = useStoreState((state) => state.phase)

  const ticketList = useStoreState((state) => state.tickets)

  const { data, write } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkTicket',
    onSuccess(data, variables, context) {
      console.log({ data })
    },
    onError(error, variables, context) {
      console.log({ error })
    },
  })

  return (
    <>
      <summary
        className="list-none
        relative px-3 py-0 flex flex-col"
      >
        <div className="flex">
          <div className="flex text-2xl items-center grow leading-7 capitalize py-2">
            Players
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
          </div>
          {/* <div className="flex px-2">
            <GameFeedButton />
          </div> */}

          <div className="flex gap-3 justify-center mt-2">
            <Button
              onClick={() => setTicketState('aroundMe')}
              variant="filter"
              className="text-sm rounded-full h-8 px-4 py-2"
              disabled={ticketState === 'aroundMe'}
              // className={`${
              //   ticketState === 'aroundMe'
              //     ? disabled
              //     : 'bg-neutral-500 text-white hover:bg-neutral-600'
              // } `}
            >
              Around Me
            </Button>
            <Button
              onClick={() => setTicketState('inPlay')}
              variant="filter"
              className="text-sm rounded-full h-8 px-4 py-2"
              disabled={ticketState === 'inPlay'}
              // className={`${
              //   ticketState === 'inPlay'
              //     ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
              //     : 'bg-neutral-500 text-white hover:bg-neutral-600'
              // }`}
            >
              In Play
            </Button>

            {/* exit or dead */}
            <Button
              onClick={() => setTicketState('mostValue')}
              variant="filter"
              className="text-sm rounded-full h-8 px-4 py-2"
              disabled={ticketState === 'mostValue'}
              // className={`${
              //   ticketState === 'mostValue'
              //     ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
              //     : 'bg-neutral-500 text-white hover:bg-neutral-600'
              // }`}
            >
              Not In Play
            </Button>
            <Button
              onClick={() => setTicketState('safehouse')}
              variant="filter"
              className="text-sm rounded-full h-8 px-4 py-2"
              disabled={ticketState === 'safehouse'}
              // className={`${
              //   ticketState === 'mostValue'
              //     ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
              //     : 'bg-neutral-500 text-white hover:bg-neutral-600'
              // }`}
            >
              In Safehouse
            </Button>
          </div>
        </div>
      </summary>

      <div
        className="
            flex
            w-[100%]
            justify-evenly
            sm:justify-start
            gap-x-6
            gap-y-6
            flex-wrap
            px-3
            overflow-y-scroll
          "
      >
        {ticketList.map((item, i) => (
          <div key={i} className="mt-[27px]">
            <TicketUI
              ownTicket={false}
              ticketId={BigInt(item.id)}
              ticketWidthPx={220}
              ticketLookInput={'beforePurchase'}
            />
            {/* <Button
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
            </Button> */}
          </div>
        ))}
      </div>
    </>
  )
}

export default TicketList
