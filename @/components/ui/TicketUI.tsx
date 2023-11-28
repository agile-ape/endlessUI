// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import Image from 'next/image'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
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
  })

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [(playerAddress || '') as `0x${string}`],
    enabled: !!playerAddress,
  })

  let ticketId = playerTicket?.[0] || 0
  let ticketAddress = playerTicket?.[1] || 0
  let ticketSignature = playerTicket?.[2] || 0
  let ticketStatus = playerTicket?.[3] || 0
  let ticketLastSeen = playerTicket?.[4] || 0
  // let ticketIsInPlay = playerTicket?.[5] || 0
  let ticketIsInPlay = true
  let ticketVote = playerTicket?.[6] || 0
  let ticketValue = Number(playerTicket?.[7]) || 0
  let ticketPurchasePrice = playerTicket?.[8] || 0
  let ticketPotClaim = playerTicket?.[9] || 0
  let ticketRedeemValue = playerTicket?.[10] || 0
  // let ticketAttacks = Number(playerTicket?.[11]) || 0
  let ticketAttacks = Number(3)
  let ticketAttackCount = playerTicket?.[12] || 0
  let ticketKillCount = playerTicket?.[13] || 0
  let ticketKilledBy = playerTicket?.[14] || 0
  let ticketSafehouseNights = playerTicket?.[15] || 0
  let ticketcheckOutRound = playerTicket?.[16] || 0
  let ticketBuddy = playerTicket?.[17] || 0
  let ticketBuddyCount = playerTicket?.[18] || 0
  // let ticketRank = playerTicket?.[19] || 0
  let ticketRank = 123

  const phase = useStoreState((state) => state.phase)
  // const phase = 'countdown'

  // const round = useStoreState((state) => state.round)
  const round = 0

  // const round = useStoreState((state) => state.nextTicketPrice)
  const nextTicketPrice = 2

  // const nextTicketId = useStoreState((state) => state.ticketId)
  const nextTicketId = 2

  // const statusPayload: Record<number, IApp['ticketStatus']> = {
  //   0: 'new',
  //   1: 'submitted',
  //   2: 'checked',
  //   3: 'safe',
  //   4: 'dead',
  //   5: 'exited',
  // }

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  let ticketLook: string

  // case of phase !="countdown" && ticketId == 0 is covered in GameTab
  if (phase === 'countdown') {
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

  const ticketLookTest = ticketLook

  const conversion = Number(10 ** 15)

  const getTicketLook = (ticketLookTest) => {
    switch (ticketLookTest) {
      case 'beforePurchase':
        return {
          bgImage: 'burst',
          header: 'bg-zinc-300/20',
          face: 'enter',
          id: nextTicketId,
          status: 'next ticket',
          label: 'bounty',
          value: ' - ',
        }
      case 'afterPurchase':
        return {
          bgImage: 'rainbow',
          header: 'bg-zinc-300/20',
          face: 'happy',
          id: ticketId,
          status: 'ticket claimed',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'submittedDay':
        return {
          bgImage: 'motif',
          header: 'bg-zinc-300/70',
          face: 'handsup',
          id: ticketId,
          status: 'submitted',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'stage1New':
        return {
          bgImage: 'rainbow',
          header: 'bg-zinc-300/20',
          face: 'confident',
          id: ticketId,
          status: 'ready to submit word',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'stage2New':
        return {
          bgImage: 'rainbow',
          header: 'bg-zinc-300/20',
          face: 'worried',
          id: ticketId,
          status: 'ready to submit word',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'stage3New':
        return {
          bgImage: 'rainbow',
          header: 'bg-zinc-300/20',
          face: 'anxious',
          id: ticketId,
          status: 'ready to submit word',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'submittedNight':
        return {
          bgImage: 'motif',
          header: 'bg-zinc-300/70',
          face: 'attack',
          id: ticketId,
          status: 'time to attack',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'attackedButSafu':
        return {
          bgImage: 'combine',
          header: 'bg-zinc-300/80',
          face: 'pray',
          id: ticketId,
          status: 'SAFU',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'neverSubmit':
        return {
          bgImage: 'rainbow',
          header: 'bg-zinc-300/20',
          face: 'attack',
          id: ticketId,
          status: 'time to attack',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'inSafehouse':
        return {
          bgImage: 'safeOverlay',
          header: 'bg-zinc-100/50',
          face: 'warm',
          id: ticketId,
          status: 'taking a break',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'lastManStanding':
        return {
          bgImage: 'burst',
          header: 'bg-zinc-300/20',
          face: 'king',
          id: ticketId,
          status: 'last man standing',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'agreedToSplitPot':
        return {
          bgImage: 'burst',
          header: 'bg-zinc-300/20',
          face: 'beers',
          id: ticketId,
          status: 'WAGMI',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'noMorePot':
        return {
          bgImage: 'burst',
          header: 'bg-zinc-300/20',
          face: 'watchitburn',
          id: ticketId,
          status: 'let it burn',
          label: 'bounty',
          value: ticketValue / conversion + ' ETH',
        }
      case 'killed':
        return {
          bgImage: 'deadOverlay',
          header: 'bg-zinc-400/40',
          face: 'angry',
          id: ticketId,
          status: 'killed',
          label: 'rank',
          value: ticketRank,
        }
      case 'exitGame':
        return {
          bgImage: '',
          header: 'bg-zinc-200/20',
          face: 'exit',
          id: ticketId,
          status: 'exited',
          label: 'rank',
          value: ticketRank,
        }
    }
  }

  const { bgImage, header, face, id, status, label, value } = getTicketLook(ticketLookTest)

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
      className={`flex flex-col mx-auto relative justify-center shadow-xl ${size} ${edge}`}
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
        /*--
            <div
              className={` w-[${ticketWidthPx}px] h-[100%] rounded-xl -ml-[2px] opacity-80 mx-auto flex justify-center items-center`}
            >
              {/* <div className="mx-auto rounded-xl grid items-center justify-center gap-6 p-2">
              <div className="capitalized text-base leeading-tight">Status: Submitted</div>
            */
        <div
          className={`flex flex-col mx-auto gap-x-2 ${gap} px-4 ${h2} justify-center h-[100%] w-[100%] ${header} shadow-xl text-center ${edge} text-black`}
        >
          {/* <div className="flex justify-between gap-6">
                <p className="text-left"> Status</p>
                <p className="text-right"> Submitted</p>
              </div> */}

          <div className="flex justify-between gap-6">
            <p className="text-left"> Player</p>
            <p className="text-right"> {formatAddress(ticketAddress)} </p>
          </div>

          {/* <div className="flex justify-between gap-6">
                <p className="text-left">Last Seen</p>
                <p className="text-right underline"> 7 </p>
              </div> */}

          <div className="flex justify-between gap-6">
            <p className="text-left">Attacks/Kills</p>
            <p className="text-right"> 10/3 </p>
          </div>

          {/* <div className="flex justify-between gap-6">
                <p className="text-left">Bought for</p>
                <p className="text-right">
                {' '}
                7<span className="text-[0.5rem]">ETH</span>
                </p>
              </div> */}

          {/* <div className="flex justify-between gap-6">
                <p className="text-left">Total kills</p>
                <p className="text-right"> 10 </p>
              </div> */}

          <div className="flex justify-between gap-6">
            <p className="text-left">Last Seen/Vote</p>
            <p className="text-right">
              {' '}
              <span className="underline">1</span>/No{' '}
            </p>
          </div>

          {/* <div className="flex justify-between gap-6">
                <p className="text-left">Killed by </p>
                <p className="text-right"> - </p>
              </div> */}

          <div className="flex justify-between gap-6">
            <p className="text-left">Safe nights </p>
            <p className="text-right"> 20 </p>
          </div>

          <div className="flex justify-between gap-6">
            <p className="text-left">Buddy/Bud Count </p>
            <p className="text-right"> -/3</p>
          </div>

          {/* <div className="flex justify-between gap-6">
                <p className="text-left">Buddy Count</p>
                <p className="text-right"> 1 </p>
              </div> */}

          {ticketLookTest == 'inSafehouse' && (
            <div className="flex justify-between text-lg text-amber-600  gap-6">
              <p className="text-left">Check out by</p>
              <p className="text-right underline"> 10</p>
            </div>
          )}

          {(ticketLookTest == 'exitGame' || ticketLookTest == 'killed') && (
            <div className="flex justify-between gap-6">
              <p className="text-left">Killed By</p>
              <p className="text-right"> #7</p>
            </div>
          )}

          {ticketLookTest == 'exitGame' && (
            <div className="flex justify-between gap-6">
              <p className="text-left">Exited with</p>
              <p className="text-right">
                {' '}
                7<span className="text-[0.5rem]">ETH</span>
              </p>
            </div>
          )}

          {!(
            ownTicket == true ||
            ticketLookTest == 'inSafehouse' ||
            ticketLookTest == 'killed' ||
            ticketLookTest == 'exitGame'
          ) && <Attack id={ticketId} />}

          {ownTicket == false && ticketLookTest == 'inSafehouse' && <KickOut id={ticketId} />}
          {ownTicket == true && ticketLookTest == 'inSafehouse' && <CheckOut />}
        </div>
      )}

      {/* default */}
      {!isOverlayInspect && (
        <>
          {/* {!ownTicket && ticketLookTest == 'killed' && (
            <div
              className="absolute top-0 left-0 h-full w-full"
              style={{
                backgroundImage: `url('/ticket/deadOverlay.svg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            ></div>
          )} */}
          {/* {!ownTicket && ticketLookTest == 'exitGame' && (
            <div
              className="absolute top-0 left-0 h-full w-full"
              style={{
                backgroundImage: `url('/ticket/exitOverlay.svg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            ></div>
          )} */}
          {/* top header */}
          <div className={`${header} shadow-xl text-center m-2 rounded-lg text-black`}>
            <p className={`uppercase ${h1} leading-tight`}>
              Player{' '}
              <span className="font-whitrabt">
                {' '}
                <span className={h2}>#{id}</span>
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
              // fill={true}
              // sizes="max-width:150px"
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
          {(ticketLookTest == 'killed' || ticketLookTest == 'exitGame') && (
            <div className="flex justify-center font-whitrabt text-xl mt-3 mb-2 items-end bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
              {/* <div className={`capitalize ${h3} leading-tight mr-1`}>{label}</div> */}
              <div className={`uppercase font-semibold tracking-wider ${h1}`}>
                {label} {value}
              </div>
            </div>
          )}
          {/* not killed or exitGame */}
          {!(ticketLookTest == 'killed' || ticketLookTest == 'exitGame') && (
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
