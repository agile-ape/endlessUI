interface Ticket {
  id: number
  player: string
  isInPlay: boolean
  value: number
  purchasePrice: number
  redeemValue: number
  potClaimCount: number
  passRate: number
  joinRound: number
  exitRound: number
  lastCount: number
}

interface IApp {
  currentPot: number
  round: number
  timeFlag: number
  buyFlag: number
  potFlag: number
  ticketId: number
  ticketCount: number

  canBuyTicket: boolean
  ticketPrice: number
  buyTicketDelay: number
  roundTime: number
  feeShare: number
  startingPassRate: number
  lastMultiplier: number

  tokenBalance: number

  tickets: Ticket[]
}

export type { IApp, Ticket }
