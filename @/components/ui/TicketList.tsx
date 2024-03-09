import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import TicketUI from './TicketUI'
import { useStoreState } from '../../../store'
import { useWindowSize } from '../../../hooks/useWindowSize'
import type { Ticket } from 'types/app'
import Countdown from './Countdown'
import Modal from '../ui/Modal'

const useStore = () => {
  const currentPot = useStoreState((state) => state.currentPot)
  const round = useStoreState((state) => state.round)
  const ticketCount = useStoreState((state) => state.ticketCount)
  const playerTickets = useStoreState((state) => state.tickets)

  return {
    currentPot,
    round,
    ticketCount,
    playerTickets,
  }
}

const TicketList = () => {
  const { round, ticketCount, playerTickets } = useStore()

  const [showPotModal, setShowPotModal] = React.useState<boolean>(false)
  const togglePot = () => setShowPotModal((prevState) => !prevState)

  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const [ticketListState, setTicketListState] = useState<Ticket[]>([])
  const { xs } = useWindowSize()

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
    } else {
      setTicketListState(playerTickets)
    }
  }

  return (
    <div className="">
      <summary className="px-6 py-2 flex justify-between items-center">
        <div>🍯 Pot 23 ETH</div>

        <Countdown />
        <div className="flex flex-row text-xl gap-6 items-center py-0 sm:pb-2 text-[#FCFDC7]">
          <div className="flash">
            🪜 Round <span className="font-digit">{round}</span>{' '}
          </div>
          <div className="flash">
            🎟️ Active <span className="font-digit">{ticketCount}</span>{' '}
          </div>
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
