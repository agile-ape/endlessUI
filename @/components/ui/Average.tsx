'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useReadContracts, useWatchContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import BuyTicket from './BuyTicket'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import Grid from './Grid'
import { Button } from '../shadcn/button'
import { useStoreActions, useStoreState } from '../../../store'

export default function Average() {
  /* read contract
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'currentAverage',
      },
      {
        ...defaultContractObj,
        functionName: 'computeLeaderboard',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketIdCounter',
      },
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
    ],
  })
  
  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'NewTicketBought',
    onLogs() {
      refetch()
    },
    poll: true,
  })
  
  const currentAverage = Number(data?.[0].result || BigInt(0))
  const leaderboard: readonly bigint[] = data?.[1].result || []
  const ticketsBought = Number(data?.[2].result || BigInt(0))
  const canBuyTicket = Boolean(data?.[3].result || false)
  
  let winningNumbers: number[] = []
  
  for (let i = 0; i < leaderboard.length; i++) {
    winningNumbers[i] = Number(leaderboard[i])
  }
  */

  const canBuyTicket = useStoreState((state) => state.canBuyTicket)
  const leaderboard = useStoreState((state) => state.leaderboard)
  const ticketsBought = useStoreState((state) => state.ticketsBought)

  // const spinDisplay = () => {
  //   setIsSpinning(true)
  //   const randomNum = Math.floor(Math.random() * 10)
  //   setShowDisplay(randomNum)

  //   setTimeout(() => {
  //     setIsSpinning(false)
  //     setShowDisplay(currentAverage)
  //   }, 2000)
  // }

  const currentAverage = useStoreState((state) => state.currentAverage)
  const [showAverage, setShowAverage] = useState(currentAverage)
  // const [isFirstRender, setIsFirstRender] = useState(true)

  const isFirstRender = useRef(true)
  /* 
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentAverage > showAverage) {
        setShowAverage((prevNumber) => {
          if (prevNumber < currentAverage) {
            return prevNumber + 1
          } else {
            clearInterval(interval)
            return prevNumber
          }
        })
      } else if (currentAverage < showAverage) {
        setShowAverage((prevNumber) => {
          if (prevNumber >= currentAverage) {
            return prevNumber - 1
          } else {
            clearInterval(interval)
            return prevNumber
          }
        })
      }
    }, 10)

    return () => clearInterval(interval)
  }, [currentAverage])
  */

  /*
  useEffect(() => {
    console.log(isFirstRender)
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false
      const initialInterval = setInterval(() => {
        setShowAverage((prevNumber) => {
          if (prevNumber < currentAverage) {
            return prevNumber + 1
          } else {
            clearInterval(initialInterval)
            return prevNumber
          }
        })
      }, 10) // Interval for the first render
    } else {
      // Subsequent renders
      const interval = setInterval(() => {
        if (currentAverage > showAverage) {
          setShowAverage((prevNumber) => {
            if (prevNumber < currentAverage) {
              return prevNumber + 1
            } else {
              clearInterval(interval)
              return prevNumber
            }
          })
        } else if (currentAverage < showAverage) {
          setShowAverage((prevNumber) => {
            if (prevNumber >= currentAverage) {
              return prevNumber - 1
            } else {
              clearInterval(interval)
              return prevNumber
            }
          })
        }
      }, 300) // Interval for subsequent renders

      return () => clearInterval(interval)
    }
  }, [isFirstRender, currentAverage])
  */

  useEffect(() => {
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      // Subsequent renders
      const interval = setInterval(() => {
        if (currentAverage > showAverage) {
          setShowAverage((prevNumber) => {
            if (prevNumber < currentAverage) {
              return prevNumber + 1
            } else {
              clearInterval(interval)
              return prevNumber
            }
          })
        } else if (currentAverage < showAverage) {
          setShowAverage((prevNumber) => {
            if (prevNumber >= currentAverage) {
              return prevNumber - 1
            } else {
              clearInterval(interval)
              return prevNumber
            }
          })
        }
      }, 300) // Interval for subsequent renders

      return () => clearInterval(interval)
    }
  }, [currentAverage])

  return (
    <div
      className="gap-2 py-2 px-2 my-2 \
      flex flex-col items-center justify-center"
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="average"
            className="h-20 flex flex-col items-center \
      rounded-lg px-6"
          >
            {canBuyTicket ? 'Current Average' : 'Final Average'}
            {/*  */}
            <div className="font-digit text-3xl">{showAverage}</div>
            {/* <AnimatedNumbers animateToNumber={showAverage}  /> */}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-transparent flex flex-col justify-center items-center">
          <Grid />
        </DialogContent>
      </Dialog>

      <BuyTicket />
    </div>
  )
}
