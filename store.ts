import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'
import type { IApp } from 'types/app'
import { phasePayload, statusPayload } from '@/lib/utils'

export const appStore = createStore<StoreModel>({
  currentPot: 0,
  round: 0,
  timeFlag: 0,
  buyFlag: 0,
  potFlag: 0,
  ticketId: 0,
  ticketCount: 0,

  canBuyTicket: false,
  ticketPrice: 0,
  buyTicketDelay: 0,
  roundTime: 0,
  feeShare: 0,
  startingPassRate: 0,
  lastMultiplier: 0,

  tokenBalance: 0,

  tickets: [],
  ownedTicket: null,
  triggerCompletionModal: {
    isOpen: false,
    state: '',
  },
  lastChangedTicket: 0,

  updateCurrentPot: action((state, payload) => {
    state.currentPot = payload
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

  updateTicketId: action((state, payload) => {
    state.ticketId = payload
  }),

  updateTicketCount: action((state, payload) => {
    state.ticketCount = payload
  }),

  updateCanBuyTicket: action((state, payload) => {
    state.canBuyTicket = payload
  }),

  updateTicketPrice: action((state, payload) => {
    state.ticketPrice = payload
  }),

  updateBuyTicketDelay: action((state, payload) => {
    state.buyTicketDelay = payload
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

  updateLastMultiplier: action((state, payload) => {
    state.lastMultiplier = payload
  }),

  updateTokenBalance: action((state, payload) => {
    state.tokenBalance = payload
  }),

  updateTickets: action((state, payload) => {
    state.tickets = payload
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

  updateOwnedTicket: action((state, payload) => {
    state.ownedTicket = payload
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
