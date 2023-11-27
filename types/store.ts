import type { Action } from 'easy-peasy'
import type { IApp } from './app'

interface StoreModel {
  phase: IApp['phase']
  ticketState: IApp['ticketStatus']
  // game: IApp['game']
  round: IApp['round']

  // randNumber: IApp['randNumber']
  isAttackTime: IApp['isAttackTime']

  ticketId: IApp['ticketId']
  ticketCount: IApp['ticketCount']
  giveUpCount: IApp['giveUpCount']
  killedCount: IApp['killedCount']
  // leaderboard

  nextTicketPrice: IApp['nextTicketPrice']
  increaseInPrice: IApp['increaseInPrice']
  ticketsAvailableAtCurrentPrice: IApp['ticketsAvailableAtCurrentPrice']
  // ticketsIncreaseMultiple: IApp['ticketsIncreaseMultiple']
  ticketsCounter: IApp['ticketsCounter']

  voteThreshold: IApp['voteThreshold']
  totalPot: IApp['totalPot']
  currentPot: IApp['currentPot']
  // drainPot: IApp['drainPot']
  // potToSplit: IApp['potToSplit']
  // sumReciprocal
  prizeFactor: IApp['prizeFactor'] // what last man gets
  // lastMan
  // feePool
  // nextPot: IApp['nextPot']
  voteCount: IApp['voteCount']
  rankShare: IApp['rankShare']

  countdownTime: IApp['countdownTime']
  timeAddon: IApp['timeAddon']
  roundTime: IApp['roundTime']
  // dayShare
  // nightShare
  // levelUp
  suddenDeath: IApp['suddenDeath']
  gameCloseTime: IApp['gameCloseTime']
  timeFlag: IApp['timeFlag']
  dayTime: IApp['dayTime']
  nightTime: IApp['nightTime']

  safehouseCostPerNight: IApp['safehouseCostPerNight']
  tokensPerAttack: IApp['tokensPerAttack']

  drainRate: IApp['drainRate']
  minPotSize: IApp['minPotSize']
  drainSwitch: IApp['drainSwitch']
  amountDrained: IApp['amountDrained']
  drainStart: IApp['drainStart']
  // drainPerRound: IApp['drainPerRound']

  // // PREVIOUS
  // totalPrizePool: IApp['totalPrizePool']
  // nextPrizeAmount: IApp['nextPrizeAmount']
  // topPrize: IApp['topPrize']
  // bounty: IApp['bounty']
  // currentTicketCount: IApp['currentTicketCount']
  // totalTicketCount: IApp['totalTicketCount']

  updatePhase: Action<StoreModel, number>

  updateRound: Action<StoreModel, number>
  updateIsAttackTime: Action<StoreModel, boolean>
  updateTicketId: Action<StoreModel, number>
  updateTicketCount: Action<StoreModel, number>
  updateGiveUpCount: Action<StoreModel, number>
  updateKilledCount: Action<StoreModel, number>
  // leaderboard

  updateNextTicketPrice: Action<StoreModel, number>
  updateIncreaseInPrice: Action<StoreModel, number>
  updateTicketsAvailableAtCurrentPrice: Action<StoreModel, number>
  // updateTicketsIncreaseMultiple: Action<StoreModel, number>

  updateVoteThreshold: Action<StoreModel, number>
  updateTotalPot: Action<StoreModel, number>
  updateCurrentPot: Action<StoreModel, number>
  // updateDrainPot: Action<StoreModel, number>
  // updatePotToSplit: Action<StoreModel, number>
  // sumReciprocal
  updatePrizeFactor: Action<StoreModel, number> // what last man gets
  // lastMan
  // feePool
  // updateNextPot: Action<StoreModel, number>
  updateVoteCount: Action<StoreModel, number>
  // rankShare

  updateCountdownTime: Action<StoreModel, number>
  updateTimeAddon: Action<StoreModel, number>
  updateRoundTime: Action<StoreModel, number>
  // dayShare
  // nightShare
  // levelUp
  updateSuddenDeath: Action<StoreModel, number>
  updateGameCloseTime: Action<StoreModel, number>
  updateTimeFlag: Action<StoreModel, number>
  updateDayTime: Action<StoreModel, number>
  updateNightTime: Action<StoreModel, number>

  updateSafehouseCostPerNight: Action<StoreModel, number>
  updateTokensPerAttack: Action<StoreModel, number>

  updateDrainRate: Action<StoreModel, number>
  updateMinPotSize: Action<StoreModel, number>
  updateDrainSwitch: Action<StoreModel, boolean>
  updateAmountDrained: Action<StoreModel, number>
  updateDrainStart: Action<StoreModel, number>
  // updateDrainPerRound: Action<StoreModel, number>

  // insertKeyword: Action<StoreModel, string>
  // // PREVIOUS
  // updateTotalPrizePool: Action<StoreModel, number>
  // updateNextPrizeAmount: Action<StoreModel, number>
  // updateTopPrize: Action<StoreModel, number>
  // updateBounty: Action<StoreModel, number>
  // updateCurrentTicketCount: Action<StoreModel, number>
  // updateTotalTicketCount: Action<StoreModel, number>
  // updateSuddenDeath: Action<StoreModel, number>
  tickets: IApp['tickets']
  updateTickets: Action<StoreModel, IApp['tickets']>
  gameTab: 'ticket' | 'game'
  updateGameTab: Action<StoreModel, 'ticket' | 'game'>
  triggerCompletionModal: CompletionModal
  updateTriggerCompletionModal: Action<StoreModel, CompletionModal>
}

type CompletionModal = {
  state: string
  isOpen: boolean
}

export type { StoreModel }
