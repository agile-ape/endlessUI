import React, { useEffect, useState } from 'react'
import type { MouseEventHandler } from 'react'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'

type TimeLeftType = {
  hours: number
  minutes: number
  seconds: number
}

const useStore = () => {
  const round = useStoreState((state) => state.round)
  const timeFlag = useStoreState((state) => state.timeFlag)
  const roundTime = useStoreState((state) => state.roundTime)

  return {
    round,
    timeFlag,
    roundTime,
  }
}

export default function Average() {
  const currentAverage = 5102
  const ticketsBought = 100

  return (
    <>
      <div className="flex flex-col items-center gap-2 justify-center py-2 px-4 border border-gray-700 my-2 rounded-xl">
        <div className="text-gray-400">Current Average</div>
        <div
          className="
            font-digit text-3xl"
        >
          {currentAverage}
        </div>
        <div className="text-gray-400">
          🎟 Tickets bought: <span className="font-digit text-2xl">{ticketsBought}</span>
        </div>
      </div>
    </>
  )
}
