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

  game: string

  round: number
  // keyword
  randNumber: number
  isAttackTime: boolean

  ticketId: number
  ticketCount: number
  giveUpCount: number
  killedCount: number
  // leaderboard

  nextTicketPrice: number
  increaseInPrice: number
  ticketsAvailableAtCurrentPrice: number
  ticketsIncreaseMultiple: number
  ticketsCounter: number

  voteThreshold: number
  totalPot: number
  currentPot: number
  drainPot: number
  potToSplit: number
  // sumReciprocal
  prizeFactor: number // what last man gets
  // lastMan
  // feePool
  nextPot: number
  voteCount: number
  rankShare: number

  countdownTime: number
  timeAddon: number
  roundTime: number
  // dayShare
  // nightShare
  // levelUp
  suddenDeath: number
  gameCloseTime: number
  timeFlag: number
  dayTime: number
  nightTime: number

  safehouseCostPerNight: number
  tokensPerAttack: number

  drainRate: number
  minPotSize: number
  drainSwitch: boolean
  amountDrained: number
  drainStart: number
  drainPerRound: number

  // PREVIOUS
  // totalPrizePool: number
  // nextPrizeAmount: number
  // topPrize: number
  // bounty: number
  // totalTicketCount: number
  tickets: Ticket[]
  // disabled: boolean
}

export type { IApp, Ticket }
