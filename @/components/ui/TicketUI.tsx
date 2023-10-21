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
import { Button } from './button'
import { ExitTicketUI } from './ExitTicketUI'

type TicketUIType = {
  ticketId: IApp['id']
  ticketWidthPx: number
}

const statusMapping: Record<number, string> = {
  1: 'new',
  2: 'submitted',
  3: 'checked',
  4: 'safehouse',
  5: 'dead',
  6: 'exited',
}

// Fresh - border-fuchsia-500 bg-purple-700 bg-fuchsia-900/75 Fresh on Round
// Submitted - border-green-500 bg-lime-700 bg-green-950/75 Submitted keyword on Round
// Checked - border-blue-500 bg-indigo-700 bg-blue-950/75 Checked on Round
// Killed - opacity-80 border-zinc-500 bg-neutral-700 bg-zinc-900/75 Killed on Round
const getStatusStyle = (status) => {
  switch(status) {
    case 'new':
      return {
        // opacity: "",
        borderColor: "border-fuchsia-500",
        bgColor: "bg-purple-700",
        boxColor: "bg-fuchsia-950/75",
        statusUpdate: "Fresh on Round "
      };
    case 'submitted':
      return {
        // opacity: "",
        borderColor: "border-green-500",
        bgColor: "bg-green-700",
        boxColor: "bg-green-950/75",
        statusUpdate: "Submitted keyword on Round "
      };
    case 'checked':
      return {
        // opacity: "",
        borderColor: "border-blue-500",
        bgColor: "bg-indigo-700",
        boxColor: "bg-blue-950/75",
        statusUpdate: "Checked on Round "
      };
    case 'safehouse':
      return {
        // opacity: "",
        borderColor: "border-fuchsia-500",
        bgColor: "bg-purple-700",
        boxColor: "bg-fuchsia-950/75",
        statusUpdate: "Fresh on Round "
      };
    case 'dead':
      return {
        // opacity: "opacity-80",
        borderColor: "border-zinc-500",
        bgColor: "bg-neutral-700",
        boxColor: "bg-zinc-950/75",
        statusUpdate: "Killed on Round "
      };
    case 'exited':
      return {
        // opacity: "opacity-80",
        borderColor: "",
        bgColor: "",
        boxColor: "",
        statusUpdate: ""
      };
  }
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
  
  // hardcode this if necessary
  // const status = statusMapping[ticketStatus] || 'unknown'
  const status = 'dead'
  
  // const isInSafeHouse = false
  // const isInSafeHouse = Math.random() * 200 > 100
  
  // console.log({ isInSafeHouse })
  
  const {borderColor, bgColor, boxColor, statusUpdate } = getStatusStyle(status);
  
  console.log(borderColor, bgColor, boxColor, statusUpdate);
  
  return (
    <>
      {status === "exited" ? (
        // debug issue
        <ExitTicketUI ticketId={ticketId} ticketWidthPx={ticketWidthPx}/>
        ) : (

          <div
          className={cn(
            `w-[${ticketWidthPx}px] flex flex-col relative justify-center border-2 rounded-xl`, borderColor, bgColor
          )}
          style={{
            backgroundImage: `url('/pepe/motif3.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {status == "safehouse" && (
            <div
              className={`bg-slate-100/70 dark:bg-slate-600/70 text-white
              absolute w-[${ticketWidthPx}px] h-[103%] rounded-xl -ml-1 z-10
              flex justify-center items-center`}
            >
              <div className="bg-sky-600 shadow-md border border-white absolute top-16 w-[90%] mx-auto rounded-xl flex flex-col items-center justify-center py-1">
                <h2 className="text-sm text-center underline">In Safehouse</h2>
                <div className="w-[80%] mx-auto">
                  <div className="text-sm flex justify-between">
                    <p>Check Out Round</p>
                    <p>7</p>
                  </div>
                  <div className="text-sm flex justify-between">
                    <p>Current Round</p>
                    <p>7</p>
                  </div>
                </div>

                <Button variant="kickOut" className="h-8">
                  Kick Out
                </Button>
              </div>
            </div>
          )}

          {status == "dead" && (
            <div
            className={`bg-slate-100/70 dark:bg-slate-600/70 text-white
            absolute w-[${ticketWidthPx}px] h-[103%] rounded-xl -ml-1 z-10
            flex justify-center items-center`}
          >
           
            <div className="absolute text-center mx-2 mb-2 rounded-lg text-white">
              <p className="text-md px-2">You have lost your ETH. You can still claim your pot reward when you exit game</p>
            </div>

           

          </div>

          )}

            <div className={cn("shadow-xl text-center m-2 rounded-lg text-white py-1", boxColor)}>
              <p className="uppercase text-xl leading-tight">Player #{Number(id)}</p>
              <p className="text-sm text-center leading-tight">
                {statusUpdate} <span className="underline">{Number(ticketLastSeen)}</span>
              </p>
            </div>

          {/* Image */}
            <div className="mx-2 mb-2 rounded-lg flex gap-1 justify-center py-1">
              <Image priority src="/faces/1.png" height={90} width={90} className="mt-6" alt="pepe" />

              <div className="flex flex-col justify-end">
                <div className="flex items-center gap-1">
                  <Sword size={18} className=""></Sword>
                  <span className="text-2xl">{Number(ticketBullets)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Skull size={18} className=""></Skull>
                  <span className="text-2xl">{Number(ticketKillCount)}</span>
                </div>
              </div>
            </div>

          {/* Wallet */}
          
            <div className={cn("shadow-xl text-center mx-2 mb-2 relative rounded-lg text-white", boxColor)}>
              <p className="uppercase text-sm leading-tight">Wallet</p>
              <p className="uppercase text-3xl text-center">
                {formatUnits(ticketValue, 18)}
                <span className="text-lg">ETH</span>
              </p>
            </div>
        </div>
        
      )}
    </>
  )
}

export default TicketUI
