interface Ticket {
  id: number
  user_address: string
  ticket_value: number
  purchase_time: number
}

interface IApp {
  phase: 'start' | 'day' | 'night' | 'lastmanfound' | 'peacefound' | 'drain'
  round: number
  ticketState: 'default' | 'checked' | 'checkin' | 'dead' | 'redeemed' | 'beforeBuy'
  id: bigint
  totalPrizePool: number
  nextPrizeAmount: number
  topPrize: number
  bounty: number
  currentTicketCount: number
  totalTicketCount: number
  suddenDeathRound: number
  tickets: Ticket[]
  // disabled: boolean
}

export type { IApp }
