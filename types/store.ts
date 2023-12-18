import type { Action } from 'easy-peasy'
import type { IApp, Ticket } from './app'

interface StoreModel {
  round: IApp['round']
  phase: IApp['phase']
  stage: IApp['stage']
  suddenDeath: IApp['suddenDeath']
  currentPot: IApp['currentPot']
  ticketCount: IApp['ticketCount']
  voteCount: IApp['voteCount']
  tickets: IApp['tickets']
  ownedTicket: Ticket | null
  gameTab: 'ticket' | 'game'
  triggerCompletionModal: CompletionModal
  lastChangedTicket: number

  updateRound: Action<StoreModel, number>
  updatePhase: Action<StoreModel, number>
  updateStage: Action<StoreModel, number>
  updateSuddenDeath: Action<StoreModel, number>
  updateCurrentPot: Action<StoreModel, number>
  updateTicketCount: Action<StoreModel, number>
  updateVoteCount: Action<StoreModel, number>
  updateTickets: Action<StoreModel, IApp['tickets']>
  modifyTicket: Action<StoreModel, { id: number; ticket: Ticket }>
  updateOwnedTicket: Action<StoreModel, Ticket | null>
  updateGameTab: Action<StoreModel, 'ticket' | 'game'>
  updateTriggerCompletionModal: Action<StoreModel, CompletionModal>
  updateLastChangedTicket: Action<StoreModel, number>

  // ticketState: IApp['ticketStatus']
  // isAttackTime: IApp['isAttackTime']
  // ticketId: IApp['ticketId']
  // giveUpCount: IApp['giveUpCount']
  // killedCount: IApp['killedCount']
  // leaderboard
  // nextTicketPrice: IApp['nextTicketPrice']
  // increaseInPrice: IApp['increaseInPrice']
  // ticketsAvailableAtCurrentPrice: IApp['ticketsAvailableAtCurrentPrice']
  // ticketsCounter: IApp['ticketsCounter']
  // voteThreshold: IApp['voteThreshold']
  // totalPot: IApp['totalPot']
  // prizeFactor: IApp['prizeFactor'] // what last man gets
  // rankShare: IApp['rankShare']
  // countdownTime: IApp['countdownTime']
  // timeAddon: IApp['timeAddon']
  // roundTime: IApp['roundTime']
  // dayShare
  // nightShare
  // levelUp
  // gameCloseTime: IApp['gameCloseTime']
  // timeFlag: IApp['timeFlag']
  // dayTime: IApp['dayTime']
  // nightTime: IApp['nightTime']
  // safehouseCostPerNight: IApp['safehouseCostPerNight']
  // tokensPerAttack: IApp['tokensPerAttack']
  // drainRate: IApp['drainRate']
  // minPotSize: IApp['minPotSize']
  // drainSwitch: IApp['drainSwitch']
  // amountDrained: IApp['amountDrained']
  // drainStart: IApp['drainStart']

  // updateIsAttackTime: Action<StoreModel, boolean>
  // updateTicketId: Action<StoreModel, number>
  // updateGiveUpCount: Action<StoreModel, number>
  // updateKilledCount: Action<StoreModel, number>
  // leaderboard
  // updateNextTicketPrice: Action<StoreModel, number>
  // updateIncreaseInPrice: Action<StoreModel, number>
  // updateTicketsAvailableAtCurrentPrice: Action<StoreModel, number>
  // updateTicketsIncreaseMultiple: Action<StoreModel, number>
  // updateVoteThreshold: Action<StoreModel, number>
  // updateTotalPot: Action<StoreModel, number>
  // updateDrainPot: Action<StoreModel, number>
  // updatePotToSplit: Action<StoreModel, number>
  // sumReciprocal
  // updatePrizeFactor: Action<StoreModel, number> // what last man gets
  // lastMan
  // feePool
  // updateNextPot: Action<StoreModel, number>
  // rankShare
  // updateCountdownTime: Action<StoreModel, number>
  // updateTimeAddon: Action<StoreModel, number>
  // updateRoundTime: Action<StoreModel, number>
  // dayShare
  // nightShare
  // levelUp
  // updateGameCloseTime: Action<StoreModel, number>
  // updateTimeFlag: Action<StoreModel, number>
  // updateDayTime: Action<StoreModel, number>
  // updateNightTime: Action<StoreModel, number>
  // updateSafehouseCostPerNight: Action<StoreModel, number>
  // updateTokensPerAttack: Action<StoreModel, number>
  // updateDrainRate: Action<StoreModel, number>
  // updateMinPotSize: Action<StoreModel, number>
  // updateDrainSwitch: Action<StoreModel, boolean>
  // updateAmountDrained: Action<StoreModel, number>
  // updateDrainStart: Action<StoreModel, number>
  // addTicket: Action<StoreModel, Ticket>
}

type CompletionModal = {
  state: string
  isOpen: boolean
}

export type { StoreModel }
