import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'
import type { IApp } from 'types/app'

export const appStore = createStore<StoreModel>({
  canBuyTicket: false,
  ticketPrice: 0,
  buyTicketDelayCeiling: 0,
  roundTime: 0,
  feeShare: 0,
  startingPassRate: 0,
  auctionPrice: 0,
  poohPerRoll: 0,
  passRateRange: 0,
  passRateFloor: 0,

  round: 0,
  timeFlag: 0,
  buyFlag: 0,
  potFlag: 0,
  ticketIdCounter: 0,
  ticketCount: 0,

  currentPot: 0,
  tokenBalance: 0,
  auctionAllowance: 0,
  totalPoohSupply: 0,

  tickets: [],
  events: [],

  ownedTickets: [],
  triggerCompletionModal: {
    isOpen: false,
    state: '',
    result: 0,
  },
  lastChangedTicket: 0,

  updateCanBuyTicket: action((state, payload) => {
    state.canBuyTicket = payload
  }),

  updateTicketPrice: action((state, payload) => {
    state.ticketPrice = payload
  }),

  updateBuyTicketDelayCeiling: action((state, payload) => {
    state.buyTicketDelayCeiling = payload
  }),

  updateRoundTime: action((state, payload) => {
    state.roundTime = payload
  }),

  updateFeeShare: action((state, payload) => {
    state.feeShare = payload
  }),

  updateStartingPassRate: action((state, payload) => {
    state.startingPassRate = payload
  }),

  updateAuctionPrice: action((state, payload) => {
    state.auctionPrice = payload
  }),

  updatePoohPerRoll: action((state, payload) => {
    state.poohPerRoll = payload
  }),

  updatePassRateRange: action((state, payload) => {
    state.passRateRange = payload
  }),

  updatePassRateFloor: action((state, payload) => {
    state.passRateFloor = payload
  }),

  updateRound: action((state, payload) => {
    state.round = payload
  }),

  updateTimeFlag: action((state, payload) => {
    state.timeFlag = payload
  }),

  updateBuyFlag: action((state, payload) => {
    state.buyFlag = payload
  }),

  updatePotFlag: action((state, payload) => {
    state.potFlag = payload
  }),

  updateTicketIdCounter: action((state, payload) => {
    state.ticketIdCounter = payload
  }),

  updateTicketCount: action((state, payload) => {
    state.ticketCount = payload
  }),

  updateCurrentPot: action((state, payload) => {
    state.currentPot = payload
  }),

  updateTokenBalance: action((state, payload) => {
    state.tokenBalance = payload
  }),

  updateAuctionAllowance: action((state, payload) => {
    state.auctionAllowance = payload
  }),

  updateTotalPoohSupply: action((state, payload) => {
    state.totalPoohSupply = payload
  }),

  updateTickets: action((state, payload) => {
    state.tickets = payload
  }),

  updateEvents: action((state, payload) => {
    state.events = payload
  }),

  modifyTicket: action((state, payload) => {
    const existingTicket = state.tickets.find((ticket) => ticket.id === payload.id)

    if (existingTicket) {
      const index = state.tickets.indexOf(existingTicket)
      state.tickets[index] = payload.ticket
    } else {
      state.tickets.push(payload.ticket)
    }
  }),

  updateOwnedTickets: action((state, payload) => {
    state.ownedTickets = payload
  }),

  updateTriggerCompletionModal: action((state, payload) => {
    state.triggerCompletionModal = payload
  }),

  updateLastChangedTicket: action((state, payload) => {
    state.lastChangedTicket = payload
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
