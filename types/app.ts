interface IApp {
  phase: 'beginnings' | 'countdown' | 'day' | 'dusk' | 'night' | 'lastmanfound'
  round: number
  ticketState: 'default' | 'checked' | 'checkin' | 'dead' | 'redeemed' | 'beforeBuy'
  id: bigint
  // disabled: boolean
}

export type { IApp }
