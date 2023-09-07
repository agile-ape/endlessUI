import React, { useState } from 'react'
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

        {/* <div className="flex m-4">
            <div
              className={`border-8 border-transparent ${
                fixedPurpleBg.includes(stage)
                  ? 'border-l-white'
                  : 'border-l-black dark:border-l-white'
              } ml-2 group-open:ml-5 group-open:mb-1
              group-open:rotate-90 transition-transform origin-left
              `}
            ></div>
          </div> */}

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
        className="grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-6
            3xl:grid-cols-7
            4xl:grid-cols-8
            5xl:grid-cols-9
            6xl:grid-cols-10
            7xl:grid-cols-11
            8xl:grid-cols-12
            9xl:grid-cols-13

            max-h-[800px]
            gap-x-1 gap-y-1
            items-center place-items-center
            overflow-y-scroll
          "
      >
        <div className="w-[139.5px]">
          <div className="uppercase px-4 py-1 rounded-xl bg-[#084E0B] text-white text-center w-[70%] mx-auto text-[12px] relative top-4 border-[1px] border-[#209902]">
            Your Ticket
          </div>

          <TicketCard
            linearGradientCard="#084E0B"
            borderColor="#209902"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="lg" className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="linear-gradient(140deg, #0D032D 0%, #1E1049 100%)"
            borderColor="linear-gradient(140deg, #534CFFB2 0%, #534CFF26 100%)"
            isFinished={false}
            ticketLastSeen={4}
            ticketNumber={3}
            ticketValue={0.057}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button variant="check" size="lg" disabled className="w-full mt-3">
            Check
          </Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="linear-gradient(140deg, #B18A00 0%, #E9C655 51.56%, #B18A00 77.60%)"
            borderColor="#FFCE31"
            isFinished
            ticketLastSeen={4}
            ticketNumber={5}
            ticketValue={23}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777] ">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>

        <div className="mt-[27px]">
          <TicketCard
            linearGradientCard="#363636"
            borderColor="#C2C2C2"
            isFinished
            ticketLastSeen={4}
            ticketNumber={6}
            ticketValue={133}
            ticketBullets={10}
            ticketKillCount={10}
          />
          <Button className="w-full mt-3 bg-[#3C3C3C] text-[#777777]">Check</Button>
        </div>
      </div>
      {/* </div> */}
      {/* </details> */}
    </div>
  )
}

export default TicketList
