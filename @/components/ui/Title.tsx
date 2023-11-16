import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import dynamic from 'next/dynamic'

type TitleType = {
  stageType: IApp['phase']
}

const countdownPhrase = [
  'wake up. the matrix has you. follow the white rabbit',
  'entry fee is the lowest they will ever be',
  'how long can you endure before breaking',
  'do you think thats air you are breathing now',
]

const dayPhrase = [
  'easy peasy lemon squeezy',
  'Again. submit keyword to stay in the game',
  'check in to the safehouse to take a break',
  'hold on. it gets better over time',
  'smells of napalm in the morning.',
]

const nightPhrase = [
  'you can run. but you cannot hide',
  'its always darkest before the dawn',
  'what you gonna do when they come for you',
  'attack is the best defence',
]

const title: Record<any, string> = {
  whitelist: 'Join the whitelist to buy your ticket early',
  beginnings: 'Come on up to get your ticket',
  countdown: countdownPhrase[Math.floor(Math.random() * countdownPhrase.length)],
  day: dayPhrase[Math.floor(Math.random() * dayPhrase.length)],
  dusk: 'I smell blood in the air',
  night: nightPhrase[Math.floor(Math.random() * nightPhrase.length)],
  lastmanfound: 'A hero stands, triumphant',
}

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

const Title: FC<TitleType> = ({ stageType }) => {
  const [completedTyping, setCompletedTyping] = useState(false)
  const [displayResponse, setDisplayResponse] = useState('')

  useEffect(() => {
    setCompletedTyping(false)

    let i = 0
    const stringResponse = title[stageType]

    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i))

      i++

      if (i > stringResponse.length) {
        clearInterval(intervalId)
        setCompletedTyping(true)
      }
    }, 60)

    return () => clearInterval(intervalId)
  }, [stageType])

  return (
    <p className="text-sm mx-3 leading-tight sm:text-lg sm:leading-8 font-whitrabt text-lime-700 dark:text-lime-300 rounded-xl capitalize">
      {displayResponse}
      {!completedTyping && <CursorSVG />}
    </p>
  )
}

export default dynamic(() => Promise.resolve(Title), {
  ssr: false,
})
