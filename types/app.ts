interface IApp {
  stage: 'whitelist' | 'beginnings' | 'countdown' | 'day' | 'dusk' | 'night' | 'lastmanfound'
  round: number
  ticketState: 'default' | 'checked' | 'checkin' | 'dead' | 'redeemed' |'beforeBuy'
}

export type { IApp }
