// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import type { IApp, Ticket, Event } from 'types/app'
import Image from 'next/image'

import { useAccount, useContractRead, useEnsName } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import {
  cn,
  formatAddress,
  formatShortAddress,
  formatCount,
  formatNumber,
  copyToClipboard,
  statusPayload,
} from '@/lib/utils'
import { useStoreState } from '../../../store'
import Attack from './_Attack'
// import { usePrivy, useLogin, useLogout, useWallets } from '@privy-io/react-auth'

import AttackNew from './AttackNew'
import { AttackActive } from './AttackNew'

import KickOutNew from './KickOutNew'
import { KickOutActive } from './KickOutNew'

import CheckOut from './_CheckOut'
import KickOut from './_KickOut'
import { useWindowSize } from '../../../hooks/useWindowSize'
import Modal from './Modal'
import { Button } from './button'
import OnSignal from './_OnSignal'
import { toast } from '../shadcn/use-toast'
import Roll from './Roll'
import Exit from './Exit'
import {
  User,
  Menu,
  MenuSquare,
  Link2,
  Unlink2,
  Rss,
  Users,
  Clock,
  Monitor,
  Target,
  Info,
  Move,
  ChevronDown,
  ChevronUp,
  Send,
  Split,
  LogIn,
  LogOut,
  Dices,
  Gift,
  Copy,
  Ticket,
  Sword,
  Axe,
} from 'lucide-react'

type TicketUIType = {
  ticketSize: number
  ticketNumber: IApp['id']
  ticket?: Ticket
  ticketLength?: number
}

// case 1 and 2 = profile; case 3 and 4 = ticket list
const getTicketSize = (ticketSize) => {
  switch (ticketSize) {
    case 1:
      return {
        size: 'w-[200px] h-[240px]',
        edge: 'rounded-xl',
        h1: 'text-2xl',
        h2: 'text-base',
        h3: 'text-xl',
        imgh: '120',
        imgw: '140',
        mt: 'mt-0 mb-0',
      }
    case 2:
    case 4:
      return {
        size: 'w-[220px] h-[240px]',
        edge: 'rounded-xl',
        h1: 'text-xl',
        h2: 'text-sm',
        h3: 'text-xl',
        imgh: '110',
        imgw: '150',
        mt: 'mt-0 mb-0',
      }
    case 3:
      return {
        size: 'w-[160px] h-[180px]',
        edge: 'rounded-md',
        h1: 'text-md',
        h2: 'text-xs',
        h3: 'text-xl',
        h4: 'text-md',
        imgh: '85',
        imgw: '95',
        mt: 'mt-0 mb-2',
      }
  }
}

const useStore = () => {
  const round = useStoreState((state) => state.round)
  const events = useStoreState((state) => state.events)
  const lastChangedTicket = useStoreState((state) => state.lastChangedTicket)
  return {
    round,
    events,
    lastChangedTicket,
  }
}

const TicketUI: FC<TicketUIType> = ({ ticketSize, ticketNumber, ticket, ticketLookOverwrite }) => {
  const { round, events, lastChangedTicket } = useStore()

  // const [eventList, setEventList] = useState<Event[]>([])

  const [isOverlayInspect, setIsOverlayInspect] = React.useState<boolean>(false)

  // const handleOnClick: MouseEventHandler = () => {
  //   setIsOverlayInspect(!isOverlayInspect)
  // }

  const handleOnMouseEnter: MouseEventHandler = () => {
    setIsOverlayInspect(true)
  }

  const handleOnMouseLeave: MouseEventHandler = () => {
    setIsOverlayInspect(false)
  }

  const toggleOverlayInspect = () => {
    setIsOverlayInspect(!isOverlayInspect)
  }

  const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
  const toggleLoad = () => setShowLoadModal((prevState) => !prevState)

  const { address, isConnected } = useAccount()

  const { data: idArray } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerToIdArray',
  })

  /*-------------------------------------- TICKET LOOK -----------------------------------*/

  let ticketId = ticket?.id
  let ticketPlayer = ticket?.player
  let ticketIsInPlay = ticket?.isInPlay
  let ticketValue = ticket?.value
  let ticketPurchasePrice = ticket?.purchasePrice
  let ticketRedeemValue = ticket?.redeemValue
  let ticketPotClaimCount = ticket?.potClaimCount
  let ticketPassRate = 10
  let ticketJoinRound = ticket?.joinRound
  let ticketExitRound = ticket?.exitRound
  let ticketLogs: string[] = [...ticket?.logs]

  // let ticketLastCount = ticket?.lastCount

  // const eventList = [...events]
  // const ticketEvents: Event[] = eventList.filter((item) => item.id === ticketId)

  // const ticketEvents = ['NewTicketBought', 'ValuePassed', 'ValueReceive', 'PhaseChange']
  // compute nextPassRate
  // TODOs: check for other conditions - lastman. no one alive behind, exited...
  // let nextPassRate: number

  // if (!ticketIsInPlay || ticketLastCount >= ticketPassRate) {
  //   nextPassRate = 0
  // } else {
  //   nextPassRate = ticketPassRate - ticketLastCount
  // }

  // ticketLook
  let ticketLook: string

  if (ticketIsInPlay) {
    if (ticketJoinRound == round) {
      ticketLook = 'justJoined'
    }

    if (ticketJoinRound < round && ticketValue < ticketPurchasePrice) {
      ticketLook = 'inLoss'
    }

    if (ticketJoinRound < round && ticketValue >= ticketPurchasePrice) {
      ticketLook = 'inProfit'
    }

    if (ticketId == potFlag) {
      ticketLook = 'holdPot'
    }

    if (ticketId < potFlag) {
      ticketLook = 'passPot'
    }
  } else {
    ticketLook = 'exitGame'
  }

  let ticketLookFinal: string
  // ticketLookFinal = ticketLookOverwrite ?? ticketLook
  ticketLookFinal = 'holdPot'

  const ticketLookMapping = {
    justJoined: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20 text-black',
      blinker: 'opacity-80 text-[#FCFDC7] border-[#FCFDC7] bg-[#404833]',
      back: 'text-black',
      face: 'enter',
      id: ticketId,
      passRate: ticketPassRate,
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },

    inProfit: {
      bgImage: 'motif',
      header: 'bg-zinc-300/20 text-black',
      blinker: 'opacity-80 text-[#FCFDC7] border-[#FCFDC7] bg-[#404833]',
      back: 'text-black',
      face: 'happy',
      id: ticketId,
      passRate: ticketPassRate,
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },

    inLoss: {
      bgImage: 'motif',
      header: 'bg-zinc-300/20 text-black',
      blinker: 'opacity-80 text-[#FCFDC7] border-[#FCFDC7] bg-[#404833]',
      back: 'text-black',
      face: 'worried',
      id: ticketId,
      passRate: ticketPassRate,
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },

    holdPot: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20 text-black',
      blinker: 'opacity-80 text-[#FCFDC7] border-[#FCFDC7] bg-[#404833]',
      back: 'text-black',
      face: 'surprised',
      id: ticketId,
      passRate: ticketPassRate,
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },

    passPot: {
      bgImage: 'safeOverlay',
      header: 'opacity-60 bg-zinc-300/20 text-black',
      blinker: 'opacity-80 text-[#FCFDC7] border-[#FCFDC7] bg-[#404833]',
      back: 'text-black',
      face: 'warm',
      id: ticketId,
      passRate: ticketPassRate,
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },

    exitGame: {
      bgImage: '',
      header: 'opacity-80 text-[#FCFDC7]',
      blinker: 'opacity-80 text-[#FCFC03] border-[#FCFC03]',
      back: 'text-white',
      face: 'exit',
      id: ticketId,
      passRate: ticketPassRate,
      label: 'exit value',
      value: ticketRedeemValue + ' ETH',
    },
  }

  const { bgImage, header, blinker, face, id, passRate, label, value, back } =
    ticketLookMapping[ticketLookFinal]

  const { size, edge, h1, h2, h3, h4, imgh, imgw, mt, gap } = getTicketSize(ticketSize)

  return (
    <div className="flex justify-center">
      {/* Ticket card */}
      <div
        className={`flex flex-col wiggle mx-auto relative justify-center cursor-pointer shadow-xl ${size} ${edge} ${
          ticket.id === lastChangedTicket ? 'triggered-wiggle' : ''
        }`}
        style={{
          backgroundImage: bgImage ? `url('/ticket/${bgImage}.svg')` : 'none', // different for true
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        // onClick={() => handleOnClick()}
      >
        {/* back shows the logs */}
        {isOverlayInspect ? (
          <>
            {ticketLogs?.map((item) => (
              <div
                key={item}
                className="flex flex-col justify-between py-1
          border-b-[1px] border-dotted border-zinc-600 dark:border-zinc-300"
              >
                {item}
              </div>
            ))}
          </>
        ) : (
          <>
            {/* top header */}
            {/* TODOS - ADJUST TO PULL ID FROM ARRAY */}
            {ticketSize === 3 && address?.toLowerCase() === ticket?.user && (
              <div className="text-sm bg-gradient-to-r from-orange-500 to-amber-500 rounded-full motion-safe:animate-bounce w-max mx-auto px-3 absolute inset-x-0 -top-3 h-5">
                Hello there
              </div>
            )}

            <div
              className={`${h1} ${header} font-digit text-center uppercase shadow-xl m-2 rounded-lg`}
            >
              🎟 TICKET {String(id)}
            </div>
            {/* main image */}
            <div className="flex flex-row items-start justify-center my-2">
              <Image
                priority
                src={`/faces/${face}.svg`}
                height={imgh}
                width={imgw}
                className={`h-auto ${mt}`}
                alt={`${face} pepe`}
              />
              <div className={`${blinker} font-digit text-3xl px-1 border shadow-xl`}>
                {ticketPassRate}
              </div>
            </div>
            {/* ticket value */}
            <div
              className={cn(
                ticketLookFinal === 'exitGame' ? 'opacity-70' : '',
                `${header} ${edge} shadow-xl text-center m-2 mt-0`,
              )}
            >
              <div className={`capitalize ${h2} opacity-80 leading-tight`}>{label}</div>
              <div className={`uppercase font-digit ${h3}`}>{value}</div>
            </div>
          </>
        )}
      </div>

      {/* User buttons */}

      <Roll id={ticket.id} />
      <Exit id={ticket.id} />
    </div>
  )
}

export default TicketUI
