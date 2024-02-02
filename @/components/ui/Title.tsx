import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import dynamic from 'next/dynamic'
import { useStoreState } from '../../../store'
import { useAccount } from 'wagmi'
import { usePrivy, useLogin, useLogout, useWallets, useConnectWallet } from '@privy-io/react-auth'

type TitleType = {
  stageType: IApp['phase']
}

const startPhrase = [
  'wake up. the matrix has you. follow the white rabbit',
  'Fees are the lowest they will ever be',
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
  deployed: 'Fund wallet. Prepare to enter arena',
  start: startPhrase[Math.floor(Math.random() * startPhrase.length)],
  day: dayPhrase[Math.floor(Math.random() * dayPhrase.length)],
  night: nightPhrase[Math.floor(Math.random() * nightPhrase.length)],
  lastmanfound: 'A hero stands, triumphant',
  peacefound: 'Make love, drink beers, no more war',
  drain: 'an eye for an eye leaves everyone blind',
  gameclosed: 'Thanks for playing. Stay tuned for the next game',
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

// Title: FC<TitleType> = () => {
const Title = () => {
  const [completedTyping, setCompletedTyping] = useState(false)
  const [displayResponse, setDisplayResponse] = useState('')
  const phase = useStoreState((state) => state.phase)
  const { ready, authenticated, user, createWallet } = usePrivy()

  // const { isConnected } = useAccount()

  useEffect(() => {
    setCompletedTyping(false)

    let i = 0
    let stringResponse = title[phase]

    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i))

      i++

      if (i > stringResponse.length) {
        clearInterval(intervalId)
        setCompletedTyping(true)
      }
    }, 60)

    return () => clearInterval(intervalId)
  }, [phase])

  return (
    <div className="text-lg leading-tight sm:leading-8 digit-last mx-3 capitalize">
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
