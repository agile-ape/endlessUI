// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import {
  useReadContracts,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { defaultContractObj, BLOCK_EXPLORER } from '../../../services/constant'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { formatNumber } from '@/lib/utils'
import { formatUnits, parseUnits } from 'viem'
import { toast } from '@/components/shadcn/use-toast'

type TicketUIType = {
  // id?: number
  // player?: string
  // number?: number
  // isWinner?: bool
  // winnerClaimYet?: bool
  // playerClaimYet?: bool
  ticketId?: bigint
}

const TicketUI: FC<TicketUIType> = ({
  // id,
  // player,
  // number,
  // isWinner,
  // winnerClaimYet,
  // playerClaimYet,
  ticketId,
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

  const { data: playerInfo, refetch } = useReadContract({
    ...defaultContractObj,
    functionName: 'idToTicket',
    args: [ticketId],
  })

  const id = Number(playerInfo?.[0] || 0)
  const player = String(playerInfo?.[1] || '0')
  const number = Number(playerInfo?.[2] || 0)
  const isWinner = Boolean(playerInfo?.[3] || false)
  const winnerClaimYet = Boolean(playerInfo?.[4] || false)
  const playerClaimYet = Boolean(playerInfo?.[5] || false)

  const { data } = useReadContracts({
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

  const {
    data: winnerClaimHash,

    writeContractAsync: writeWinnerClaimContractAsync,
  } = useWriteContract()
  const { data: playerClaimHash, writeContractAsync: writePlayerClaimContractAsync } =
    useWriteContract()

  const canBuyTicket = Boolean(data?.[0].result || false)
  const currentAverage = Number(data?.[1].result || BigInt(0))
  const playersPayoutFactor = Number(data?.[2].result || BigInt(0))
  const winnersSplit = Number(data?.[3].result || BigInt(0))
  // const winnersSplit = data?.[4].result ||

  let claimAmount = null
  if (id !== 0) {
    const payout = BigInt(playersPayoutFactor) / BigInt(id)
    claimAmount = formatNumber(formatUnits(payout, 18), {
      maximumFractionDigits: 4,
      minimumFractionDigits: 3,
    })
  }

  const formattedWinnersSplit = formatNumber(formatUnits(winnersSplit, 18), {
    maximumFractionDigits: 4,
    minimumFractionDigits: 3,
  })

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

  if (
    !canBuyTicket &&
    ((isWinner && winnerClaimYet && playerClaimYet) || (!isWinner && playerClaimYet))
  ) {
    ticketLook = 'claimed'
  }

  const ticketLookMapping = {
    bought: {
      bgColor: 'bg-neutral-500',
      borderColor: 'border-gray-800',
      shutter: 'bg-neutral-700 border-gray-800',
      shutterTextColor: 'text-yellow-500',
      buttonColor: 'bg-neutral-700 border-gray-800',
    },
    leading: {
      bgColor: 'bg-neutral-600',
      borderColor: 'border-yellow-400 border-2',
      shutter: 'bg-neutral-700 border-yellow-500',
      shutterTextColor: 'text-yellow-500',
      buttonColor: 'bg-neutral-700 border-yellow-500',
    },
    win: {
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-600',
      shutter: 'bg-yellow-500 border-yellow-600',
      shutterTextColor: 'text-gray-700',
      buttonColor: 'bg-yellow-500 border-yellow-600',
    },
    noWin: {
      bgColor: 'bg-neutral-200',
      borderColor: 'border-neutral-700',
      shutter: 'bg-neutral-400 border-gray-500',
      shutterTextColor: 'text-gray-700',
      buttonColor: 'bg-neutral-400 border-gray-500',
    },
    claimed: {
      bgColor: '',
      borderColor: 'border-gray-400',
      shutter: 'bg-neutral-600 border-gray-400',
      shutterTextColor: 'text-white',
      buttonColor: 'bg-neutral-600 border-gray-400',
    },
  }

  const { bgColor, borderColor, shutter, shutterTextColor, buttonColor } =
    ticketLookMapping[ticketLook]

  const winnersClaimHandler = async () => {
    try {
      const tx = await writeWinnerClaimContractAsync({
        ...defaultContractObj,
        functionName: 'winnersClaim',
        args: [id],
      })

      if (tx) {
        const txLink = `${BLOCK_EXPLORER}/tx/${tx}`
        toast({
          variant: 'success',
          description: (
            <p>
              🟣{' '}
              <a href={txLink} target="_blank" className="text-xl text-black underline">
                Winnings claimed!
              </a>
            </p>
          ),
        })
        refetch()
      } else {
        const errorMsg = tx?.cause?.reason || tx?.cause?.shortMessage || 'Error here!'
        toast({
          variant: 'destructive',
          description: <p>{errorMsg}</p>,
        })
        onError(errorMsg)
      }
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // const {} = useWaitForTransactionReceipt({
  //   hash: winnerClaimHash,
  //   onSuccess() {
  //     console.log(winnerClaimHash)
  //     toast({
  //       variant: 'success',
  //       description: <p className="text-xl"> Winnings claimed!</p>,
  //     })
  //   },
  // })

  // const {} = useWaitForTransaction({
  //   hash: adjustTokenEmissionData?.hash,
  //   onSuccess(data) {
  //     if (data.status === 'success') {
  //       refetch()
  //     }
  //     console.log({ data })
  //   },
  // })

  const playersClaimHandler = async () => {
    try {
      const tx = await writePlayerClaimContractAsync({
        ...defaultContractObj,
        functionName: 'playersClaim',
        args: [id],
      })

      if (tx) {
        const txLink = `${BLOCK_EXPLORER}/tx/${tx}`

        toast({
          variant: 'success',
          description: (
            <p>
              🟡{' '}
              <a href={txLink} target="_blank" className="text-xl text-black underline">
                Pot claimed!
              </a>
            </p>
          ),
        })
        refetch()
      } else {
        const errorMsg = tx?.cause?.reason || tx?.cause?.shortMessage || 'Error here!'
        toast({
          variant: 'destructive',
          description: <p>{errorMsg}</p>,
        })
        onError(errorMsg)
      }
    } catch (error: any) {
      const errorMsg = error?.cause?.reason || error?.cause?.shortMessage || 'No, Error here!'

      toast({
        variant: 'destructive',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // const result = useWaitForTransactionReceipt({
  //   hash: playerClaimHash,
  //   onSuccess(data) {
  //     if (data.status === 'success') {
  //       console.log(playerClaimHash)
  //       toast({
  //         variant: 'success',
  //         description: <p className="text-xl">🟡 Pot claimed!</p>,
  //       })
  //     }
  //   },
  // })

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
      className={`${bgColor} ${borderColor} relative wiggle flex flex-col mx-auto items-center rounded-xl border gap-2 w-[120px] h-[120px] mt-4 mb-2`}
    >
      <div className="absolute bottom-3 left-1 bg-zinc-800 rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div className="absolute bottom-3 right-1 bg-zinc-800 rounded-xs shadow-inner shadow-sm w-[12px] h-[12px]"></div>
      <div className={`${borderColor} relative w-[75px] h-[30px] rounded-sm border flex`}>
        {isOverlayInspect ? (
          <>
            <div
              className={`${shutter} left-0 absolute w-[28px] h-[28px] rounded-l-xs \
              border`}
            ></div>
            <div
              className={`${shutterTextColor} right-0 absolute w-[47px] h-[28px] rounded-r-sm \
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
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                <button
                  className={`${buttonColor} \
                    rounded-full w-12 h-12 \
              border-2 hover:rotate-45 \
              hover:bg-opacity-50 \
              active:bg-opacity-75 \
              disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed \
              flex justify-center items-center`}
                  disabled={canBuyTicket || winnerClaimYet}
                  onClick={winnersClaimHandler}
                >
                  <div
                    className="w-2 h-2 \
                  bg-zinc-800"
                  ></div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <div className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                  {canBuyTicket ? (
                    <span>Cannot claim yet </span>
                  ) : (
                    <>
                      {winnerClaimYet ? (
                        <span>You have claimed </span>
                      ) : (
                        <div className="flex flex-col text-left">
                          {/* <span className="underline">Claim: </span> */}
                          <span>Player pot: {claimAmount} ETH </span>
                          {isWinner ? (
                            <span>Winner pot claim: {formattedWinnersSplit} ETH </span>
                          ) : (
                            <></>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/*
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
                      <>
                        {winnerClaimYet ? (
                          <span>You have claimed </span>
                        ) : (
                          <span>You won {formattedWinnersSplit} ETH </span>
                        )}
                      </>
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
                    <>
                      {playerClaimYet ? (
                        <span>You have claimed </span>
                      ) : (
                        <span>You can claim {claimAmount} ETH </span>
                      )}
                    </>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
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
