import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import KeyTrackers from './KeyTrackers'
import { useTheme } from 'next-themes'
import { Button } from './button'
import { Gem, Users, Vote } from 'lucide-react'
import TicketUI from './TicketUI'
import { useStoreState } from '../../../store'
import { useAccount, useContractWrite, useContractReads } from 'wagmi'
import { GAME_ADDRESS, defaultContractObj } from '../../../services/constant'
import { scrollToTop, fetcher, formatNumber, transformToTicket } from '@/lib/utils'
import { formatUnits, parseUnits } from 'viem'
import useSWR from 'swr'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Ticket } from 'types/app'
import { ArrowUpToLine } from 'lucide-react'
import Countdown from './Countdown'

const TicketList = () => {
  const currentPot = useStoreState((state) => state.currentPot)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const voteCount = useStoreState((state) => state.voteCount)

  const playerTickets = useStoreState((state) => state.tickets)
  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const [ticketListState, setTicketListState] = useState<Ticket[]>([])
  const { xs } = useWindowSize()
  const hideImg = 'https://res.cloudinary.com/dn4hm5vfh/image/upload/v1705457550/last_192.png'

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
    <div className="">
      <summary
        className="list-none
        relative px-6 py-0 flex flex-col"
      >
        <div className="flex flex-col items-center 2xl:flex-row justify-between">
          <div className="grow">{xs ? '' : <KeyTrackers />}</div>

          {/* <div className="flex gap-2 justify-center my-0 sm:my-2">
            <Button
              onClick={() => toggleTab('aroundMe')}
              variant="filter"
              className="text-base sm:text-sm rounded-full h-8 px-3 py-1"
              disabled={ticketState === 'aroundMe'}
            >
              Around Me
            </Button>
            <Button
              onClick={() => toggleTab('inPlay')}
              variant="filter"
              className="text-base sm:text-sm rounded-full h-8 px-3 py-1"
              disabled={ticketState === 'inPlay'}
            >
              In Play
            </Button>

            <Button
              onClick={() => toggleTab('mostValue')}
              variant="filter"
              className="text-base sm:text-sm rounded-full h-8 px-3 py-1"
              disabled={ticketState === 'mostValue'}
            >
              Not In Play
            </Button>
            <Button
              onClick={() => toggleTab('safehouse')}
              variant="filter"
              className="text-base sm:text-sm rounded-full h-8 px-3 py-1"
              disabled={ticketState === 'safehouse'}
            >
              In Safehouse
            </Button>
          </div> */}
          <Countdown />
        </div>
      </summary>

      {totalTicketCount ? (
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
              <TicketUI
                key={item.id}
                ticketSize={xs ? 4 : 3}
                ticketNumber={item.id}
                ticket={item}
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center my-8">
          <div className="text-center my-2 text-lg sm:text-3xl">Knock knock</div>
          <Image
            priority
            src="/faces/hide.svg"
            className=""
            height={200}
            width={xs ? 150 : 250}
            alt="waiting-for-players"
          />
          <div className="text-center my-2 text-lg sm:text-3xl">No one is here</div>
        </div>
      )}
    </div>
  )
}

export default TicketList
