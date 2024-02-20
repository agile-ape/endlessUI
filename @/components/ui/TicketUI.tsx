// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import type { IApp, Ticket } from 'types/app'
import Image from 'next/image'
import { useAccount, useEnsName } from 'wagmi'
import { defaultContractObj, BLOCK_EXPLORER } from '../../../services/constant'
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
import { usePrivy, useLogin, useLogout, useWallets } from '@privy-io/react-auth'

import AttackNew from './AttackNew'
import { AttackActive } from './AttackNew'

import KickOutNew from './KickOutNew'
import { KickOutActive } from './KickOutNew'

import CheckOut from './_CheckOut'
import KickOut from './_KickOut'
import { useWindowSize } from '../../../hooks/useWindowSize'
import Modal from './Modal'
import { Button } from './button'
import OnSignal from './OnSignal'
import { toast } from './use-toast'
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

const getTicketSize = (ticketSize) => {
  switch (ticketSize) {
    case 1:
      return {
        size: 'w-[260px] h-[280px]',
        edge: 'rounded-xl',
        h1: 'text-2xl',
        h2: 'text-xl',
        h3: 'text-base',
        imgh: '140',
        imgw: '180',
        mt: 'mt-0 mb-0',
        gap: '',
      }
    case 2:
      return {
        size: 'w-[220px] h-[240px]',
        edge: 'rounded-xl',
        h1: 'text-xl',
        h2: 'text-xl',
        h3: 'text-sm',
        imgh: '110',
        imgw: '150',
        mt: 'mt-0 mb-0',
        gap: '',
      }
    case 3:
      return {
        size: 'w-[160px] h-[180px]',
        edge: 'rounded-md',
        h1: 'text-md',
        h2: 'text-sm',
        h3: 'text-xs',
        imgh: '75',
        imgw: '95',
        mt: 'mt-0 mb-2',
        gap: '',
      }
  }
}

const TicketUI: FC<TicketUIType> = ({ ticketSize, ticketNumber, ticket, ticketLookOverwrite }) => {
  // set overlay
  const [isOverlayInspect, setIsOverlayInspect] = React.useState<boolean>(false)
  const playerTickets = useStoreState((state) => state.tickets)
  const stage = useStoreState((state) => state.stage)
  const lastChangedTicket = useStoreState((state) => state.lastChangedTicket)
  const { xs } = useWindowSize()
  const { user, connectWallet, ready, authenticated } = usePrivy()

  const activeAttack = AttackActive()
  const activeKickOut = KickOutActive()

  // const attackActive = AttackActive()
  const [showAttackModal, setShowAttackModal] = React.useState<boolean>(false)
  const toggleAttack = () => setShowAttackModal((prevState) => !prevState)

  const [showKickOutModal, setShowKickOutModal] = React.useState<boolean>(false)
  const toggleKickOut = () => setShowKickOutModal((prevState) => !prevState)

  const handleOnMouseEnter: MouseEventHandler = () => {
    setIsOverlayInspect(true)
  }

  const handleOnMouseLeave: MouseEventHandler = () => {
    setIsOverlayInspect(false)
  }

  const toggleOverlayInspect = () => {
    setIsOverlayInspect(!isOverlayInspect)
  }

  const { address } = useAccount()

  const { data: ensName } = useEnsName({
    address: ticket?.user,
    chainId: 1,
  })

  // const playerTicket = data?.[0].result || BigInt(0)
  const nextTicketId = ticket?.id || 0
  // const suddenDeath = data?.[0].result || 0

  let ticketId = ticket?.id
  let ticketAddress = ticket?.user

  // let ticketSignature = playerTicket?.[2] || 0
  let ticketStatus = ticket?.status
  let ticketLastSeen = Number(ticket?.lastSeen || 0)
  let ticketIsInPlay = Boolean(ticket?.isInPlay || 0)
  // let ticketIsInPlay = true
  let ticketVote = Boolean(ticket?.vote || 0)
  let ticketValue = Number(ticket?.value) || 0
  let ticketPurchasePrice = ticket?.purchasePrice || 0
  let ticketPotClaim = ticket?.potClaim || 0
  let ticketRedeemValue = ticket?.redeemValue || 0
  // used
  let ticketAttacks = Number(ticket?.attacks) || 0

  let ticketAttackCount = Number(ticket?.attackCount || 0)
  let ticketKillCount = Number(ticket?.killCount || 0)
  let ticketKilledBy = ticket?.killedBy || 0
  let ticketSafehouseNights = ticket?.safehouseNights || 0
  let ticketcheckOutRound = Number(ticket?.checkOutRound || 0)
  let ticketBuddy = ticket?.buddy || 0
  let ticketBuddyCount = ticket?.buddyCount || 0
  let ticketRank = Number(ticket?.rank || 0)

  let ticketVoteString = ticketId ? (ticketVote ? 'Yes' : 'No') : '-'

  const valueBought = ticketPurchasePrice
  const valueRedeemed = ticketRedeemValue

  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)

  const totalTicketCount = playerTickets.length

  const quartile = (ticketRank / totalTicketCount) * 100

  const ticketStatusString: string = statusPayload[ticketStatus] || 'unknown'

  /*-------------------------------------- STANDALONE VARIATION -----------------------------------*/

  /*
  let rankColor: string
  if (quartile < 25) {
    rankColor = 'bg-black'
  } else if (quartile < 50) {
    // rankColor = 'bg-gradient-to-r from-orange-800 via-amber-900 to-yellow-950'
    rankColor = 'bg-gradient-to-r from-orange-500 via-amber-600 to-yellow-700'
  } else if (quartile < 75) {
    rankColor = 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500'
  } else if (quartile <= 100) {
    rankColor = 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500'
  }
  */

  // user input size
  const { size, edge, h1, h2, h3, imgh, imgw, mt, gap } = getTicketSize(ticketSize)

  const swords = Array.from({ length: ticketAttacks }).map((_, index) => (
    <Sword key={index} size={16} className="text-black"></Sword>
  ))

  /*-------------------------------------- TICKET LOOK -----------------------------------*/
  let ticketLook: string

  if (phase === 'deployed') {
    ticketLook = 'beforePurchase'
  }

  if (phase === 'start') {
    if (ticketId === 0) {
      ticketLook = 'beforePurchase'
    } else if (ticketId != 0) {
      ticketLook = 'afterPurchase'
    }
  }

  if (!(phase === 'start' || phase === 'deployed') && ticketId === 0) {
    ticketLook = 'notPlaying'
  }

  if (ticketIsInPlay) {
    if (phase == 'day') {
      if (ticketStatusString == 'submitted' && ticketLastSeen == round) {
        ticketLook = 'submittedDay'
      } else if (ticketVote === true) {
        ticketLook = 'makePeace'
      } else {
        if (stage === 1) {
          ticketLook = 'stage1New'
        } else if (stage === 2) {
          ticketLook = 'stage2New'
        } else if (stage === 3) {
          ticketLook = 'stage3New'
        }
      }
    }

    if (phase == 'night') {
      if (ticketStatusString == 'submitted' && ticketLastSeen == round) {
        ticketLook = 'submittedNight'
      } else if (ticketStatusString == 'checked' && ticketLastSeen == round) {
        ticketLook = 'attackedButSafu'
      } else {
        ticketLook = 'neverSubmit'
      }
    }

    if (ticketStatusString === 'safe') {
      ticketLook = 'inSafehouse'
    }

    if (phase === 'lastManFound') {
      ticketLook = 'lastManStanding'
    }

    if (phase === 'peaceFound') {
      ticketLook = 'agreedToSplitPot'
    }

    if (phase === 'drain') {
      ticketLook = 'noMorePot'
    }

    if (phase === 'start') {
      ticketLook = 'afterPurchase'
    }
  }

  if (!ticketIsInPlay) {
    if (ticketStatusString == 'dead') {
      ticketLook = 'killed'
    }

    if (ticketStatusString == 'exited') {
      ticketLook = 'exitGame'
    }
  }

  if (!ticketLook && !ticketIsInPlay) {
    return null
  }

  let ticketLookFinal: string
  ticketLookFinal = ticketLookOverwrite ?? ticketLook

  const ticketLookMapping = {
    // ticket in play
    beforePurchase: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20 text-black',
      face: 'copium',
      id: '-',
      status: 'prepare to enter arena',
      label: 'ticket value',
      value: ' - ETH',
    },
    afterPurchase: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20 text-black',
      face: 'happy',
      id: ticketId,
      status: 'a warrior enters',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },

    submittedDay: {
      bgImage: 'motif',
      header: 'bg-zinc-300/70 text-black',
      face: 'handsup',
      id: ticketId,
      status: 'received Pepe Protection',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    makePeace: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20 text-black',
      face: 'prettyplease',
      id: ticketId,
      status: 'i fight for peace',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    stage1New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20 text-black',
      face: 'confident',
      id: ticketId,
      status: 'nice and slow',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    stage2New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20 text-black',
      face: 'worried',
      id: ticketId,
      status: 'fight or flight?',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    stage3New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20 text-black',
      face: 'anxious',
      id: ticketId,
      status: 'do we all lose?',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    submittedNight: {
      bgImage: 'motif',
      header: 'bg-zinc-300/70 text-black',
      face: 'attack',
      id: ticketId,
      status: 'attack the unprotected',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    attackedButSafu: {
      bgImage: 'combine',
      header: 'bg-zinc-300/80 text-black',
      face: 'pray',
      id: ticketId,
      status: 'pepe protects thee',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    neverSubmit: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20 text-black',
      face: 'attack',
      id: ticketId,
      status: 'unprotected thee are',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    inSafehouse: {
      bgImage: 'safeOverlay',
      header: 'bg-zinc-100/50 text-black',
      face: 'warm',
      id: ticketId,
      status: 'taking a break',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    lastManStanding: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20 text-black',
      face: 'lastman',
      id: ticketId,
      status: 'the last man stands',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    agreedToSplitPot: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20 text-black',
      face: 'beers',
      id: ticketId,
      status: 'WAGMI i guess?',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    noMorePot: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20 text-black',
      face: 'watchitburn',
      id: ticketId,
      status: 'let it all burn',
      label: 'ticket value',
      value: ticketValue + ' ETH',
    },
    // not in play
    guest: {
      bgImage: '',
      header: 'text-black dark:text-white',
      face: 'eatchips',
      id: '',
      status: 'login to play',
      label: 'ticket value',
      value: '- ETH',
    },
    notPlaying: {
      bgImage: '',
      header: 'text-black dark:text-white',
      face: 'sad',
      id: '',
      status: 'feeling fomo?',
      label: 'ticket value',
      value: '- ETH',
    },
    killed: {
      bgImage: 'deadOverlay',
      header: 'text-black dark:text-white',
      face: 'angry',
      id: ticketId,
      status: 'vengeance in my next life',
      label: 'rank',
      value: ticketRank,
    },
    exitGame: {
      bgImage: '',
      header: 'text-black dark:text-white',
      face: 'exit',
      id: ticketId,
      status: 'to fight another day',
      label: 'rank',
      value: ticketRank,
    },
  }

  const { bgImage, header, face, id, status, label, value } = ticketLookMapping[ticketLookFinal]

  function copyAddress() {
    copyToClipboard(ticketAddress || '')
    toast({
      variant: 'success',
      title: 'Address copied',
      description: 'Address copied to clipboard',
    })
  }

  return (
    <div
      className={`flex flex-col wiggle  mx-auto relative justify-center shadow-xl ${size} ${edge} ${
        ticket.id === lastChangedTicket ? 'triggered-wiggle' : ''
      }`}
      style={{
        backgroundImage: bgImage ? `url('/ticket/${bgImage}.svg')` : 'none', // different for true
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onClick={() => {
        if (window.innerWidth < 640) {
          toggleOverlayInspect()
        }
      }}
    >
      {/* overlay */}
      {isOverlayInspect && (
        <div
          className={`flex flex-col mx-auto gap-x-2 ${gap} px-4 ${h2} justify-center h-[100%] w-[100%] ${header} shadow-xl text-center ${edge}`}
        >
          <div className="flex justify-between gap-6">
            <p className="text-left"> User</p>
            <p className="text-right italic flex justify-center items-center">
              <a
                className="hover:underline"
                href={`${BLOCK_EXPLORER}address/${ticketAddress}`}
                target="_blank"
              >
                {ensName ? ensName : formatAddress(ticketAddress)}
              </a>{' '}
              <span onClick={copyAddress}>
                <Copy size={12} className="ml-1 cursor-pointer" />
              </span>
            </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Attacks/Kills</p>
            <p className="text-right">
              {' '}
              {formatCount(ticketAttackCount)}/{formatCount(ticketKillCount)}{' '}
            </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Seen/Vote</p>
            <p className="text-right">
              {' '}
              <span className="underline decoration-double">{formatCount(ticketLastSeen)}</span>/
              <span className={cn(ticketVoteString === 'Yes' ? 'text-green-500' : 'text-red-900')}>
                {ticketVoteString}
              </span>{' '}
            </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Safe nights </p>
            <p className="text-right"> {formatCount(ticketSafehouseNights)} </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Bud/Bud Count </p>
            <p className="text-right">
              {' '}
              #{formatCount(ticketBuddy)}/{formatCount(ticketBuddyCount)}
            </p>
          </div>

          {ticketLookFinal == 'inSafehouse' && (
            <div className={`${h2} flex justify-between text-lg text-amber-600 gap-6`}>
              <p className="text-left">Check out by</p>
              <p className="text-right underline"> {ticketcheckOutRound}</p>
            </div>
          )}

          {(ticketLookFinal == 'exitGame' || ticketLookFinal == 'killed') && (
            <div className={`${h2} flex justify-between gap-6`}>
              <p className="text-left">Killed By</p>
              <p className="text-right"> #{formatCount(ticketKilledBy)}</p>
            </div>
          )}

          {ticketLookFinal == 'exitGame' && (
            <>
              <div className={`${h2} flex justify-between gap-6`}>
                <p className="text-left">Bought for</p>
                <p className="text-right">
                  {' '}
                  {/* {ticketRedeemValue} */}
                  {formatNumber(valueBought, {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
                  <span className="text-[0.5rem]">ETH</span>
                </p>
              </div>

              <div className={`${h2} flex justify-between gap-6`}>
                <p className="text-left">Exited with</p>
                <p className="text-right">
                  {' '}
                  {/* {ticketRedeemValue} */}
                  {formatNumber(valueRedeemed, {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
                  <span className="text-[0.5rem]">ETH</span>
                </p>
              </div>
            </>
          )}

          {!(
            ticketSize === 1 ||
            ticketSize === 2 ||
            ticketLookFinal == 'inSafehouse' ||
            ticketLookFinal == 'killed' ||
            ticketLookFinal == 'exitGame' ||
            xs
          ) && (
            <Button
              variant="attack"
              className="w-full py-1 text-lg h-8 mt-2"
              onClick={toggleAttack}
            >
              <OnSignal active={activeAttack} own={false} />
              <Sword size={20} className="text-orange-50 mr-1" />
              Attack
            </Button>
          )}

          {ticketSize === 3 && ticketLookFinal == 'inSafehouse' && !xs && (
            <Button
              variant="kickOut"
              className="w-full py-1 text-lg h-8 rounded-md"
              onClick={toggleKickOut}
            >
              <OnSignal active={activeKickOut} own={false} />
              <Axe size={20} className="text-orange-50 mr-1" />
              Kick Out
            </Button>
          )}
        </div>
      )}

      {/* default */}
      {!isOverlayInspect && (
        <>
          {/* top header */}
          {ticketSize === 3 && address?.toLowerCase() === ticket?.user && (
            <div className="text-sm bg-gradient-to-r from-orange-500 to-amber-500 rounded-full motion-safe:animate-bounce w-max mx-auto px-3 absolute inset-x-0 -top-3 h-5">
              Hello there
            </div>
          )}

          <div className={`${header} shadow-xl text-center m-2 rounded-lg`}>
            <p className={`uppercase ${h1} leading-tight`}>
              {ticketLookFinal === 'guest' ? (
                <span className="block"> Guest </span>
              ) : ticketLookFinal === 'notPlaying' ? (
                <span className="block"> Not In Game </span>
              ) : (
                <>
                  Player{' '}
                  <span className="font-digit">
                    {' '}
                    <span className={h2}>#{String(id)}</span>
                  </span>
                </>
              )}
            </p>
            <p className={`lowercase ${h3} italic`}>{status}</p>
          </div>
          {/* image */}
          <div className="flex justify-center">
            <Image
              priority
              src={`/faces/${face}.svg`}
              height={imgh}
              width={imgw}
              className={`h-auto ${mt}`}
              // layout="fixed"
              alt={`${face} pepe`}
            />
          </div>
          {/* need a mapping to list ticketAttacks */}
          {(ticketSize === 1 || ticketSize === 2) && ticketIsInPlay == true && (
            <div className="flex flex-row-reverse mx-3 ">{swords}</div>
          )}
          {/* rank */}
          {(ticketLookFinal == 'killed' || ticketLookFinal == 'exitGame') && (
            <div
              // className={`flex justify-center font-digit text-xl mt-3 mb-2 items-end ${rankColor} text-transparent bg-clip-text`}
              className={`flex justify-center font-digit text-xl mt-3 mb-2 items-end`}
            >
              {/* <div className={`capitalize ${h3} leading-tight mr-1`}>{label}</div> */}
              <div className={`uppercase font-semibold tracking-wider ${h1}`}>
                {label} {value}
              </div>
            </div>
          )}
          {/* not killed or exitGame */}
          {!(ticketLookFinal == 'killed' || ticketLookFinal == 'exitGame') && (
            <div className={`${header} shadow-xl text-center m-2 mt-0 rounded-lg text-black`}>
              <div className={`capitalize ${h3} opacity-50 leading-tight`}>{label}</div>
              <div className={`uppercase font-digit ${h1}`}>{value}</div>
            </div>
          )}
        </>
      )}

      {showAttackModal && <Modal action={'attack'} toggle={toggleAttack} id={Number(ticketId)} />}
      {showKickOutModal && (
        <Modal action={'kickOut'} toggle={toggleKickOut} id={Number(ticketId)} />
      )}
    </div>
  )
}

export default TicketUI
