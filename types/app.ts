interface Ticket {
  user: string
  contractAddress: string
  id: number
  sign: string
  vote: boolean
  potClaim: number
  redeemValue: number
  attacks: number
  attackCount: number
  status: number
  lastSeen: number
  isInPlay: boolean
  value: number
  purchasePrice: number
  killCount: number
  killedBy: number
  safehouseNights: number
  checkOutRound: number
  rank: number
  buddy: number
  buddyCount: number
}

interface IApp {
  round: number
  phase:
    | 'deployed'
    | 'start'
    | 'day'
    | 'night'
    | 'lastmanfound'
    | 'peacefound'
    | 'drain'
    | 'gameclosed'
  ticketStatus: 'new' | 'submitted' | 'checked' | 'safe' | 'dead' | 'exited'

  stage: number
  suddenDeath: number
  currentPot: number
  ticketCount: number
  voteCount: number
  nextTicketPrice: number
  tokenBalance: number

  tickets: Ticket[]
}

export type { IApp, Ticket }
