import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'
import type { IApp } from 'types/app'
import { phasePayload, statusPayload } from '@/lib/utils'

export const appStore = createStore<StoreModel>({
  round: 0,
  phase: 'deployed',
  stage: 0,
  suddenDeath: 0,
  currentPot: 0,
  ticketCount: 0,
  voteCount: 0,
  nextTicketPrice: 0,
  tokenBalance: 0,

  tickets: [],
  ownedTicket: null,
  gameTab: 'game',
  triggerCompletionModal: {
    isOpen: false,
    state: '',
  },
  lastChangedTicket: 0,

  updateRound: action((state, payload) => {
    state.round = payload
  }),

  updatePhase: action((state, payload) => {
    state.phase = phasePayload[payload]
  }),

  updateStage: action((state, payload) => {
    state.stage = payload
  }),

  updateSuddenDeath: action((state, payload) => {
    state.suddenDeath = payload
  }),

  updateCurrentPot: action((state, payload) => {
    state.currentPot = payload
  }),

  updateTicketCount: action((state, payload) => {
    state.ticketCount = payload
  }),

  updateVoteCount: action((state, payload) => {
    state.voteCount = payload
  }),

  updateNextTicketPrice: action((state, payload) => {
    state.nextTicketPrice = payload
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

  updateGameTab: action((state, payload) => {
    state.gameTab = payload
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
