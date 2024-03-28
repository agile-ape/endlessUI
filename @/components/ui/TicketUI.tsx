// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useReadContracts } from 'wagmi'
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

  const canBuyTicket = Boolean(data?.[0].result || false) // true = game ongoing false = game end

  console.log(canBuyTicket)

  return (
    <div
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      className={cn(
        isWinner ? 'bg-yellow-300' : 'bg-neutral-600',
        'relative flex flex-col mx-auto items-center rounded-xl border border-gray-400 gap-2 w-[120px] h-[120px]',
      )}
    >
      <div className="absolute bottom-3 left-1 bg-[#19212c] rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div className="absolute bottom-3 right-1 bg-[#19212c] rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div className="relative w-[60px] h-[30px] rounded-sm border border-gray-400">
        <div
          className={cn(
            isOverlayInspect ? 'right-0' : 'left-0',
            isWinner ? 'bg-neutral-100 border-gray-300' : 'bg-neutral-800 border-gray-500',
            'absolute w-[28px] h-[28px] rounded-xs border',
          )}
        ></div>
      </div>

      {isOverlayInspect ? (
        <div className="flex flex-col justify-center items-center gap-2 my-2">
          {isWinner && (
            <button
              className="px-3 mx-2\
            w-full bg-gray-400 text-slate-700 border border-slate-200 border-2 \
            hover:text-white hover:bg-opacity-50 \
            active:text-white/50 active:bg-opacity-75 \
            disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={canBuyTicket || winnerClaimYet}
            >
              Winner
            </button>
          )}

          <button
            className="px-3 mx-2\
            w-full bg-gray-400 text-slate-700 border border-slate-200 border-2 \
            hover:text-white hover:bg-opacity-50 \
            active:text-white/50 active:bg-opacity-75 \
            disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={canBuyTicket || playerClaimYet}
          >
            Claim
          </button>
        </div>
      ) : (
        <div
          className={cn(
            isWinner ? 'bg-neutral-100 border-gray-300' : 'border-gray-400 bg-gray-300',
            'absolute bottom-0 w-[75px] h-[75px] rounded-t-sm border shadow-inner shadow-lg \
        flex flex-col justify-center',
          )}
        >
          <div className="text-lg text-gray-700 text-center uppercase rounded-lg">
            #{String(id)}
            <div className="font-digit text-center text-3xl">{number}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketUI
