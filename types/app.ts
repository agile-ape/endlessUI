interface IApp {
  stage: 'beginnings' | 'countdown' | 'day' | 'dusk' | 'night' | 'lastmanfound'
  round: number
  ticketState: 'default' | 'checked' | 'checkin' | 'dead' | 'redeemed' | 'beforeBuy'
  // disabled: boolean
}

export type { IApp }
