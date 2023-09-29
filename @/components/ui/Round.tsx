import { cn } from '@/lib/utils'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../../store'

// type RoundType = {
//   round: IApp['round']
//   phaseType: IApp['phase']
// }

const Round = () => {

  const round = useStoreState((state) => state.round);

  return (
    <p className='text-xl'>
      Round{' '} 
      <span className="text-2xl underline">{round}</span>
    </p>
  )
}

export default Round
