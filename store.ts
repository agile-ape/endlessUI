import { createStore, action, createTypedHooks } from 'easy-peasy'
// import type { StoreModel } from './types/store'
// import type { IApp } from 'types/app'

import type { Action } from 'easy-peasy'

type CompletionModal = {
  isOpen: boolean
  state: string
  result: number
}

interface StoreModel {
  canBuyTicket: boolean
  fundedAmount: number
  fundersToAmt: number
  fundersShare: number
  fundersPot: number
  fundersClaimed: boolean
  currentAverage: number
  leaderboard: number[]
  ticketsBought: number
  ticketPrice: bigint
  gameTime: number
  timeAddon: number
  startGameFlag: number
  totalNumber: number
  potSize: bigint
  playersPayoutFactor: number
  winnersSplit: number
  playerTickets: number[]
  winnersPot: number
  winnersShare: number

  numberList: number[]
  averageList: number[]
  referral: string
  triggerCompletionModal: CompletionModal

  updateCanBuyTicket: Action<StoreModel, boolean>
  updateFundedAmount: Action<StoreModel, number>
  updateFundersToAmt: Action<StoreModel, number>
  updateFundersShare: Action<StoreModel, number>
  updateFundersPot: Action<StoreModel, number>
  updateFundersClaimed: Action<StoreModel, boolean>
  updateCurrentAverage: Action<StoreModel, number>
  updateLeaderboard: Action<StoreModel, number[]>
  updateTicketsBought: Action<StoreModel, number>
  updateTicketPrice: Action<StoreModel, bigint>
  updateGameTime: Action<StoreModel, number>
  updateTimeAddon: Action<StoreModel, number>
  updateStartGameFlag: Action<StoreModel, number>
  updateTotalNumber: Action<StoreModel, number>
  updatePotSize: Action<StoreModel, bigint>
  updatePlayersPayoutFactor: Action<StoreModel, number>
  updateWinnersSplit: Action<StoreModel, number>
  updatePlayerTickets: Action<StoreModel, number[]>
  updateWinnersPot: Action<StoreModel, number>
  updateWinnersShare: Action<StoreModel, number>

  updateNumberList: Action<StoreModel, number[]>
  updateAverageList: Action<StoreModel, number[]>
  updateReferral: Action<StoreModel, string>
  updateTriggerCompletionModal: Action<StoreModel, CompletionModal>
}

export const appStore = createStore<StoreModel>({
  canBuyTicket: false,
  fundedAmount: 0,
  fundersToAmt: 0,
  fundersShare: 0,
  fundersPot: 0,
  fundersClaimed: false,
  currentAverage: 0,
  leaderboard: [],
  ticketsBought: 0,
  ticketPrice: BigInt(0),
  gameTime: 0,
  timeAddon: 0,
  startGameFlag: 0,
  totalNumber: 0,
  potSize: BigInt(0),
  playersPayoutFactor: 0,
  winnersSplit: 0,
  playerTickets: [],
  winnersPot: 0,
  winnersShare: 0,

  numberList: [],
  averageList: [],
  referral: '',
  triggerCompletionModal: {
    isOpen: false,
    state: '',
    result: 0,
  },

  updateCanBuyTicket: action((state, payload) => {
    state.canBuyTicket = payload
  }),
  updateFundedAmount: action((state, payload) => {
    state.fundedAmount = payload
  }),
  updateFundersToAmt: action((state, payload) => {
    state.fundersToAmt = payload
  }),
  updateFundersShare: action((state, payload) => {
    state.fundersShare = payload
  }),
  updateFundersPot: action((state, payload) => {
    state.fundersPot = payload
  }),
  updateFundersClaimed: action((state, payload) => {
    state.fundersClaimed = payload
  }),
  updateCurrentAverage: action((state, payload) => {
    state.currentAverage = payload
  }),
  updateLeaderboard: action((state, payload) => {
    state.leaderboard = payload
  }),
  updateTicketsBought: action((state, payload) => {
    state.ticketsBought = payload
  }),
  updateTicketPrice: action((state, payload) => {
    state.ticketPrice = payload
  }),
  updateGameTime: action((state, payload) => {
    state.gameTime = payload
  }),
  updateTimeAddon: action((state, payload) => {
    state.timeAddon = payload
  }),
  updateStartGameFlag: action((state, payload) => {
    state.startGameFlag = payload
  }),
  updateTotalNumber: action((state, payload) => {
    state.totalNumber = payload
  }),
  updatePotSize: action((state, payload) => {
    state.potSize = payload
  }),
  updatePlayersPayoutFactor: action((state, payload) => {
    state.playersPayoutFactor = payload
  }),
  updateWinnersSplit: action((state, payload) => {
    state.winnersSplit = payload
  }),
  updatePlayerTickets: action((state, payload) => {
    state.playerTickets = payload
  }),
  updateWinnersPot: action((state, payload) => {
    state.winnersPot = payload
  }),
  updateWinnersShare: action((state, payload) => {
    state.winnersShare = payload
  }),

  updateNumberList: action((state, payload) => {
    state.numberList = payload
  }),

  updateAverageList: action((state, payload) => {
    state.averageList = payload
  }),

  updateReferral: action((state, payload) => {
    state.referral = payload
  }),

  updateTriggerCompletionModal: action((state, payload) => {
    state.triggerCompletionModal = payload
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
