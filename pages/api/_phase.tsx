import type { NextApiRequest, NextApiResponse } from 'next'
// import { publicClient } from '../../services/server_utils'
import { GAME_ADDRESS } from '../../services/constant'
import { GAME_ABI } from '../../services/abi/game'
import type { IApp } from 'types/app'
// import { phasePayload } from '@/lib/utils'
type ResponseData = {
  message: string
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
//   const phase = await publicClient
//     .readContract({
//       address: GAME_ADDRESS,
//       abi: GAME_ABI,
//       functionName: 'phase',
//     })
//     .catch(() => 0)

//   const currentPhase = phasePayload[phase] || 'unknown'
//   console.log(currentPhase)

//   res.status(200).json({
//     message: currentPhase,
//     // message: 'night',
//   })
// }
