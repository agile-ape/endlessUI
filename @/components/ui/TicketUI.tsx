// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import Image from 'next/image'
import {
  useAccount,
  useContractRead,
  useContractEvent,
  useContractReads,
  useContractWrite,
  useEnsName,
} from 'wagmi'
import { defaultContractObj, BLOCK_EXPLORER } from '../../../services/constant'
import { formatUnits } from 'viem'
import { cn, formatAddress, formatCount, formatNumber, statusPayload } from '@/lib/utils'
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
  // ticketLookInput: string
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

const TicketUI: FC<TicketUIType> = ({ ownTicket, ticketNumber }) => {
  // set overlay
  const [isOverlayInspect, setIsOverlayInspect] = React.useState<boolean>(false)
  const handleOnMouseEnter: MouseEventHandler = () => {
    setIsOverlayInspect(true)
  }

  const handleOnMouseLeave: MouseEventHandler = () => {
    setIsOverlayInspect(false)
  }

  // update to safehouse
  useContractEvent({
    ...defaultContractObj,
    eventName: 'CheckIntoSafehouse',
    listener: (event) => {
      const args = event[0]?.args
      const { caller, checkOutDate, time } = args

      if (Number(caller) === ticketNumber) {
        refetch()
      }
      console.log({ args })
    },
  })

  // hooks
  const { data: playerAddress } = useContractRead({
    ...defaultContractObj,
    functionName: 'idToPlayer',
    args: [BigInt(ticketNumber)],
    enabled: !!ticketNumber,
    cacheTime: 5_000,
  })

  const { data: ensName } = useEnsName({
    address: playerAddress,
    chainId: 1,
  })

  // console.log({ ensName })

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
        args: [playerAddress as `0x${string}`],
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
    cacheTime: 2_000,
  })

  const playerTicket = data?.[0].result || BigInt(0)
  const nextTicketId = Number(data?.[1].result || BigInt(0))
  const suddenDeath = data?.[2].result || BigInt(0)

  // used
  let ticketId = playerTicket?.[0] || 0
  // used
  let ticketAddress = playerTicket?.[1] || 0

  let ticketSignature = playerTicket?.[2] || 0
  let ticketStatus = playerTicket?.[3] || 0
  let ticketLastSeen = Number(playerTicket?.[4] || 0)
  let ticketIsInPlay = Boolean(playerTicket?.[5] || 0)
  // let ticketIsInPlay = true
  let ticketVote = Boolean(playerTicket?.[6] || 0)
  let ticketValue = Number(playerTicket?.[7]) || 0
  let ticketPurchasePrice = playerTicket?.[8] || 0
  let ticketPotClaim = playerTicket?.[9] || 0
  let ticketRedeemValue = playerTicket?.[10] || 0
  // used
  let ticketAttacks = Number(playerTicket?.[11]) || 0

  let ticketAttackCount = Number(playerTicket?.[12] || 0)
  let ticketKillCount = Number(playerTicket?.[13] || 0)
  let ticketKilledBy = playerTicket?.[14] || 0
  let ticketSafehouseNights = playerTicket?.[15] || 0
  let ticketcheckOutRound = Number(playerTicket?.[16] || 0)
  let ticketBuddy = playerTicket?.[17] || 0
  let ticketBuddyCount = playerTicket?.[18] || 0
  let ticketRank = Number(playerTicket?.[19] || 0)
  // let ticketRank = 123

  let ticketVoteString = ticketVote ? 'Yes' : 'No'

  const valueBought = formatUnits(ticketPurchasePrice, 18)
  const valueRedeemed = formatUnits(ticketRedeemValue, 18)

  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)

  /* 
  // approach 1
  // const ticketList = useStoreState((state) => state.tickets)
  // const totalTicketCount = ticketList.length
  */

  // approach 2
  const totalTicketCount = Number(nextTicketId) - 1

  const quartile = (ticketRank / totalTicketCount) * 100

  let rankColor: string
  if (quartile < 25) {
    rankColor = 'bg-black'
  } else if (quartile < 50) {
    rankColor = 'bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600'
  } else if (quartile < 75) {
    rankColor = 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500'
  } else if (quartile <= 100) {
    rankColor = 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500'
  }

  // bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500
  // bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
  // console.log(rankColor)

  // const suddenDeath = useStoreState((state) => state.suddenDeath)

  // const nextTicketId = useStoreState((state) => state.ticketId)

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  let ticketLook: string

  // case of phase !="countdown" && ticketId == 0 is covered in GameTab

  /*
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
        } else if (round >= suddenDeath && round) {
          ticketLook = 'stage2New'
        } else if (round >= suddenDeath && round) {
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
  */
  /*
  function handleDeployedPhase() {
    ticketLook = 'beforePurchase'
  }

  function handleStartPhase() {
    if (ticketId === 0) {
      ticketLook = 'beforePurchase'
    } else {
      ticketLook = 'afterPurchase'
    }
  }

  function handleDayPhase() {
    if (ticketStatusString === 'submit' && ticketLastSeen === round) {
      ticketLook = 'submittedDay'
    } else {
      if (round < suddenDeath) {
        ticketLook = 'stage1New'
      } else if (round < suddenDeath * 2) {
        ticketLook = 'stage2New'
      } else {
        ticketLook = 'stage3New'
      }
    }
  }

  function handleNightPhase() {
    if (ticketStatusString === 'submit' && ticketLastSeen === round) {
      ticketLook = 'submittedNight'
    } else if (ticketStatusString === 'checked') {
      ticketLook = 'attackedButSafu'
    } else {
      ticketLook = 'neverSubmit'
    }
  }

  function handleLastManFoundPhase() {
    ticketLook = 'lastManStanding'
  }

  function handlePeaceFoundPhase() {
    ticketLook = 'agreedToSplitPot'
  }

  function handleDrainPhase() {
    ticketLook = 'noMorePot'
  }

  function handleNotInPlay() {
    if (ticketStatusString === 'dead') {
      ticketLook = 'killed'
    } else if (ticketStatusString === 'exited') {
      ticketLook = 'exitGame'
    }
  }
  */

  // Your main logic
  if (phase === 'deployed') {
    // handleDeployedPhase()
    ticketLook = 'beforePurchase'
  } else if (phase === 'start') {
    // handleStartPhase()
    if (ticketId === 0) {
      ticketLook = 'beforePurchase'
    } else {
      ticketLook = 'afterPurchase'
    }
  } else if (ticketIsInPlay) {
    if (phase === 'day') {
      // handleDayPhase()
      if (ticketStatusString === 'submit' && ticketLastSeen === round) {
        ticketLook = 'submittedDay'
      } else {
        if (round < suddenDeath) {
          ticketLook = 'stage1New'
        } else if (round < suddenDeath * 2) {
          ticketLook = 'stage2New'
        } else {
          ticketLook = 'stage3New'
        }
      }
    } else if (phase === 'night') {
      // handleNightPhase()
      if (ticketStatusString === 'submit' && ticketLastSeen === round) {
        ticketLook = 'submittedNight'
      } else if (ticketStatusString === 'checked') {
        ticketLook = 'attackedButSafu'
      } else {
        ticketLook = 'neverSubmit'
      }
    } else if (phase === 'lastManFound') {
      // handleLastManFoundPhase()
      ticketLook = 'lastManStanding'
    } else if (phase === 'peaceFound') {
      // handlePeaceFoundPhase()
      ticketLook = 'agreedToSplitPot'
    } else if (phase === 'drain') {
      // handleDrainPhase()
      ticketLook = 'noMorePot'
    } else if (phase === 'start') {
      ticketLook = 'afterPurchase'
    }
  } else {
    // handleNotInPlay()
    if (ticketStatusString === 'dead') {
      ticketLook = 'killed'
    } else if (ticketStatusString === 'exited') {
      ticketLook = 'exitGame'
    }
  }

  if (!ticketLook && !ticketIsInPlay) {
    return null
  }

  const { size, edge, h1, h2, h3, imgh, imgw, mt, gap } = getTicketSize(ownTicket)

  const ticketLookFinal = ticketLook

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
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    submittedDay: {
      bgImage: 'motif',
      header: 'bg-zinc-300/70',
      face: 'handsup',
      id: ticketId,
      status: 'submitted',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    stage1New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'confident',
      id: ticketId,
      status: 'ready to submit word',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    stage2New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'worried',
      id: ticketId,
      status: 'ready to submit word',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    stage3New: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'anxious',
      id: ticketId,
      status: 'ready to submit word',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    submittedNight: {
      bgImage: 'motif',
      header: 'bg-zinc-300/70',
      face: 'attack',
      id: ticketId,
      status: 'time to attack',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    attackedButSafu: {
      bgImage: 'combine',
      header: 'bg-zinc-300/80',
      face: 'pray',
      id: ticketId,
      status: 'SAFU',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    neverSubmit: {
      bgImage: 'rainbow',
      header: 'bg-zinc-300/20',
      face: 'attack',
      id: ticketId,
      status: 'time to attack',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    inSafehouse: {
      bgImage: 'safeOverlay',
      header: 'bg-zinc-100/50',
      face: 'warm',
      id: ticketId,
      status: 'taking a break',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    lastManStanding: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20',
      face: 'lastman',
      id: ticketId,
      status: 'last man standing',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    agreedToSplitPot: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20',
      face: 'beers',
      id: ticketId,
      status: 'WAGMI',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
    },
    noMorePot: {
      bgImage: 'burst',
      header: 'bg-zinc-300/20',
      face: 'watchitburn',
      id: ticketId,
      status: 'let it burn',
      label: 'value',
      value: formatUnits(ticketValue, 18) + ' ETH',
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
      bgImage: 'deadOverlay',
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
      className={`flex flex-col wiggle mx-auto relative justify-center shadow-xl ${size} ${edge}`}
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
            <p className="text-right italic">
              <a href={`${BLOCK_EXPLORER}address/${ticketAddress}`} target="_blank">
                {ensName ? ensName : formatAddress(ticketAddress)}
              </a>
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
            <p className="text-left">Last Seen/Vote</p>
            <p className="text-right">
              {' '}
              <span className="underline">{formatCount(ticketLastSeen)}</span>/{ticketVoteString}{' '}
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
            <div className="flex justify-between text-lg text-amber-600  gap-6">
              <p className="text-left">Check out by</p>
              <p className="text-right underline"> {ticketcheckOutRound}</p>
            </div>
          )}

          {(ticketLookFinal == 'exitGame' || ticketLookFinal == 'killed') && (
            <div className="flex justify-between gap-6">
              <p className="text-left">Killed By</p>
              <p className="text-right"> #{formatCount(ticketKilledBy)}</p>
            </div>
          )}

          {ticketLookFinal == 'exitGame' && (
            <>
              <div className="flex justify-between gap-6">
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

              <div className="flex justify-between gap-6">
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
            ownTicket == true ||
            ticketLookFinal == 'inSafehouse' ||
            ticketLookFinal == 'killed' ||
            ticketLookFinal == 'exitGame'
          ) && <Attack id={Number(ticketId)} />}

          {ownTicket == false && ticketLookFinal == 'inSafehouse' && (
            <KickOut id={Number(ticketId)} />
          )}
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
            <div
              className={`flex justify-center font-whitrabt text-xl mt-3 mb-2 items-end ${rankColor} text-transparent bg-clip-text`}
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
