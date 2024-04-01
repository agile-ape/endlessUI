import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import dynamic from 'next/dynamic'
import { useStoreState } from '../../../store'

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
  const [completedTyping, setCompletedTyping] = useState(false)
  const [displayResponse, setDisplayResponse] = useState('')

  // const { isConnected } = useAccount()

  useEffect(() => {
    setCompletedTyping(false)

    let i = 0
    let stringResponse = 'FLOP THE AVERAGE'

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
    <div className="text-3xl font-digit text-gray-400 mx-3 capitalize">
      <p>
        {displayResponse}
        {!completedTyping && <CursorSVG />}
      </p>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Title), {
  ssr: false,
})
