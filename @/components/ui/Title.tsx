import { cn } from '@/lib/utils'
import React from 'react'
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
  'remember. submit keyword to stay in the game',
  'check in to the safehouse to take a break',
  'hold on. it gets better over time. maybe',
]

const nightPhrase = [
  'you can run. but you cannot hide',
  'its always darkest before the dawn',
  'what you gonna do when they come for you',
  'attack is the best defence',
]

const title = {
  whitelist: 'Join the whitelist to buy your ticket early',
  beginnings: 'Come on up to get your ticket',
  countdown: countdownPhrase[Math.floor(Math.random() * countdownPhrase.length)],
  day: dayPhrase[Math.floor(Math.random() * dayPhrase.length)],
  dusk: 'I smell blood in the air',
  night: nightPhrase[Math.floor(Math.random() * nightPhrase.length)],
  lastmanfound: 'A hero stands, triumphant',
}

const Title: FC<TitleType> = ({ stageType }) => {
  return (
    <p className="text-md leading-tight sm:text-[2rem] sm:leading-10 font-whitrabt text-lime-700 dark:text-lime-300 rounded-xl capitalize">
      {title[stageType]}
    </p>
  )
}

export default dynamic(() => Promise.resolve(Title), {
  ssr: false,
})
