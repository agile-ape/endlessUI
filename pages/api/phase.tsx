import type { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../services/server_utils'
import { LAST_MAN_STANDING_ADDRESS } from '../../services/constant'
import { LAST_MAN_STANDING_ABI } from '../../services/abi/last_man_standing'
import type { IApp } from 'types/app'
import { phasePayload } from '@/lib/utils'
type ResponseData = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const phase = await publicClient
    .readContract({
      address: LAST_MAN_STANDING_ADDRESS,
      abi: LAST_MAN_STANDING_ABI,
      functionName: 'phase',
    })
    .catch(() => 0)

  const currentPhase = phasePayload[phase] || 'unknown'
  console.log(currentPhase)

  res.status(200).json({
    // message: currentPhase,
    message: 'day',
  })
}
