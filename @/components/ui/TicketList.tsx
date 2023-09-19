import React, { useState } from 'react'
import TicketCardOld from './_TicketCard'
import TicketCard from './TicketCard'
import AllPrize from './AllPrize'
import PrizeInfo from './PrizeInfo'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'
import TicketUI from './TicketUI'

type TicketListType = {
  stage: string
}

const TicketList: React.FC<TicketListType> = ({ stage }) => {
  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const fixedPurpleBg = ['dusk']

  return (
    <>
      <summary
        className="list-none border-b-2 border-slate-400 dark:border-slate-100
        rounded relative px-3 flex flex-col md:flex-row items-center"
      >
        <div className="flex items-center text-[2rem] pb-4 pt-2  grow leading-7 capitalize">
          Tickets(233/1212){' '}
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle
                  size={24}
                  className="align-end stroke-slate-900 dark:stroke-slate-100"
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                  (Tickets left/ Total tickets)
                  <br />
                  Shows every ticket info and their status (
                  <span className="bg-purple-800 text-white rounded-xs">New</span>
                  {', '}
                  <span className="bg-green-800 text-white rounded-xs">Check-in</span>
                  {', '}
                  <span className="bg-blue-800 text-white rounded-xs">Checked</span>
                  {', '}
                  <span className="bg-gray-800 text-white rounded-xs">Left</span>).
                  <br />
                  Check others tickets here.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2 px-2 pb-4 pt-2">
          <Button
            onClick={() => setTicketState('aroundMe')}
            variant="filter"
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
            onClick={() => setTicketState('mostValue')}
            variant="filter"
            disabled={ticketState === 'mostValue'}
            // className={`${
            //   ticketState === 'mostValue'
            //     ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
            //     : 'bg-neutral-500 text-white hover:bg-neutral-600'
            // }`}
          >
            Most Value
          </Button>
          <Button
            onClick={() => setTicketState('inPlay')}
            variant="filter"
            disabled={ticketState === 'inPlay'}
            // className={`${
            //   ticketState === 'inPlay'
            //     ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
            //     : 'bg-neutral-500 text-white hover:bg-neutral-600'
            // }`}
          >
            In Play
          </Button>
        </div>
      </summary>

      <div
        className="
            flex
            w-[100%]
            justify-evenly
            gap-x-5
            flex-wrap
            max-h-[800px]
            px-3 gap-y-1
            overflow-y-scroll
          "
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="mt-[27px]">
            <TicketUI ticketId={BigInt(1)} />
            <Button variant="check" size="md" className="w-full mt-3">
              Check
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}

export default TicketList
