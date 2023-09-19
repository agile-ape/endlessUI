import { cn } from '@/lib/utils'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'

type RoundType = {
  round: IApp['round']
  phaseType: IApp['phase']
}

const Round: FC<RoundType> = ({ round, phaseType }) => {
  return (
    <p
      className={cn(
        'text-2xl',
        (phaseType === 'dusk' || phaseType === 'beginnings' || phaseType === 'night') &&
          'text-white',
        phaseType === 'day' && 'text-black',
      )}
    >
      Round{' '} 
      <span className="underline">{round}</span>
    </p>
  )
}

export default Round
