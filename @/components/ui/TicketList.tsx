import React, { useState } from 'react'
import TicketCardOld from './_TicketCard'
import TicketCard from './TicketCard'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'

type TicketListType = {
  stage: string
}

const TicketList: React.FC<TicketListType> = ({ stage }) => {
  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const fixedPurpleBg = ['dusk']

  return (
    <div
      className="rounded-2xl py-2
      bg-slate-300 bg-opacity-50
      dark:lg:bg-slate-500 dark:lg:bg-opacity-50
    "
    >
      <summary
        className="list-none flex flex-col md:flex-row items-center
        border-b-2 border-slate-400 dark:border-slate-100
        rounded relative px-3
        "
      >
        <div className="flex items-center grow text-sm">
          <h3 className="flex items-center text-[2rem] pb-4 pt-2 leading-7 capitalize">
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
          </h3>
        </div>

        {/* detail collapsible */}
        {/* <div className="px-4 pb-4 pt-2"> */}
        <div className="flex gap-3 px-4 pb-4 pt-2">
          <Button
            onClick={() => setTicketState('aroundMe')}
            className={`${
              ticketState === 'aroundMe'
                ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
                : 'bg-neutral-500 text-white hover:bg-neutral-600'
            } `}
          >
            Around Me
          </Button>
          <Button
            onClick={() => setTicketState('mostValue')}
            className={`${
              ticketState === 'mostValue'
                ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
                : 'bg-neutral-500 text-white hover:bg-neutral-600'
            }`}
          >
            Most Value
          </Button>
          <Button
            onClick={() => setTicketState('inPlay')}
            className={`${
              ticketState === 'inPlay'
                ? 'bg-neutral-800 text-white hover:bg-neutral-800 cursor-default'
                : 'bg-neutral-500 text-white hover:bg-neutral-600'
            }`}
          >
            In Play
          </Button>
        </div>
      </summary>

      <div
        className="
            flex
            w-[100%]
            lg:justify-start
            justify-evenly
            gap-x-5
            flex-wrap
            max-h-[800px]
            px-3 gap-y-1
            overflow-y-scroll
          "
      >
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#0B2D03B2]'
            bgColorSubtract="#0B2D03B2"
            bgValue="bg-[#0C2D1DE5]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#8100D0]'
            bgColorSubtract="#0B012B"
            bgValue="bg-[#360057CC]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" disabled className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#4C69FF]'
            bgColorSubtract="rgba(13, 3, 45, 0.80)"
            bgValue="bg-[#0D0C2D]"
            isFinished
            ticketLastSeen={4}
            ticketNumber={5}
            ticketValue={23}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777] ">Check</Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#0B2D03B2]'
            bgColorSubtract="#0B2D03B2"
            bgValue="bg-[#0C2D1DE5]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#8100D0]'
            bgColorSubtract="#0B012B"
            bgValue="bg-[#360057CC]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" disabled className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#4C69FF]'
            bgColorSubtract="rgba(13, 3, 45, 0.80)"
            bgValue="bg-[#0D0C2D]"
            isFinished
            ticketLastSeen={4}
            ticketNumber={5}
            ticketValue={23}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777] ">Check</Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#0B2D03B2]'
            bgColorSubtract="#0B2D03B2"
            bgValue="bg-[#0C2D1DE5]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#8100D0]'
            bgColorSubtract="#0B012B"
            bgValue="bg-[#360057CC]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" disabled className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#4C69FF]'
            bgColorSubtract="rgba(13, 3, 45, 0.80)"
            bgValue="bg-[#0D0C2D]"
            isFinished
            ticketLastSeen={4}
            ticketNumber={5}
            ticketValue={23}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777] ">Check</Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#0B2D03B2]'
            bgColorSubtract="#0B2D03B2"
            bgValue="bg-[#0C2D1DE5]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#8100D0]'
            bgColorSubtract="#0B012B"
            bgValue="bg-[#360057CC]"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="md" disabled className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px] w-[236px]">
          <TicketCard
            bgCard='bg-[#4C69FF]'
            bgColorSubtract="rgba(13, 3, 45, 0.80)"
            bgValue="bg-[#0D0C2D]"
            isFinished
            ticketLastSeen={4}
            ticketNumber={5}
            ticketValue={23}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777] ">Check</Button>
        </div>
      </div>
      {/* </div> */}
      {/* </details> */}
    </div>
  )
}

export default TicketList
