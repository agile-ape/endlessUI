import type { NextApiRequest, NextApiResponse } from 'next'
import { publicClient } from '../../services/server_utils'
import { LAST_MAN_STANDING_ADDRESS } from '../../services/constant'
import { LAST_MAN_STANDING_ABI } from '../../services/abi/last_man_standing'
import type { IApp } from 'types/app'
import { supabase } from '../../services/supabase'

type ResponseData = {
  message: string
  data?: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const body = JSON.parse(req.body)

      await supabase
        .from('ticket_list')
        .insert({
          ticket_id: body.id,
          ticket_value: body.ticket_value,
          purchase_time: body.purchase_time,
          user_address: body.user_address,
          contract_address: LAST_MAN_STANDING_ADDRESS,
        })
        .throwOnError()

      return res.status(200).json({
        message: 'success insert ticket',
      })
    } catch (error) {
      console.log({ error })

      return res.status(500).json({
        message: 'error insert ticket',
      })
    }
  }

  try {
    const ticketList = await supabase
      .from('ticket_list')
      .select('*')
      .eq('contract_address', LAST_MAN_STANDING_ADDRESS)
      .throwOnError()

    res.status(200).json({
      message: 'success get ticket',
      data: ticketList.data || [],
    })
  } catch (error) {
    console.log({ error })

    res.status(500).json({
      message: 'error get ticket',
    })
  }
}
