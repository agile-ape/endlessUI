import type { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../services/server_utils'
import { LAST_MAN_STANDING_ADDRESS } from '../../services/constant'
import { LAST_MAN_STANDING_ABI } from '../../services/abi/last_man_standing'
import type { IApp } from 'types/app'
import { supabase } from '../../services/supabase'

type ResponseData = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const body = JSON.parse(req.body)
      await supabase
        .from('ticket_list')
        .insert({
          ticket_id: body.ticket_id,
          ticket_value: body.ticket_value,
        })
        .throwOnError()

      return res.status(200).json({
        message: 'hello world',
      })
    } catch (error) {
      console.log({ error })
    }
  }

  res.status(200).json({
    message: 'hello world',
  })
}
