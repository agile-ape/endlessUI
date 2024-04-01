// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useReadContracts, useWriteContract } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'

type TicketUIType = {
  id?: number
  number?: number
  isBlank?: bool
  isWinner?: bool
  winnerClaimYet?: bool
  playerClaimYet?: bool
}

const TicketUI: FC<TicketUIType> = ({
  id,
  number,
  isBlank,
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
    ],
  })

  const { data: hash, isPending, writeContract, writeContractAsync } = useWriteContract()

  const canBuyTicket = Boolean(data?.[0].result || false) // true = game ongoing false = game end

  console.log(canBuyTicket)

  // const winnersClaimHandler = () => {
  //   writeContract({
  //     ...defaultContractObj,
  //     functionName: 'winnersClaim',
  //   })
  // }

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
      className={cn(
        isWinner ? 'bg-yellow-400 border-yellow-600' : 'bg-neutral-600 border-gray-400',
        'relative flex flex-col mx-auto items-center rounded-xl border gap-2 w-[120px] h-[120px]',
      )}
    >
      <div className="absolute bottom-3 left-1 bg-[#19212c] rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div className="absolute bottom-3 right-1 bg-[#19212c] rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div
        className={cn(
          isWinner ? 'border-yellow-600' : 'border-gray-400',
          'relative w-[75px] h-[30px] rounded-sm border \
      flex',
        )}
      >
        {isOverlayInspect ? (
          <>
            <div
              className={cn(
                isWinner ? 'bg-yellow-500 border-yellow-600' : 'bg-neutral-700 border-gray-500',
                'left-0 absolute w-[28px] h-[28px] rounded-xs \
              border',
              )}
            ></div>
            <div
              className={cn(
                isWinner ? 'text-gray-700' : 'text-yellow-500',
                'right-0 absolute w-[47px] h-[28px] rounded-xs \
                flex justify-center items-center text-xl',
              )}
            >
              {String(id)}
            </div>
          </>
        ) : (
          <>
            <div
              className={cn(
                isWinner ? 'text-gray-700' : 'text-yellow-500',
                'left-0 absolute w-[28px] h-[28px] rounded-xs \
            flex justify-center items-center text-xl',
              )}
            >
              #
            </div>
            <div
              className={cn(
                isWinner ? 'bg-yellow-500 border-yellow-600' : 'bg-neutral-700  border-gray-500',
                'right-0 absolute w-[47px] h-[28px] rounded-xs \
                border',
              )}
            ></div>
          </>
        )}
      </div>

      {isOverlayInspect ? (
        <div className="flex flex-col justify-center items-center gap-2 my-2">
          {isWinner && (
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
          )}

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
