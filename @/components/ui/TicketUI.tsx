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
import { Sword, Skull } from 'lucide-react'



type TicketUIType = {
  ticketId: IApp['id']
  ticketWidthPx: number
}

const statusMapping: Record<number, string> = {
  1: 'new',
  2: 'killed',
  3: 'redeem',
  4: 'checkedIn',
}

const TicketUI: FC<TicketUIType> = ({ ticketId, ticketWidthPx }) => {
  const { data: playerAddress } = useContractRead({
    ...defaultContractObj,
    functionName: 'idToPlayer',
    args: [ticketId],
  })

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    // functionName: 'idToTicket',
    // args: [ticketId],
    functionName: 'playerTicket',
    args: [(playerAddress || '') as `0x${string}`],
  })

  const isInSafeHouse = Math.random() * 200 > 100
  console.log({isInSafeHouse})

  //  0 uint id;
  //  1 address player;
  //  2 bytes sign;
  //  3 Status status;
  //  4 uint lastSeen;
  //  5 bool isInPlay;
  //  6 uint value;
  //  7 uint purchasePrice;
  //  8 uint redeemValue;
  //  9 uint bullets;
  //  10 uint killCount;
  //  11 uint rank;

  let id = playerTicket?.[0] || 0
  let ticketAddress = playerTicket?.[1] || 0
  let ticketSignature = playerTicket?.[2] || 0
  let ticketStatus = playerTicket?.[3] || 0
  let ticketLastSeen = playerTicket?.[4] || 0
  let ticketIsInPlay = playerTicket?.[5] || 0
  let ticketValue = playerTicket?.[6] || 0
  let ticketPurchasePrice = playerTicket?.[7] || 0
  let ticketRedeemValue = playerTicket?.[8] || 0
  let ticketBullets = playerTicket?.[9] || 0
  let ticketKillCount = playerTicket?.[10] || 0
  let ticketRank = playerTicket?.[11] || 0

  //  0 uint id;
  //  1 address player;
  //  2 bytes sign;
  //  3 Status status;
  //  4 uint lastSeen;
  //  5 bool isInPlay;
  //  6 uint value;
  //  7 uint purchasePrice;
  //  8 uint redeemValue;
  //  9 uint bullets;
  //  10 uint killCount;
  //  11 uint rank;

  const status = statusMapping[ticketStatus] || 'unknown'

  return (
    // <div className={`flex flex-col gap-3 w-[${ticketWidthPx}px]`}>
    // Fresh - border-fuchsia-500 bg-purple-700 bg-fuchsia-900/75 is fresh on Round 
    // Submitted - border-green-500 bg-lime-700 bg-green-950/75 submitted a keyword on Round 
    // Checked - border-blue-500 bg-indigo-700 bg-blue-950/75 was checked on Round 
    // Killed - opacity-80 border-zinc-500 bg-neutral-700 bg-zinc-900/75 was killed on Round 
    // Safe - opacity-80 border-zinc-500 bg-neutral-700 bg-zinc-900/75 was killed on Round 
      <div
        className={`w-[${ticketWidthPx}px] flex flex-col relative justify-center border-4 border-zinc-500 bg-neutral-700 rounded-xl`}
        style={{
          backgroundImage: `url('/pepe/motif2.svg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {isInSafeHouse && (
          <div className={`bg-[#F9F7FA] absolute w-[${ticketWidthPx}px] h-[103%] rounded-xl -ml-1 opacity-90 flex justify-center items-center`}>
            <div className="bg-[#7DD3FC] w-[90%] mx-auto rounded-xl flex flex-col items-center justify-center gap-4 p-2">
              <h2 className="text-[1rem] text-center underline">IN SAFEHOUSE</h2>
              <div className="w-[80%] mx-auto">
                <div className="text-[1rem] flex justify-between">
                  <p>Check Out Round</p>
                  <p>7</p>
                </div>
                <div className="text-[1rem] flex justify-between">
                  <p>Current Round</p>
                  <p>7</p>
                </div>
              </div>
              <button className="p-1 border-2 border-[#991B1B] rounded-xl w-[60%] mx-auto">Kick Out</button>
            </div>
          </div>
        )}

        {/* <div
          className="rounded-2xl flex flex-col gap-1 py-[0.9rem] px-[0.5rem]"
          style={{
            // checkedTicket.svg
            // newTicket.svg
            backgroundImage: `url('/background/redeemedTicket.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        > */}
          <div className="bg-zinc-900/75 shadow-xl text-center m-2 rounded-lg text-white py-1">
              <p className="uppercase text-xl leading-tight">
                Player #{Number(id)}
              </p>
              <p className="text-sm text-center leading-tight">
              was killed on Round <span className='underline'>{Number(ticketLastSeen)}</span>
              </p>
          </div>

          {/* Image */}
          <div className="mx-2 mb-2 rounded-lg flex justify-center py-1">
              
            <Image 
              priority src="/faces/1.png" 
              height={120} 
              width={120} 
              className="mt-5"
              alt="pepe" />

          </div>

          {/* Wallet */}
          <div className="bg-zinc-900/75 shadow-xl text-center mx-2 mb-2 rounded-lg text-white py-1">
              <p className="uppercase text-sm leading-tight">
                Wallet
              </p>
              <p className="uppercase text-3xl text-center">
              {formatUnits(ticketValue, 18)} 
              <span className="text-lg">ETH</span>
              </p>
          </div>

          {/* kills */}
          <div className="bg-zinc-900/75 flex justify-center shadow-xl text-center mx-2 mb-2 rounded-lg text-white py-1">
              <div className="w-[60%] flex justify-between">
                <div className='flex gap-1'>
                  <Sword size={28} className=""></Sword>
                  <span className="text-2xl">
                    {Number(ticketBullets)}
                  </span>
                </div>

                <div className='flex gap-1'>
                  <Skull size={28} className=""></Skull>
                  <span className="text-2xl">
                    {Number(ticketKillCount)}
                  </span>
                </div>
              </div>
              {/* <p className="uppercase leading-tight">
                Player #{Number(id)}
              </p>
              <p className="uppercase text-sm text-center leading-tight">
                last seen: <span className='underline'>{Number(ticketLastSeen)}</span>
              </p> */}
          </div>
      </div>
      // </div>
    // </div>
  )
}

export default TicketUI
