import React, { useState } from 'react'
import TicketCard from './TicketCard'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

type TicketListType = {
  stage: string
}

const TicketList: React.FC<TicketListType> = ({ stage }) => {
  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const fixedPurpleBg = ['dusk']

  return (
    <div className="">
      {/* collapsible */}
      <details
        className={`w-[85%] mx-auto border-[2px] ${
          fixedPurpleBg.includes(stage)
            ? 'bg-[#0D032D] border-[#36217A] text-white'
            : 'border-[#EBEBEB] bg-[#F6F6F6] dark:bg-[#1C1C1C] dark:border-[#444242] text-black dark:text-white'
        } shadow rounded-2xl group `}
      >
        <summary
          className="list-none flex items-center cursor-pointer
        focus-visible:outline-none focus-visible:ring
        rounded group-open:rounded-b-none group-open:z-[1] relative
        "
        >
          <div className="flex items-center grow text-sm">
            <h3 className="text-[2rem] p-4">
              TICKETS(23/199){' '}
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger>
                    <QuestionMarkCircledIcon className="w-[20px] h-[20px] text-white" />
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

          <div className="flex m-4">
            <div
              className={`border-8 border-transparent ${
                fixedPurpleBg.includes(stage)
                  ? 'border-l-white'
                  : 'border-l-black dark:border-l-white'
              } ml-2 group-open:ml-5 group-open:mb-1
              group-open:rotate-90 transition-transform origin-left
              `}
            ></div>
          </div>
        </summary>

        {/* detail collapsible */}
        <div className="px-4 pb-4 pt-2">
          <div className="flex gap-3 mt-3 ">
            <Button
              onClick={() => setTicketState('aroundMe')}
              className={`${ticketState === 'aroundMe' ? 'bg-black text-white' : 'bg-[#777777]'} `}
            >
              Around Me
            </Button>
            <Button
              onClick={() => setTicketState('mostValue')}
              className={`${ticketState === 'mostValue' ? 'bg-black text-white' : 'bg-[#777777]'}`}
            >
              Most Value
            </Button>
            <Button
              onClick={() => setTicketState('inPlay')}
              className={`${ticketState === 'inPlay' ? 'bg-black text-white' : 'bg-[#777777]'}`}
            >
              In Play
            </Button>
          </div>
          <div
            className="grid
          gap-x-1 gap-y-5
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6


          items-center place-items-center"
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
              <Button className="w-full mt-3 dark:text-white dark:hover:text-black">Check</Button>
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
              <Button className="w-full mt-3 dark:text-white dark:hover:text-black">Check</Button>
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
          </div>
        </div>
      </details>
    </div>
  )
}

export default TicketList
