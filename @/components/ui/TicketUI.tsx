// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useReadContracts, useWriteContract } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { formatNumber } from '@/lib/utils'
import { formatUnits, parseUnits } from 'viem'

type TicketUIType = {
  id?: number
  player?: string
  number?: number
  isWinner?: bool
  winnerClaimYet?: bool
  playerClaimYet?: bool
}

const TicketUI: FC<TicketUIType> = ({
  id,
  player,
  number,
  isWinner,
  winnerClaimYet,
  playerClaimYet,
}) => {
  const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
  const toggleLoad = () => setShowLoadModal((prevState) => !prevState)
  const [isOverlayInspect, setIsOverlayInspect] = React.useState<boolean>(false)

  const handleOnMouseEnter: MouseEventHandler = () => {
    setIsOverlayInspect(true)
  }

  const handleOnMouseLeave: MouseEventHandler = () => {
    setIsOverlayInspect(false)
  }

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
      {
        ...defaultContractObj,
        functionName: 'currentAverage',
      },
      {
        ...defaultContractObj,
        functionName: 'playersPayoutFactor',
      },
      {
        ...defaultContractObj,
        functionName: 'winnersSplit',
      },
    ],
  })

  const { data: hash, isPending, writeContract, writeContractAsync } = useWriteContract()

  const canBuyTicket = Boolean(data?.[0].result || false)
  const currentAverage = Number(data?.[1].result || BigInt(0))
  const playersPayoutFactor = Number(data?.[2].result || BigInt(0))
  const winnersSplit = Number(data?.[3].result || BigInt(0))

  const claimAmount = playersPayoutFactor * id

  const formattedWinnersSplit = formatNumber(formatUnits(winnersSplit, 18), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
  })

  console.log(canBuyTicket)
  console.log(currentAverage)
  console.log(typeof currentAverage)

  // const winnersClaimHandler = () => {
  //   writeContract({
  //     ...defaultContractObj,
  //     functionName: 'winnersClaim',
  //   })
  // }

  let ticketLook: string

  if (canBuyTicket) {
    ticketLook = 'bought'
  }

  if (canBuyTicket && number == currentAverage) {
    ticketLook = 'leading'
  }

  if (!canBuyTicket && isWinner) {
    ticketLook = 'win'
  }

  if (!canBuyTicket && !isWinner) {
    ticketLook = 'noWin'
  }

  if (!canBuyTicket && winnerClaimYet && playerClaimYet) {
    ticketLook = 'claimed'
  }

  const ticketLookMapping = {
    bought: {
      bgColor: 'bg-neutral-600',
      borderColor: 'border-gray-400',
      shutter: 'bg-neutral-700 border-gray-500',
      shutterTextColor: 'text-yellow-500',
    },
    leading: {
      bgColor: 'bg-neutral-600',
      borderColor: 'border-yellow-400 border-2',
      shutter: 'bg-neutral-700 border-yellow-500',
      shutterTextColor: 'text-yellow-500',
    },
    win: {
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-600',
      shutter: 'bg-yellow-500 border-yellow-600',
      shutterTextColor: 'text-gray-700',
    },
    noWin: {
      bgColor: 'bg-rose-200',
      borderColor: 'border-rose-700',
      shutter: 'bg-rose-300 border-rose-500',
      shutterTextColor: 'text-gray-700',
    },
    claimed: {
      bgColor: 'bg-neutral-200',
      borderColor: 'border-neutral-700',
      shutter: 'bg-neutral-400 border-gray-500',
      shutterTextColor: 'text-gray-700',
    },
  }

  const { bgColor, borderColor, shutter, shutterTextColor } = ticketLookMapping[ticketLook]

  const winnersClaimHandler = async () => {
    try {
      const tx = writeContractAsync({
        ...defaultContractObj,
        functionName: 'winnersClaim',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const playersClaimHandler = async () => {
    try {
      const tx = writeContractAsync({
        ...defaultContractObj,
        functionName: 'playersClaim',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // const playersClaimHandler = () => {
  //   writeContract({
  //     ...defaultContractObj,
  //     functionName: 'playersClaim',
  //   })
  // }

  return (
    <div
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      className={`${bgColor} ${borderColor} relative wiggle flex flex-col mx-auto items-center rounded-xl border gap-2 w-[120px] h-[120px]`}
    >
      <div className="absolute bottom-3 left-1 bg-zinc-800 rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div className="absolute bottom-3 right-1 bg-zinc-800 rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div className={`${borderColor} relative w-[75px] h-[30px] rounded-sm border flex`}>
        {isOverlayInspect ? (
          <>
            <div
              className={`${shutter} left-0 absolute w-[28px] h-[28px] rounded-xs \
              border`}
            ></div>
            <div
              className={`${shutterTextColor} right-0 absolute w-[47px] h-[28px] rounded-xs \
                flex justify-center items-center text-xl`}
            >
              {String(id)}
            </div>
          </>
        ) : (
          <>
            <div
              className={`${shutterTextColor} left-0 absolute w-[28px] h-[28px] rounded-xs \
            flex justify-center items-center text-xs`}
            >
              🔑
            </div>
            <div
              className={`${shutter} right-0 absolute w-[47px] h-[28px] rounded-xs \
                border`}
            ></div>
          </>
        )}
      </div>

      {isOverlayInspect ? (
        <div className="flex flex-col justify-center items-center gap-2 my-2">
          {isWinner && (
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    className="px-3 mx-2 \
            w-[80%] bg-yellow-500 text-slate-600 border-yellow-200 border-2 \
            hover:text-white hover:bg-opacity-50 \
            active:text-white/50 active:bg-opacity-75 \
            disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={canBuyTicket || winnerClaimYet}
                    onClick={winnersClaimHandler}
                  >
                    Winner
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <div className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                    {canBuyTicket ? (
                      <span>Cannot claim yet </span>
                    ) : (
                      <span>You won {formattedWinnersSplit} ETH </span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="px-3 mx-2 \
            w-[80%] bg-gray-400 text-slate-700 border-slate-200 border-2 \
            hover:text-white hover:bg-opacity-50 \
            active:text-white/50 active:bg-opacity-75 \
            disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={canBuyTicket || playerClaimYet}
                  onClick={playersClaimHandler}
                >
                  Claim
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <div className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                  {canBuyTicket ? (
                    <span>Cannot claim yet </span>
                  ) : (
                    <span>You can claim {claimAmount} ETH </span>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div
          className={cn(
            'bg-gray-100 border-gray-300 absolute bottom-0 w-[75px] h-[75px] rounded-t-sm border shadow-inner shadow-lg \
        flex flex-col justify-center items-center',
          )}
        >
          <div className="h-4 border-0 bg-red-100/80 w-full"></div>
          <div className="h-4 border-0 w-full"></div>
          <div className="h-4 border-0 bg-red-100/80 w-full"></div>
          <div className="h-4 border-0 w-full"></div>
          <div className="h-4 border-0 bg-red-100/80 w-full"></div>
          <div className="absolute text-gray-900 rounded-lg font-digit text-center text-3xl">
            {number}
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketUI
