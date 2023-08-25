import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'

type TitleType = {
  stageType: IApp['stage']
}

const dayPhrase = [
  'easy peasy lemon squeezy',
  'gentle reminder to check in',
  'check our twitter for keyword',
]

const nightPhrase = [
  'may the best assassin win',
  'always darkest before the dawn',
  'what you gonna do when they come for you',
]

const title = {
  whitelist: 'Join the whitelist to buy your ticket early',
  beginnings: 'Come on up to get your ticket',
  countdown: 'On your marks gentlemen',
  day: dayPhrase[Math.floor(Math.random() * dayPhrase.length)],
  dusk: 'I smell blood in the air',
  night: nightPhrase[Math.floor(Math.random() * nightPhrase.length)],
  lastmanfound: 'A hero stands, triumphant',
}

const Title: FC<TitleType> = ({ stageType }) => {
  return <p className="text-3xl uppercase"> {title[stageType]} </p>
}

export default Title
