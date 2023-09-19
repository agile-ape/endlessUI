interface Ticket {
  id: number
  user_address: string
  ticket_value: number
  purchase_time: number
}

interface IApp {
  phase: 'beginnings' | 'countdown' | 'day' | 'dusk' | 'night' | 'lastmanfound'
  round: number
  ticketState: 'default' | 'checked' | 'checkin' | 'dead' | 'redeemed' | 'beforeBuy'
  id: bigint
  tickets: Ticket[]
  // disabled: boolean
}

export type { IApp }
