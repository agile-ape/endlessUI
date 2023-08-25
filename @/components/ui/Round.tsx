import { cn } from '@/lib/utils'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'

type RoundType = {
  round: IApp['round'],
  stageType: IApp['stage']
}

const Round: FC<RoundType> = ({ round, stageType }) => {
  return <p className={cn(
    'text-xl',
    (stageType === "dusk" || stageType === "beginnings" || stageType === "night") && 'text-white',
    (stageType === "day") && 'text-black' 
  )}> Round {round}</p>
}

export default Round
