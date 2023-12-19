import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from './button'
import { Gem, Users, Vote } from 'lucide-react'
import TicketUI from './TicketUI'
import { useStoreState } from '../../../store'
import { useAccount, useContractWrite, useContractReads, useContractEvent } from 'wagmi'
import { LAST_MAN_STANDING_ADDRESS, defaultContractObj } from '../../../services/constant'
import { fetcher, formatNumber, transformToTicket } from '@/lib/utils'
import { formatUnits, parseUnits } from 'viem'
import useSWR from 'swr'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Ticket } from 'types/app'

const TicketList = () => {
  const currentPot = useStoreState((state) => state.currentPot)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const voteCount = useStoreState((state) => state.voteCount)

  const playerTickets = useStoreState((state) => state.tickets)
  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const [ticketListState, setTicketListState] = useState<Ticket[]>([])

  const { forcedTheme } = useTheme()

  useEffect(() => {
    if (playerTickets.length) {
      setTicketListState(playerTickets)
    }
  }, [playerTickets])

  const totalTicketCount = ticketListState.length

  function toggleTab(tab: string) {
    setTicketState(tab)
    const nextTicketList = [...playerTickets]

    if (tab === 'inPlay') {
      const inPlayList = nextTicketList.filter((item) => item.isInPlay)
      setTicketListState(inPlayList)
    } else if (tab === 'mostValue') {
      const notInPlayList = nextTicketList.filter((item) => !item.isInPlay)
      setTicketListState(notInPlayList)
    } else if (tab === 'safehouse') {
      const safehouseList = nextTicketList.filter((item) => item.isInPlay && item.status === 3)
      setTicketListState(safehouseList)
    } else {
      setTicketListState(playerTickets)
    }
  }

  return (
    <>
      <summary
        className="list-none
        relative px-6 py-0 flex flex-col"
      >
        <div className="flex flex-col items-center md:flex-row">
          <div className="flex text-2xl gap-3 text-zinc-500 dark:text-zinc-200 items-center grow leading-7 capitalize py-2">
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    {forcedTheme === 'dark' ? (
                      <Image
                        priority
                        src="/logo/eth-dark.png"
                        className="mr-1"
                        height={14}
                        width={14}
                        alt="eth"
                      />
                    ) : (
                      <Image
                        priority
                        src="/logo/eth-gradient.png"
                        className="mr-1"
                        height={14}
                        width={14}
                        alt="eth"
                      />
                    )}
                    <div className="text-3xl flash text-purple-900 dark:text-purple-300 tracking-wide">
                      {currentPot}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1 max-w-[240px] text-sm">Value in Pot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Users size={24} className="mr-1" />
                    <div className="text-3xl flash tracking-wide">{ticketCount}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1 max-w-[240px] text-sm">Players left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Vote size={24} className="mr-1" />
                    <div className="text-3xl flash tracking-wide">{voteCount}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1 max-w-[240px] text-sm">Yes votes.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-3 justify-center my-2">
            <Button
              onClick={() => toggleTab('aroundMe')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'aroundMe'}
            >
              Around Me
            </Button>
            <Button
              onClick={() => toggleTab('inPlay')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'inPlay'}
            >
              In Play
            </Button>

            <Button
              onClick={() => toggleTab('mostValue')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'mostValue'}
            >
              Not In Play
            </Button>
            <Button
              onClick={() => toggleTab('safehouse')}
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
        <div className="flex flex-col justify-center items-center my-8">
          <Image
            priority
            src="/pepe/waiting.png"
            className=""
            height={400}
            width={250}
            alt="waiting-for-players"
          />
          <div className="text-center my-2 text-3xl">We await our first challenger...</div>
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
            overflow-y-scroll
          "
        >
          {ticketListState
            .sort((a, b) => a.id - b.id)
            .map((item, i) => (
              <TicketUI key={item.id} ownTicket={false} ticketNumber={item.id} ticket={item} />
            ))}
        </div>
      )}
    </>
  )
}

export default TicketList
