import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'

type RoundType = {
  stageRound: string
  stageType: IApp['stage']
  title?: JSX.Element
  fontTitleSize: string
}

const Round: FC<RoundType> = ({ stageRound, stageType, title, fontTitleSize }) => {
  return (
    <div className="text-center">
      {stageType === 'beginning' && <p className="text-lg">Beginnings</p>}
      <p className="text-lg">{stageRound}</p>
      {title}
    </div>
  )
}

export default Round
