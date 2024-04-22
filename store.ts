import { createStore, action, createTypedHooks } from 'easy-peasy'

import type { Action } from 'easy-peasy'

type GameEndModal = {
  isOpen: boolean
}

interface StoreModel {
  canBuyTicket: boolean
  // fundedAmount: number
  // fundersToAmt: number
  // fundersShare: number
  // fundersPot: number
  // fundersClaimed: boolean

  canClaim: boolean
  unclaimedPot: number
  rolloverShare: number
  rolloverPot: number
  referralsPot: number

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
  // canFundPot: boolean
  playerToProfileId: number
  minAllowedNumber: number
  maxAllowedNumber: number
  closeTime: number
  endGameFlag: number
  playersShare: number
  referralsShare: number
  playersPot: number

  numberList: number[]
  averageList: number[]
  referral: string
  GameEndModal: GameEndModal

  updateCanBuyTicket: Action<StoreModel, boolean>
  // updateFundedAmount: Action<StoreModel, number>
  // updateFundersToAmt: Action<StoreModel, number>
  // updateFundersShare: Action<StoreModel, number>
  // updateFundersPot: Action<StoreModel, number>
  // updateFundersClaimed: Action<StoreModel, boolean>
  updateCanClaim: Action<StoreModel, boolean>
  updateUnclaimedPot: Action<StoreModel, number>
  updateRolloverShare: Action<StoreModel, number>
  updateRolloverPot: Action<StoreModel, number>
  updateReferralsPot: Action<StoreModel, number>

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
  updatePlayerToProfileId: Action<StoreModel, number>
  updateMinAllowedNumber: Action<StoreModel, number>
  updateMaxAllowedNumber: Action<StoreModel, number>
  updateCloseTime: Action<StoreModel, number>
  updateEndGameFlag: Action<StoreModel, number>
  updatePlayersShare: Action<StoreModel, number>
  updateReferralsShare: Action<StoreModel, number>
  updatePlayersPot: Action<StoreModel, number>

  updateNumberList: Action<StoreModel, number[]>
  updateAverageList: Action<StoreModel, number[]>
  updateReferral: Action<StoreModel, string>
  updateGameEndModal: Action<StoreModel, GameEndModal>
}

export const appStore = createStore<StoreModel>({
  canBuyTicket: false,
  // fundedAmount: 0,
  // fundersToAmt: 0,
  // fundersShare: 0,
  // fundersPot: 0,
  // fundersClaimed: false,
  canClaim: false,
  unclaimedPot: 0,
  rolloverShare: 0,
  rolloverPot: 0,
  referralsPot: 0,

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
  // canFundPot: false,
  playerToProfileId: 0,
  minAllowedNumber: 0,
  maxAllowedNumber: 0,
  closeTime: 0,
  endGameFlag: 0,
  playersShare: 0,
  referralsShare: 0,
  playersPot: 0,

  numberList: [],
  averageList: [],
  referral: '',
  GameEndModal: {
    isOpen: false,
  },

  updateCanBuyTicket: action((state, payload) => {
    state.canBuyTicket = payload
  }),

  // updateFundedAmount: action((state, payload) => {
  //   state.fundedAmount = payload
  // }),
  // updateFundersToAmt: action((state, payload) => {
  //   state.fundersToAmt = payload
  // }),
  // updateFundersShare: action((state, payload) => {
  //   state.fundersShare = payload
  // }),
  // updateFundersPot: action((state, payload) => {
  //   state.fundersPot = payload
  // }),
  // updateFundersClaimed: action((state, payload) => {
  //   state.fundersClaimed = payload
  // }),

  updateCanClaim: action((state, payload) => {
    state.canClaim = payload
  }),
  updateUnclaimedPot: action((state, payload) => {
    state.unclaimedPot = payload
  }),
  updateRolloverShare: action((state, payload) => {
    state.rolloverShare = payload
  }),
  updateRolloverPot: action((state, payload) => {
    state.rolloverPot = payload
  }),
  updateReferralsPot: action((state, payload) => {
    state.referralsPot = payload
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

  updatePlayerToProfileId: action((state, payload) => {
    state.playerToProfileId = payload
  }),
  updateMinAllowedNumber: action((state, payload) => {
    state.minAllowedNumber = payload
  }),

  updateMaxAllowedNumber: action((state, payload) => {
    state.maxAllowedNumber = payload
  }),
  updateCloseTime: action((state, payload) => {
    state.closeTime = payload
  }),
  updateEndGameFlag: action((state, payload) => {
    state.endGameFlag = payload
  }),
  updatePlayersShare: action((state, payload) => {
    state.playersShare = payload
  }),
  updateReferralsShare: action((state, payload) => {
    state.referralsShare = payload
  }),
  updatePlayersPot: action((state, payload) => {
    state.playersPot = payload
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

  updateGameEndModal: action((state, payload) => {
    state.GameEndModal = payload
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
