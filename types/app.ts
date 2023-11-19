interface Ticket {
  id: number
  user_address: string
  ticket_value: number
  purchase_time: number
}

interface IApp {
  phase: 'start' | 'day' | 'night' | 'lastmanfound' | 'peacefound' | 'drain' | 'gameclosed'
  ticketState: 'new' | 'submitted' | 'checked' | 'safe' | 'dead' | 'exited'

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
  // rankShare

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

export type { IApp }
