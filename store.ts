import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'
import type { IApp } from 'types/app'
import { phasePayload, statusPayload } from '@/lib/utils'

export const appStore = createStore<StoreModel>({
  phase: 'start',
  ticketState: 'new',
  // game:,
  round: 0,

  // randNumber:,
  isAttackTime: false,

  ticketId: 0,
  ticketCount: 0,
  giveUpCount: 0,
  killedCount: 0,
  // leaderboard

  nextTicketPrice: 0,
  increaseInPrice: 1 * 1e16,
  ticketsAvailableAtCurrentPrice: 10,
  // ticketsIncreaseMultiple: 2,
  ticketsCounter: 1,

  voteThreshold: 50,
  totalPot: 0,
  currentPot: 0,
  // drainPot: 0,
  // potToSplit: 0,
  // sumReciprocal
  prizeFactor: 0, // what last man gets
  // lastMan
  // feePool
  // nextPot: 0,
  voteCount: 0,
  rankShare: 0,

  /*-- time is seconds ----*/
  countdownTime: 216000,
  timeAddon: 60,
  roundTime: 3600,
  // dayShare
  // nightShare
  // levelUp
  suddenDeath: 3,
  gameCloseTime: 3600,
  timeFlag: 0,
  dayTime: 1800,
  nightTime: 1800,

  safehouseCostPerNight: 2000,
  tokensPerAttack: 1000,

  drainRate: 100,
  minPotSize: 200,
  drainSwitch: false,
  amountDrained: 0,
  drainStart: 0,
  // drainPerRound: 0,

  // totalPrizePool: 0,
  // nextPrizeAmount: 0,
  // topPrize: 0,
  // bounty: 0,
  // currentTicketCount: 0,
  // totalTicketCount: 0,
  // suddenDeath: 0, //if this value doesn't change, how should we call it?

  // insertKeyword: action((state, payload) => {
  //   console.log('insertKeyword', payload)
  // }),

  updatePhase: action((state, payload) => {
    state.phase = phasePayload[payload]
  }),

  updateRound: action((state, payload) => {
    state.round = payload
  }),

  updateIsAttackTime: action((state, payload) => {
    state.isAttackTime = payload
  }),

  updateTicketId: action((state, payload) => {
    state.ticketId = payload
  }),

  updateTicketCount: action((state, payload) => {
    state.ticketCount = payload
  }),

  updateGiveUpCount: action((state, payload) => {
    state.giveUpCount = payload
  }),

  updateKilledCount: action((state, payload) => {
    state.killedCount = payload
  }),

  // leaderboard

  updateNextTicketPrice: action((state, payload) => {
    state.nextTicketPrice = payload
  }),

  updateIncreaseInPrice: action((state, payload) => {
    state.increaseInPrice = payload
  }),

  updateTicketsAvailableAtCurrentPrice: action((state, payload) => {
    state.ticketsAvailableAtCurrentPrice = payload
  }),

  // updateTicketsIncreaseMultiple: action((state, payload) => {
  //   state.ticketsIncreaseMultiple = payload
  // }),

  updateVoteThreshold: action((state, payload) => {
    state.voteThreshold = payload
  }),

  updateTotalPot: action((state, payload) => {
    state.totalPot = payload
  }),

  updateCurrentPot: action((state, payload) => {
    state.currentPot = payload
  }),

  // updateDrainPot: action((state, payload) => {
  //   state.drainPot = payload
  // }),

  // updatePotToSplit: action((state, payload) => {
  //   state.potToSplit = payload
  // }),

  // sumReciprocal
  updatePrizeFactor: action((state, payload) => {
    state.prizeFactor = payload
  }),
  // what last man gets
  // lastMan
  // feePool
  // updateNextPot: action((state, payload) => {
  //   state.nextPot = payload
  // }),

  updateVoteCount: action((state, payload) => {
    state.voteCount = payload
  }),

  // rankShare

  updateCountdownTime: action((state, payload) => {
    state.countdownTime = payload
  }),

  updateTimeAddon: action((state, payload) => {
    state.timeAddon = payload
  }),

  updateRoundTime: action((state, payload) => {
    state.roundTime = payload
  }),

  // dayShare
  // nightShare
  // levelUp
  updateSuddenDeath: action((state, payload) => {
    state.suddenDeath = payload
  }),

  updateGameCloseTime: action((state, payload) => {
    state.gameCloseTime = payload
  }),

  updateTimeFlag: action((state, payload) => {
    state.timeFlag = payload
  }),

  updateDayTime: action((state, payload) => {
    state.dayTime = payload
  }),

  updateNightTime: action((state, payload) => {
    state.nightTime = payload
  }),

  updateSafehouseCostPerNight: action((state, payload) => {
    state.safehouseCostPerNight = payload
  }),

  updateTokensPerAttack: action((state, payload) => {
    state.tokensPerAttack = payload
  }),

  updateDrainRate: action((state, payload) => {
    state.drainRate = payload
  }),

  updateMinPotSize: action((state, payload) => {
    state.minPotSize = payload
  }),

  updateDrainSwitch: action((state, payload) => {
    state.drainSwitch = payload
  }),

  updateAmountDrained: action((state, payload) => {
    state.amountDrained = payload
  }),

  updateDrainStart: action((state, payload) => {
    state.drainStart = payload
  }),

  // updateDrainPerRound: action((state, payload) => {
  //   state.drainPerRound = payload
  // }),

  // // PREVIOUS
  // updateTotalPrizePool: action((state, payload) => {
  //   state.totalPrizePool = payload
  // }),
  // updateNextPrizeAmount: action((state, payload) => {
  //   state.nextPrizeAmount = payload
  // }),
  // updateTopPrize: action((state, payload) => {
  //   state.topPrize = payload
  // }),
  // updateBounty: action((state, payload) => {
  //   state.bounty = payload
  // }),
  // updateCurrentTicketCount: action((state, payload) => {
  //   state.currentTicketCount = payload
  // }),
  // updateTotalTicketCount: action((state, payload) => {
  //   state.totalTicketCount = payload
  // }),
  // updateSuddenDeath: action((state, payload) => {
  //   state.suddenDeath = payload
  // }),

  tickets: [],
  updateTickets: action((state, payload) => {
    state.tickets = payload
  }),
  addTicket: action((state, payload) => {
    state.tickets.push(payload)
  }),
  // addTicket: action((state, payload) => {
  //   state.tickets.push(payload)
  // }),
  gameTab: 'game',
  updateGameTab: action((state, payload) => {
    state.gameTab = payload
  }),
  triggerCompletionModal: {
    isOpen: false,
    state: '',
  },
  updateTriggerCompletionModal: action((state, payload) => {
    state.triggerCompletionModal = payload
  }),

  userTicket: null,
  updateUserTicket: action((state, payload) => {
    state.userTicket = payload
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
