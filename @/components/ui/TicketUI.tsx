// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import Image from 'next/image'
import { useAccount, useContractRead, useContractReads, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { formatUnits } from 'viem'
import { cn, formatAddress, statusPayload } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStoreActions, useStoreState } from '../../../store'
import { Sword, Skull, DoorOpen, Trophy } from 'lucide-react'
import { Button } from './button'
import Attack from './Attack'
import CheckOut from './CheckOut'
import KickOut from './KickOut'

type TicketUIType = {
  ownTicket: boolean
  ticketNumber: IApp['id']
  ticketLookInput: string
}

const getTicketSize = (ownTicket) => {
  switch (ownTicket) {
    case true:
      return {
        size: 'w-[220px] h-[240px]',
        edge: 'rounded-xl',
        h1: 'text-xl',
        h2: 'text-md',
        h3: 'text-sm',
        imgh: '110',
        imgw: '150',
        mt: 'mt-0 mb-0',
        gap: 'gap-y-1',
      }
    case false:
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

const TicketUI: FC<TicketUIType> = ({ ownTicket, ticketNumber, ticketLookInput }) => {
  // set overlay
  const [isOverlayInspect, setIsOverlayInspect] = React.useState<boolean>(false)
  const handleOnMouseEnter: MouseEventHandler = () => {
    setIsOverlayInspect(true)
  }

  const handleOnMouseLeave: MouseEventHandler = () => {
    setIsOverlayInspect(false)
  }

  // hooks
  const { data: playerAddress } = useContractRead({
    ...defaultContractObj,
    functionName: 'idToPlayer',
    args: [ticketNumber],
    enabled: !!ticketNumber,
  })

  // const { data: playerTicket } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'playerTicket',
  //   args: [(playerAddress || '') as `0x${string}`],
  //   enabled: !!playerAddress,
  // })

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'playerTicket',
        args: [(playerAddress || '') as `0x${string}`],
        enabled: !!playerAddress,
      },
      {
        ...defaultContractObj,
        functionName: 'ticketId',
      },
      {
        ...defaultContractObj,
        functionName: 'suddenDeath',
      },
    ],
  })

  const playerTicket = data?.[0].result || BigInt(0)
  const nextTicketId = data?.[1].result || BigInt(0)
  const suddenDeath = data?.[2].result || BigInt(0)

  // used
  let ticketId = playerTicket?.[0] || 0
  // used
  let ticketAddress = playerTicket?.[1] || 0

  let ticketSignature = playerTicket?.[2] || 0
  let ticketStatus = playerTicket?.[3] || 0
  let ticketLastSeen = playerTicket?.[4] || 0
  // let ticketIsInPlay = playerTicket?.[5] || 0
  let ticketIsInPlay = true
  let ticketVote = Boolean(playerTicket?.[6] || 0)
  let ticketValue = Number(playerTicket?.[7]) || 0
  let ticketPurchasePrice = playerTicket?.[8] || 0
  let ticketPotClaim = playerTicket?.[9] || 0
  let ticketRedeemValue = playerTicket?.[10] || 0
  // used
  let ticketAttacks = Number(playerTicket?.[11]) || 0

  let ticketAttackCount = playerTicket?.[12] || 0
  let ticketKillCount = playerTicket?.[13] || 0
  let ticketKilledBy = playerTicket?.[14] || 0
  let ticketSafehouseNights = playerTicket?.[15] || 0
  let ticketcheckOutRound = playerTicket?.[16] || 0
  let ticketBuddy = playerTicket?.[17] || 0
  let ticketBuddyCount = playerTicket?.[18] || 0
  // let ticketRank = playerTicket?.[19] || 0
  let ticketRank = 123

  let ticketVoteString: string
  ticketVote === false ? (ticketVoteString = 'No') : (ticketVoteString = 'Yes')

  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)

  // const suddenDeath = useStoreState((state) => state.suddenDeath)

  // const nextTicketId = useStoreState((state) => state.ticketId)

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  let ticketLook: string

  // case of phase !="countdown" && ticketId == 0 is covered in GameTab

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

  if (ticketIsInPlay) {
    if (phase == 'day') {
      if (ticketStatusString == 'submit' && ticketLastSeen == round) {
        ticketLook = 'submittedDay'
      } else {
        if (round < suddenDeath) {
          ticketLook = 'stage1New'
        } else if (round >= suddenDeath && round < drainStart) {
          ticketLook = 'stage2New'
        } else if (round >= suddenDeath && round >= drainStart) {
          ticketLook = 'stage3New'
        }
      }
    }

    if (phase == 'night') {
      if (ticketStatusString == 'submit' && ticketLastSeen == round) {
        ticketLook = 'submittedNight'
      } else if (ticketStatusString == 'checked') {
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

  const { size, edge, h1, h2, h3, imgh, imgw, mt, gap } = getTicketSize(ownTicket)

  const ticketLookFinal = ticketLookInput || ticketLook

  const conversion = Number(10 ** 15) // remember to check this

  const ticketLookMapping = {
    beforePurchase: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20',
      face: 'enter',
      id: nextTicketId,
      status: 'next ticket',
      label: 'value',
      value: ' - ETH',
    },
    afterPurchase: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'happy',
      id: ticketId,
      status: 'ticket claimed',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    submittedDay: {
      bgImage: 'motif',
      header: 'bg-zinc-300/70',
      face: 'handsup',
      id: ticketId,
      status: 'submitted',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    stage1New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'confident',
      id: ticketId,
      status: 'ready to submit word',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    stage2New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'worried',
      id: ticketId,
      status: 'ready to submit word',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    stage3New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'anxious',
      id: ticketId,
      status: 'ready to submit word',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    submittedNight: {
      bgImage: 'motif',
      header: 'bg-zinc-300/70',
      face: 'attack',
      id: ticketId,
      status: 'time to attack',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    attackedButSafu: {
      bgImage: 'combine',
      header: 'bg-zinc-300/80',
      face: 'pray',
      id: ticketId,
      status: 'SAFU',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    neverSubmit: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'attack',
      id: ticketId,
      status: 'time to attack',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    inSafehouse: {
      bgImage: 'safeOverlay',
      header: 'bg-zinc-100/50',
      face: 'warm',
      id: ticketId,
      status: 'taking a break',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    lastManStanding: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20',
      face: 'lastman',
      id: ticketId,
      status: 'last man standing',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    agreedToSplitPot: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20',
      face: 'beers',
      id: ticketId,
      status: 'WAGMI',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    noMorePot: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20',
      face: 'watchitburn',
      id: ticketId,
      status: 'let it burn',
      label: 'value',
      value: ticketValue / conversion + ' ETH',
    },
    killed: {
      bgImage: 'deadOverlay',
      header: 'bg-zinc-400/40',
      face: 'angry',
      id: ticketId,
      status: 'killed',
      label: 'rank',
      value: ticketRank,
    },
    exitGame: {
      bgImage: '',
      header: 'bg-zinc-200/20',
      face: 'exit',
      id: ticketId,
      status: 'exited',
      label: 'rank',
      value: ticketRank,
    },
  }

  const { bgImage, header, face, id, status, label, value } = ticketLookMapping[ticketLookFinal]

  const gradientStyle = {
    background: 'linear-gradient(to right, #ff00cc, #3333cc)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block',
  }

  const swords = Array.from({ length: ticketAttacks }).map((_, index) => (
    <Sword key={index} size={16} className="text-black"></Sword>
  ))

  return (
    <div
      className={`flex flex-col border-rainbow mx-auto relative justify-center shadow-xl ${size} ${edge}`}
      style={{
        backgroundImage: `url('/ticket/${bgImage}.svg')`, // different for true
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {/* overlay */}
      {isOverlayInspect && (
        <div
          className={`flex flex-col mx-auto gap-x-2 ${gap} px-4 ${h2} justify-center h-[100%] w-[100%] ${header} shadow-xl text-center ${edge} text-black`}
        >
          <div className="flex justify-between gap-6">
            <p className="text-left"> Player</p>
            <p className="text-right"> {formatAddress(ticketAddress)} </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Attacks/Kills</p>
            <p className="text-right">
              {' '}
              {ticketAttackCount}/{ticketKillCount}{' '}
            </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Last Seen/Vote</p>
            <p className="text-right">
              {' '}
              <span className="underline">{ticketLastSeen}</span>/{ticketVoteString}{' '}
            </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Safe nights </p>
            <p className="text-right"> {ticketSafehouseNights} </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Buddy/Bud Count </p>
            <p className="text-right">
              {' '}
              #{ticketBuddy}/{ticketBuddyCount}
            </p>
          </div>

          {ticketLookFinal == 'inSafehouse' && (
            <div className="flex justify-between text-lg text-amber-600  gap-6">
              <p className="text-left">Check out by</p>
              <p className="text-right underline"> {ticketcheckOutRound}</p>
            </div>
          )}

          {(ticketLookFinal == 'exitGame' || ticketLookFinal == 'killed') && (
            <div className="flex justify-between gap-6">
              <p className="text-left">Killed By</p>
              <p className="text-right"> #{ticketKilledBy}</p>
            </div>
          )}

          {ticketLookFinal == 'exitGame' && (
            <div className="flex justify-between gap-6">
              <p className="text-left">Exited with</p>
              <p className="text-right">
                {' '}
                {ticketRedeemValue}
                <span className="text-[0.5rem]">ETH</span>
              </p>
            </div>
          )}

          {!(
            ownTicket == true ||
            ticketLookFinal == 'inSafehouse' ||
            ticketLookFinal == 'killed' ||
            ticketLookFinal == 'exitGame'
          ) && <Attack id={ticketId} />}

          {ownTicket == false && ticketLookFinal == 'inSafehouse' && <KickOut id={ticketId} />}
          {ownTicket == true && ticketLookFinal == 'inSafehouse' && <CheckOut />}
        </div>
      )}

      {/* default */}
      {!isOverlayInspect && (
        <>
          {/* top header */}
          <div className={`${header} shadow-xl text-center m-2 rounded-lg text-black`}>
            <p className={`uppercase ${h1} leading-tight`}>
              Player{' '}
              <span className="font-whitrabt">
                {' '}
                <span className={h2}>#{String(id)}</span>
              </span>
            </p>
            <p className={`lowercase ${h3} italic text-zinc-700 dark:text-zinc-800`}>{status}</p>
          </div>
          {/* image */}
          <div className="flex justify-center">
            <Image
              priority
              src={`/faces/${face}.png`}
              height={imgh}
              width={imgw}
              className={mt}
              layout="fixed"
              alt={`${face} pepe`}
            />
          </div>
          {/* need a mapping to list ticketAttacks */}
          {ownTicket && ticketIsInPlay == true && (
            <div className="flex flex-row-reverse mx-3 ">{swords}</div>
          )}
          {/* rank */}
          {(ticketLookFinal == 'killed' || ticketLookFinal == 'exitGame') && (
            <div className="flex justify-center font-whitrabt text-xl mt-3 mb-2 items-end bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
              {/* <div className={`capitalize ${h3} leading-tight mr-1`}>{label}</div> */}
              <div className={`uppercase font-semibold tracking-wider ${h1}`}>
                {label} {value}
              </div>
            </div>
          )}
          {/* not killed or exitGame */}
          {!(ticketLookFinal == 'killed' || ticketLookFinal == 'exitGame') && (
            <div className={`${header} shadow-xl text-center m-2 mt-0 rounded-lg text-black`}>
              <div className={`capitalize ${h3} text-zinc-600 dark:text-zinc-800 leading-tight`}>
                {label}
              </div>
              <div className={`uppercase font-whitrabt ${h1}`}>{value}</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TicketUI
