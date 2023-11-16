import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'
import type { IApp } from 'types/app'

const stagePayload: Record<number, IApp['phase']> = {
  0: 'start',
  1: 'day',
  2: 'night',
  3: 'lastmanfound',
  4: 'peacefound',
  5: 'drain',
}

export const appStore = createStore<StoreModel>({
  phase: 'start',
  ticketState: 'default',
  round: 0,
  totalPrizePool: 0,
  nextPrizeAmount: 0,
  topPrize: 0,
  bounty: 0,
  currentTicketCount: 0,
  totalTicketCount: 0,
  suddenDeathRound: 0, //if this value doesn't change, how should we call it?

  insertKeyword: action((state, payload) => {
    console.log('insertKeyword', payload)
  }),
  updatePhase: action((state, payload) => {
    state.phase = stagePayload[payload]
  }),
  updateRound: action((state, payload) => {
    state.round = payload
  }),
  updateTotalPrizePool: action((state, payload) => {
    state.totalPrizePool = payload
  }),
  updateNextPrizeAmount: action((state, payload) => {
    state.nextPrizeAmount = payload
  }),
  updateTopPrize: action((state, payload) => {
    state.topPrize = payload
  }),
  updateBounty: action((state, payload) => {
    state.bounty = payload
  }),
  updateCurrentTicketCount: action((state, payload) => {
    state.currentTicketCount = payload
  }),
  updateTotalTicketCount: action((state, payload) => {
    state.totalTicketCount = payload
  }),
  updateSuddenDeathRound: action((state, payload) => {
    state.suddenDeathRound = payload
  }),
  tickets: [],
  updateTickets: action((state, payload) => {
    state.tickets = payload
  }),
  addTicket: action((state, payload) => {
    state.tickets.push(payload)
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
