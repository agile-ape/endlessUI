import type { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../services/server_utils'
import { LAST_MAN_STANDING_ADDRESS } from '../../services/constant'
import { LAST_MAN_STANDING_ABI } from '../../services/abi/last_man_standing'
import type { IApp } from 'types/app'

type ResponseData = {
  message: string
}

const stagePayload: Record<number, IApp['phase']> = {
  0: 'beginnings',
  1: 'countdown',
  2: 'day',
  3: 'dusk',
  4: 'night',
  5: 'lastmanfound',
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const phase = await publicClient
    .readContract({
      address: LAST_MAN_STANDING_ADDRESS,
      abi: LAST_MAN_STANDING_ABI,
      functionName: 'phase',
    })
    .catch(() => 0)

  const currentPhase = stagePayload[phase] || 'unknown'

  res.status(200).json({
    message: currentPhase,
  })
}
