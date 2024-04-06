interface Ticket {
  id: number
  player: string
  number: number
  isWinner: boolean
  winnerClaimYet: boolean
  playerClaimYet: boolean
}

interface Event {
  id: number
  event: string
  topics1: string
  topics2: string
  topics3: string
}

interface IApp {
  canBuyTicket: boolean
  ticketPrice: number
  buyTicketDelayCeiling: number
  roundTime: number
  feeShare: number
  startingPassRate: number
  auctionPrice: number
  poohPerRoll: number
  passRateRange: number
  passRateFloor: number

  round: number
  timeFlag: number
  buyFlag: number
  potFlag: number
  ticketIdCounter: number
  ticketCount: number

  currentPot: number
  tokenBalance: number

  auctionAllowance: number
  totalPoohSupply: number

  tickets: Ticket[]
  events: Event[]
}

export type { IApp, Ticket, Event }
