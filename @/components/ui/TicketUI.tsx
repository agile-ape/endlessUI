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
import { ExitTicketUI } from './ExitTicketUI'
import CheckOut from './CheckOut'
import KickOut from './KickOut'

type TicketUIType = {
  ownTicket: boolean
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
  switch (status) {
    case 'new':
    case 'safehouse':
      return {
        borderColor: 'border-fuchsia-500',
        bgColor: 'bg-purple-700',
        boxColor: 'bg-fuchsia-950/75',
        statusUpdate: 'Fresh on Round ',
      }
    case 'submitted':
      return {
        borderColor: 'border-green-500',
        bgColor: 'bg-green-700',
        boxColor: 'bg-green-950/75',
        statusUpdate: 'Submitted keyword on Round ',
      }
    case 'checked':
      return {
        borderColor: 'border-blue-500',
        bgColor: 'bg-indigo-700',
        boxColor: 'bg-blue-950/75',
        statusUpdate: 'Checked on Round ',
      }
    case 'dead':
      return {
        borderColor: 'border-zinc-500',
        bgColor: 'bg-neutral-700',
        boxColor: 'bg-zinc-950/75',
        statusUpdate: 'Forfeited on Round ',
      }
    case 'exited':
      return {
        borderColor: 'border-zinc-300',
        bgColor: 'bg-gray-200',
        boxColor: 'bg-zinc-300/75',
        statusUpdate: '',
      }
  }
}

const TicketUI: FC<TicketUIType> = ({ ownTicket, ticketId, ticketWidthPx }) => {
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
  const status = 'new'

  // const isInSafeHouse = false
  // const isInSafeHouse = Math.random() * 200 > 100

  // console.log({ isInSafeHouse })

  const { borderColor, bgColor, boxColor, statusUpdate } = getStatusStyle(status)

  console.log(borderColor, bgColor, boxColor, statusUpdate)

  return (
    <>
      {status === 'exited' && (
        <div
          className={cn(
            `w-[${ticketWidthPx}px] flex flex-col relative justify-center border-4 rounded-xl`,
            borderColor,
            bgColor,
          )}
          style={{
            backgroundImage: `url('/pepe/motif3.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {ownTicket === false && (
            <div
              className={`bg-slate-100/70 dark:bg-slate-600/70 text-white
              absolute w-[${ticketWidthPx}px] h-[103%] rounded-xl -ml-1 z-10
              flex justify-center items-center`}
            >
              <div className="absolute text-center mx-2 mb-2 rounded-lg text-white">
                <TooltipProvider delayDuration={10}>
                  <Tooltip>
                    <TooltipTrigger>
                      <DoorOpen size={72} className="text-gray-400/75"></DoorOpen>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-2 text-sm flex-col justify-center">
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
                          <p className="text-right">
                            {' '}
                            7<span className="text-[0.5rem]">ETH</span>
                          </p>
                        </div>

                        <div className="flex justify-between gap-2">
                          <p className="text-left">Exited with</p>
                          <p className="text-right">
                            {' '}
                            7<span className="text-[0.5rem]">ETH</span>
                          </p>
                        </div>

                        <div className="flex justify-between gap-2">
                          <p className="text-left">Total kills</p>
                          <p className="text-right"> 10 </p>
                        </div>

                        <div className="flex justify-between gap-2">
                          <p className="text-left">Killed by </p>
                          <p className="text-right"> - </p>
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
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}

          <div className={cn('shadow-xl text-center m-2 rounded-lg text-black py-1', boxColor)}>
            <p className="uppercase text-xl leading-tight">Player #{Number(id)}</p>
          </div>

          {/* Image */}
          <div className="mx-2 mt-3 mb-2 rounded-lg flex flex-row py-1">
            <Image
              priority
              src="/faces/1.png"
              height={120}
              width={120}
              className="mt-5"
              alt="pepe"
            />

            <div className="w-[90px] relative my-6 mx-2 ">
              <div className="absolute inset-px bg-gradient-to-br from-orange-600 to-yellow-400 rounded-lg"></div>

              <div
                className={cn(
                  'absolute inset-1 shadow-xl flex flex-col justify-center text-center rounded-lg text-black',
                  boxColor,
                )}
              >
                <p className="uppercase text-sm mt-2 leading-tight">Rank</p>
                <p className="uppercase text-2xl text-center">
                  {/* {formatUnits(ticketValue, 18)}  */} 102
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className={cn(
              'flex flex-col justify-center shadow-xl text-center mx-2 mb-2 rounded-lg text-black py-1',
              boxColor,
            )}
          >
            {ownTicket === true && (
              <>
                <div className="uppercase text-base leading-tight">Game stats</div>
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
                    <p className="text-right">
                      {' '}
                      7<span className="text-[0.5rem]">ETH</span>
                    </p>
                  </div>

                  <div className="flex justify-between gap-2">
                    <p className="text-left">Exited with</p>
                    <p className="text-right">
                      {' '}
                      7<span className="text-[0.5rem]">ETH</span>
                    </p>
                  </div>

                  <div className="flex justify-between gap-2">
                    <p className="text-left">Total kills</p>
                    <p className="text-right"> 10 </p>
                  </div>

                  <div className="flex justify-between gap-2">
                    <p className="text-left">Killed by </p>
                    <p className="text-right"> - </p>
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
              </>
            )}

            {/* {ownTicket === false && <p className="uppercase text-3xl text-center">Help</p>} */}
          </div>
        </div>
      )}

      {status != 'exited' && (
        <div
          className={cn(
            `w-[${ticketWidthPx}px] flex flex-col relative justify-center border-2 rounded-xl`,
            borderColor,
            bgColor,
          )}
          style={{
            backgroundImage: `url('/pepe/motif3.svg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {status === 'safehouse' && (
            <div
              className={`bg-slate-100/70 dark:bg-slate-600/70
              absolute w-[${ticketWidthPx}px] h-[103%] rounded-xl -ml-1 z-10
              flex justify-center items-center`}
            >
              <div className="bg-sky-600/50 shadow-md border border-white absolute w-[90%] mx-auto rounded-xl flex flex-col gap-1 items-center justify-center py-1">
                <h2 className="text-sm text-center uppercase">Safehouse</h2>
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

                <div className="px-3 text-xs py-0">{ownTicket ? <CheckOut /> : <KickOut />}</div>
              </div>
            </div>
          )}

          {status === 'dead' && (
            <div
              className={`bg-slate-100/70 dark:bg-slate-600/70
            absolute w-[${ticketWidthPx}px] h-[103%] rounded-xl -ml-1 z-10
            flex justify-center items-center`}
            >
              {ownTicket === true && (
                <div className="absolute text-center mx-2 mb-2 rounded-lg">
                  <p className="text-md px-2">
                    Your ticket is forfeited. However, you can still claim your pot reward when you
                    exit game.
                  </p>
                </div>
              )}

              {ownTicket === false && (
                <div className="absolute text-center mx-2 mb-2 rounded-lg text-white">
                  <Skull size={72} className="text-gray-400/75"></Skull>
                </div>
              )}
            </div>
          )}

          <div className={cn('shadow-xl text-center m-2 rounded-lg text-white py-1', boxColor)}>
            <p className="uppercase text-xl leading-tight">Player #{Number(id)}</p>
            <p className="text-sm text-center leading-tight">
              {statusUpdate} <span className="underline">{Number(ticketLastSeen)}</span>
            </p>
          </div>

          {/* Image */}
          <div className="mx-2 mb-2 rounded-lg flex gap-1 justify-center py-1">
            <Image priority src="/faces/1.png" height={90} width={90} className="mt-6" alt="pepe" />

            <div className="flex flex-col justify-end text-white">
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

          <div
            className={cn(
              'shadow-xl text-center mx-2 mb-2 relative rounded-lg text-white',
              boxColor,
            )}
          >
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
