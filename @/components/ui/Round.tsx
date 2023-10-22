import { cn } from '@/lib/utils'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../../store'
import { Badge } from './badge'

// type RoundType = {
//   round: IApp['round']
//   phaseType: IApp['phase']
// }

const Round = () => {
  const round = useStoreState((state) => state.round)

  return (
    <div className="flex flex-col items-center mb-2">
      <div>
        <p className="text-2xl">
          Round <span className="text-3xl underline">{round}</span>
        </p>
      </div>

      <div className="flex flex-row gap-4 text-2xl">
        <Badge>Normal</Badge>
        <Badge>Sudden Death</Badge>
        <Badge>Drain</Badge>
      </div>
    </div>
  )
}

export default Round
