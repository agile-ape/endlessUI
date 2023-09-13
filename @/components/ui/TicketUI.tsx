// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import Image from 'next/image'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { formatUnits } from 'viem'

type TicketUIType = {
  ticketId: IApp['id']
}

const TicketUI: FC<TicketUIType> = ({ ticketId }) => {
  const { data: playerAddress } = useContractRead({
    ...defaultContractObj,
    functionName: 'idToPlayer',
    args: [ticketId],
  })

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [playerAddress as `0x${string}`],
  })

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

  return (
    <>
      <div className="flex flex-col gap-3 m-3 w-[240px]">
        <div
          // checked bg-blue-800
          // new bg-purple-800
          // checkedIn bg-lime-700
          // killed bg-stone-700
          // redeem
          className="p-2 rounded-2xl bg-gray-100/10"
          style={{
            backgroundImage: `url('/pepe/motif.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div
            className="rounded-2xl flex flex-col gap-1 py-[0.9rem] px-[0.5rem]"
            style={{
              // checkedTicket.svg
              // newTicket.svg
              backgroundImage: `url('/background/redeemedTicket.svg')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <p className="text-center text-3xl py-2">Ticket #{Number(id)}</p>

            <div
              // checked bg-blue-950/50
              // new bg-purple-950/50
              // checkin bg-lime-950/50
              // checkin bg-stone-950/50
              className="text-center bg-gray-300/50 flex justify-center leading-8 px-3 py-2 rounded-xl"
            >
              <Image
                priority
                src="/logo/diamondEth.svg"
                height={26}
                width={17}
                alt="diamond eth"
                className="mr-1 mb-1"
              />
              <h2 className="text-5xl">
                {formatUnits(ticketValue, 18)}
                <span className="text-2xl">ETH</span>
              </h2>
            </div>

            <div className="flex justify-between px-3 text-white text-xl">
              <div className="flex gap-2">
                <Image priority src="/icon/sword.svg" height={24} width={24} alt="sword" />
                <p className="">{Number(ticketBullets)}</p>
              </div>
              {/* <div className="relative w-16 h-8 bg-blue-500 overflow-hidden">
                <div className="absolute inset-0 h-full w-full bg-blue-500 rounded-full"
                  style={{clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)"}}>
                </div>
              </div> */}
              <div className="flex gap-2">
                <Image priority src="/pepe/pepeDead.svg" height={24} width={24} alt="crosshair" />
                <p className="">{Number(ticketKillCount)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-center mt-2 mb-0 pb-0">
                last seen: {Number(ticketLastSeen)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TicketUI
