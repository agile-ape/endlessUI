import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import dynamic from 'next/dynamic'
import { useStoreState } from '../../../store'
import { useReadContracts, useWatchContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'

const CursorSVG = () => (
  <svg
    style={{
      display: 'inline-block',
      width: '1ch',
      animation: 'flicker 0.1s infinite',
    }}
    viewBox="8 4 8 16"
    xmlns="http://www.w3.org/2000/svg"
    className="cursor"
  >
    <rect x="10" y="6" width="4" height="12" fill="#6b7280" />
  </svg>
)

// Title: FC<TitleType> = () => {
const Title = () => {
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'canBuyTicket',
      },
    ],
  })

  const canBuyTicket = Boolean(data?.[0].result || false)

  const [completedTyping, setCompletedTyping] = useState(false)
  const [displayResponse, setDisplayResponse] = useState('')

  // const { isConnected } = useAccount()

  useEffect(() => {
    setCompletedTyping(false)

    let i = 0

    const stringResponse: string = 'FLOP THE AVERAGE'
    // canBuyTicket ? (stringResponse ) : (stringResponse = 'THANKS FOR PLAYING')

    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i))

      i++

      if (i > stringResponse.length) {
        clearInterval(intervalId)
        setCompletedTyping(true)
      }
    }, 180)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="text-3xl flex flex-col justify-center items-center">
      <div className="text-xl font-digit">Round 1</div>
      <div className="text-3xl gap-0 font-digit text-gray-400 mx-3 capitalize">
        {displayResponse}
        {!completedTyping && <CursorSVG />}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Title), {
  ssr: false,
})
