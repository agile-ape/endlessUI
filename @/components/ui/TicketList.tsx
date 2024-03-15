import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import TicketUI from './TicketUI'
import { useStoreState } from '../../../store'
import { useWindowSize } from '../../../hooks/useWindowSize'
import type { Ticket } from 'types/app'
import Countdown from './Countdown'
import Modal from '../ui/Modal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Settings } from 'lucide-react'
const useStore = () => {
  const currentPot = useStoreState((state) => state.currentPot)
  const round = useStoreState((state) => state.round)
  const roundTime = useStoreState((state) => state.roundTime)
  const potFlag = useStoreState((state) => state.potFlag)
  const startingPassRate = useStoreState((state) => state.startingPassRate)
  const ticketPrice = useStoreState((state) => state.ticketPrice)
  const ticketIdCounter = useStoreState((state) => state.ticketIdCounter)

  const ticketCount = useStoreState((state) => state.ticketCount)
  const tickets = useStoreState((state) => state.tickets)

  return {
    currentPot,
    round,
    roundTime,
    potFlag,
    startingPassRate,
    ticketPrice,
    ticketIdCounter,
    ticketCount,
    tickets,
  }
}

const TicketList = () => {
  const {
    round,
    roundTime,
    potFlag,
    startingPassRate,
    ticketPrice,
    ticketIdCounter,
    ticketCount,
    tickets,
  } = useStore()

  const [showPotModal, setShowPotModal] = React.useState<boolean>(false)
  const togglePot = () => setShowPotModal((prevState) => !prevState)

  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const [ticketListState, setTicketListState] = useState<Ticket[]>([])
  const { xs } = useWindowSize()

  useEffect(() => {
    if (tickets.length) {
      setTicketListState(tickets)
    }
  }, [tickets])

  const totalTicketCount = ticketListState.length

  function toggleTab(tab: string) {
    setTicketState(tab)
    const nextTicketList = [...tickets]

    if (tab === 'inPlay') {
      const inPlayList = nextTicketList.filter((item) => item.isInPlay)
      setTicketListState(inPlayList)
    } else if (tab === 'mostValue') {
      const notInPlayList = nextTicketList.filter((item) => !item.isInPlay)
      setTicketListState(notInPlayList)
    } else {
      setTicketListState(tickets)
    }
  }

  return (
    <div className="">
      <summary className="px-6 py-2 flex justify-between items-center">
        <button onClick={togglePot} className="text-3xl hover:wiggle">
          <div className="relative flex items-start justify-center">
            <Image
              priority
              src="/logo/honeyPot.svg"
              className=""
              height={100}
              width={75}
              alt="honey-pot"
            />
            <p className="absolute top-3 text-3xl">
              <span className="font-digit text-[#FCFDC7] ">3.00</span>
            </p>
          </div>
        </button>
        <Countdown />
        <Popover>
          <PopoverTrigger>
            <Settings className="text-[#404833] hover:rotate-90 active:rotate-180" />
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            className="bg-slate-700 border border-slate-400/50 px-4 py-2"
          >
            <p className="font-digit text-center text-2xl">Game setting</p>
            {/* buyTicketDelay and feeShare for next time. and canBuyTicket. Everything they need for now is here  */}

            <div className="flex flex-col gap-2 justify-center text-xl">
              <p>
                Round: <span className="font-digit">{round}</span>
              </p>
              <p>
                Ticket price: <span className="font-digit">{ticketPrice}</span> ETH
              </p>
              <p>
                Round time: <span className="font-digit">{roundTime}</span> secs
              </p>
              <p>
                Pass rate: <span className="font-digit">{startingPassRate}</span> %
              </p>
              <p>
                Total joined: <span className="font-digit">{ticketIdCounter}</span>
              </p>
              <p>
                Still in play: <span className="font-digit">{ticketCount}</span>
              </p>
              <p>
                Pot at ticket: <span className="font-digit">{potFlag}</span>
              </p>
            </div>
          </PopoverContent>
        </Popover>
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
          {/* <div className="text-center my-2 text-lg sm:text-3xl">Knock knock</div> */}
          <Image
            priority
            src="/faces/hide.svg"
            className=""
            height={200}
            width={xs ? 150 : 250}
            alt="waiting-for-players"
          />
          {/* <div className="text-center my-2 text-lg sm:text-3xl">No one is here</div> */}
        </div>
      )}
      {showPotModal && <Modal action={'addPot'} toggle={togglePot} />}
    </div>
  )
}

export default TicketList
