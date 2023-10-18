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



type ExitTicketUIType = {
  ticketId: IApp['id']
  ticketWidthPx: number
}

const statusMapping: Record<number, string> = {
  1: 'new',
  2: 'killed',
  3: 'redeem',
  4: 'checkedIn',
}

const ExitTicketUI: FC<ExitTicketUIType> = ({ ticketId, ticketWidthPx }) => {
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
    // Killed - border-zinc-500 bg-neutral-700 bg-zinc-900/75 was killed on Round 
      <div
        className={`w-[${ticketWidthPx}px] flex flex-col justify-center border-4 border-zinc-300 bg-gray-200 rounded-xl`}
        style={{
          backgroundImage: `url('/pepe/motif2.svg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >

       
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
          <div className="bg-zinc-300/75 shadow-xl text-center m-2 rounded-lg text-black py-1">
              <p className="uppercase text-xl leading-tight">
                Player #{Number(id)}
              </p>
          </div>

          {/* Image */}
          <div className="mx-2 mt-3 mb-2 rounded-lg flex flex-row py-1">
              
            <Image 
              priority src="/faces/1.png" 
              height={120} 
              width={120} 
              className="mt-5"
              alt="pepe" />

              <div className="w-[90px] relative my-6 mx-2 ">
                <div className="absolute inset-px bg-gradient-to-br from-orange-600 to-yellow-400 rounded-lg"></div>
                
                <div className="absolute inset-1 bg-zinc-300/90 shadow-xl flex flex-col justify-center text-center rounded-lg text-black">
                  <p className="uppercase text-sm mt-2 leading-tight">
                    Rank
                  </p>
                  <p className="uppercase text-2xl text-center">
                  {/* {formatUnits(ticketValue, 18)}  */} 102  
                  </p>
                </div>

              </div>

          </div>

          {/* Wallet */}
          <div className="bg-zinc-300/75 flex flex-col justify-center shadow-xl text-center mx-2 mb-2 rounded-lg text-black py-1">
              <div className="uppercase text-base leading-tight">
                Game stats
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-2 text-xs flex-col justify-center">

                    <div className="flex justify-between gap-2">
                      <p className="text-left"> Owner</p>
                      <p className="text-right"> 0x12..32 </p>
                    </div>

                    <div className="flex justify-between gap-2">
                      <p className="text-left">Lasted till</p>
                      <p className="text-right underline"> 7 </p>
                    </div>

                    <div className="flex justify-between gap-2">
                      <p className="text-left">Bought for</p>
                      <p className="text-right"> 7 <span className="text-[0.5rem]">ETH</span></p>
                    </div>

                    <div className="flex justify-between gap-2">
                      <p className="text-left">Exited with</p>
                      <p className="text-right"> 7 <span className="text-[0.5rem]">ETH</span></p>
                    </div>
                    
                    <div className="flex justify-between gap-2">
                      <p className="text-left">Total kills</p>
                      <p className="text-right">  10 </p>
                    </div>

                    <div className="flex justify-between gap-2">
                      <p className="text-left">Killed by </p>
                      <p className="text-right">  - </p>
                    </div>

                    <div className="flex justify-between gap-2">
                      <p className="text-left">Safe nights </p>
                      <p className="text-right"> 20 </p>
                    </div>
                    
                    <div className="flex justify-between gap-2">
                      <p className="text-left">Split pot? </p>
                      <p className="text-right"> Yes </p>
                    </div>

              </div>
          </div>
        </div>
      // </div>
    // </div>
  )
}

export default ExitTicketUI
