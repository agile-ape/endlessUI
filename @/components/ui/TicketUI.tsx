// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import Image from 'next/image'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { formatUnits } from 'viem'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStoreActions, useStoreState } from '../../../store'
import { Sword, Skull, DoorOpen } from 'lucide-react'
import { Button } from './button'
import Inspect from './Attack'
import { ExitTicketUI } from './ExitTicketUI'
import CheckOut from './CheckOut'
import KickOut from './KickOut'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type TicketUIType = {
  ownTicket: boolean
  ticketId: IApp['id']
  ticketWidthPx: number
  ticketLookInput: string
}

// const statusMapping: Record<number, string> = {
//   1: 'new',
//   2: 'submitted',
//   3: 'checked',
//   4: 'safehouse',
//   5: 'dead',
//   6: 'exited',
// }

const TicketUI: FC<TicketUIType> = ({
  ownTicket,
  ticketNumber,
  ticketWidthPx,
  ticketLookInput,
}) => {
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
  })

  let ticketId = playerTicket?.[0] || 0
  let ticketAddress = playerTicket?.[1] || 0
  let ticketSignature = playerTicket?.[2] || 0
  let ticketStatus = playerTicket?.[3] || 0
  let ticketLastSeen = playerTicket?.[4] || 0
  let ticketIsInPlay = playerTicket?.[5] || 0
  let ticketVote = playerTicket?.[6] || 0
  let ticketValue = playerTicket?.[7] || 0
  let ticketPurchasePrice = playerTicket?.[8] || 0
  let ticketPotClaim = playerTicket?.[9] || 0
  let ticketRedeemValue = playerTicket?.[10] || 0
  let ticketAttacks = playerTicket?.[11] || 0
  let ticketAttackCount = playerTicket?.[12] || 0
  let ticketKillCount = playerTicket?.[13] || 0
  let ticketKilledBy = playerTicket?.[14] || 0
  let ticketSafehouseNights = playerTicket?.[15] || 0
  let ticketcheckOutRound = playerTicket?.[16] || 0
  let ticketBuddy = playerTicket?.[17] || 0
  let ticketBuddyCount = playerTicket?.[18] || 0
  let ticketRank = playerTicket?.[19] || 0

  // const phase = useStoreState((state) => state.phase)
  const phase = 'countdown'

  // const round = useStoreState((state) => state.round)
  const round = 0

  // const round = useStoreState((state) => state.nextTicketPrice)
  const nextTicketPrice = 2

  // const nextTicketId = useStoreState((state) => state.ticketId)
  const nextTicketId = 2

  let ticketLook: string

  // case of phase !="countdown" && ticketId == 0 is covered in GameTab
  if (phase == 'countdown') {
    if (ticketId == 0) {
      ticketLook = 'beforePurchase'
    } else if (ticketId != 0) {
      ticketLook = 'afterPurchase'
    }
  }

  if (ticketIsInPlay == true) {
    if (phase == 'day') {
      if (ticketStatus == 'submit' && ticketLastSeen == round) {
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
      if (ticketStatus == 'submit' && ticketLastSeen == round) {
        ticketLook = 'submittedNight'
      } else if (ticketStatus == 'checked') {
        ticketLook = 'attackedButSafu'
      } else {
        ticketLook = 'neverSubmit'
      }
    }

    if (ticketStatus == 'safe') {
      ticketLook = 'inSafehouse'
    }

    if (phase == 'lastManFound') {
      ticketLook = 'lastManStanding'
    }

    if (phase == 'peaceFound') {
      ticketLook = 'agreedToSplitPot'
    }

    if (phase == 'drain') {
      ticketLook = 'noMorePot'
    }
  }

  if (ticketIsInPlay == false) {
    if (ticketStatus == 'dead') {
      ticketLook = 'killed'
    }

    if (ticketStatus == 'exited') {
      ticketLook = 'exitGame'
    }
  }

  const getTicketSize = (ownTicket) => {
    switch (ownTicket) {
      case true:
        return {
          card: 'w-[220px] h-[200px] rounded-xl',
          h1: 'text-xl',
          h2: 'text-md',
          h3: 'text-sm',
          img: '100',
          mt: 'mt-5',
        }
      case false:
        return {
          card: 'w-[160px] h-[180px] rounded-md',
          h1: 'text-md',
          h2: 'text-sm',
          h3: 'text-xs',
          img: '60',
          mt: 'mt-2 mb-2',
        }
    }
  }

  const { card, h1, h2, h3, img, mt } = getTicketSize(ownTicket)

  const ticketLookTest = ticketLookInput

  const getTicketLook = (ticketLookTest) => {
    switch (ticketLookTest) {
      case 'beforePurchase':
        return {
          bgImage: 'burst',
          face: 'enter',
          id: nextTicketId,
          status: 'next ticket',
          label: 'price',
          value: nextTicketPrice + ' ETH',
        }
      case 'afterPurchase':
        return {
          bgImage: 'rainbow',
          face: 'happy',
          id: ticketId,
          status: 'ticket claimed',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'submittedDay':
        return {
          bgImage: 'motif',
          face: 'handsup',
          id: ticketId,
          status: 'submitted',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'stage1New':
        return {
          bgImage: 'rainbow',
          face: 'confident',
          id: ticketId,
          status: 'ready to submit word',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'stage2New':
        return {
          bgImage: 'rainbow',
          face: 'worried',
          id: ticketId,
          status: 'ready to submit word',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'stage3New':
        return {
          bgImage: 'rainbow',
          face: 'anxious',
          id: ticketId,
          status: 'ready to submit word',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'submittedNight':
        return {
          bgImage: 'motif',
          face: 'attack',
          id: ticketId,
          status: 'time to attack',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'attackedButSafu':
        return {
          bgImage: 'combine',
          face: 'pray',
          id: ticketId,
          status: 'SAFU',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'neverSubmit':
        return {
          bgImage: 'rainbow',
          face: 'attack',
          id: ticketId,
          status: 'time to attack',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'inSafehouse':
        return {
          bgImage: 'rainbow',
          face: 'warm',
          id: ticketId,
          status: 'taking a break',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'lastManStanding':
        return {
          bgImage: 'burst',
          face: 'king',
          id: ticketId,
          status: 'last man standing',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'agreedToSplitPot':
        return {
          bgImage: 'burst',
          face: 'beers',
          id: ticketId,
          status: 'WAGMI',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'noMorePot':
        return {
          bgImage: 'burst',
          face: 'watchitburn',
          id: ticketId,
          status: 'let it burn',
          label: 'bounty',
          value: ticketValue + ' ETH',
        }
      case 'killed':
        return {
          bgImage: 'greybox',
          face: 'killed',
          id: ticketId,
          status: 'killed',
          label: 'rank',
          value: ticketRank,
        }
      case 'exitGame':
        return {
          bgImage: 'burst',
          face: 'exit',
          id: ticketId,
          status: 'exited',
          label: 'rank',
          value: ticketRank,
        }
    }
  }

  const { bgImage, face, id, status, label, value } = getTicketLook(ticketLookTest)

  return (
    <div
      className={`flex flex-col relative justify-center border border-blue-950 ${card}`}
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
        <div className={`flex flex-col mx-auto gap-x-2 px-4 ${h2} justify-center`}>
          {/* <div className="flex justify-between gap-6">
                <p className="text-left"> Status</p>
                <p className="text-right"> Submitted</p>
              </div> */}

          <div className="flex justify-between gap-6">
            <p className="text-left"> Wallet</p>
            <p className="text-right"> 0x12..32 </p>
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
            <p className="text-left">Vote</p>
            <p className="text-right"> No </p>
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
            <p className="text-left">Buddy/Count </p>
            <p className="text-right"> -/3</p>
          </div>

          {/* <div className="flex justify-between gap-6">
                <p className="text-left">Buddy Count</p>
                <p className="text-right"> 1 </p>
              </div> */}

          <div className="flex justify-between gap-6">
            <p className="text-left">Exited with</p>
            <p className="text-right">
              {' '}
              7<span className="text-[0.5rem]">ETH</span>
            </p>
          </div>

          {ownTicket == false && <Inspect />}
        </div>
      )}

      {/* default */}
      {!isOverlayInspect && (
        <>
          {/* top header */}
          <div className="bg-zinc-300/60 shadow-xl text-center m-2 rounded-lg text-black">
            <p className={`uppercase ${h1} leading-tight`}>Player #{id}</p>
            <p className={`lowercase ${h3} italic text-zinc-600 dark:text-zinc-800`}>{status}</p>
          </div>

          {/* image */}
          <div className="flex justify-center">
            <Image
              priority
              src={`/faces/${face}.png`}
              height={img}
              width={img}
              className={mt}
              alt="pepe"
            />
          </div>

          {/* need a mapping to list ticketAttacks */}
          {ownTicket && (
            <div className="flex flex-row-reverse mx-3 ">
              <Sword size={12} className=""></Sword>
              <Sword size={12} className=""></Sword>
              <Sword size={12} className=""></Sword>
            </div>
          )}
          {/* box */}
          <div className="bg-zinc-300/60 shadow-xl text-center m-2 mt-0 rounded-lg text-black">
            <div className={`capitalize ${h3} text-zinc-600 dark:text-zinc-800 leading-tight`}>
              {label}
            </div>

            <div className={`uppercase ${h1}`}>{value}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default TicketUI
