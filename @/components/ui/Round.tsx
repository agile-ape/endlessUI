import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'

type RoundType = {
  round: IApp['round']
}

const Round: FC<RoundType> = ({ round }) => {
  return <p className="text-xl"> Round {round}</p>
}

export default Round
