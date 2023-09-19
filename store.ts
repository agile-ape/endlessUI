import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'
import type { IApp } from 'types/app'

const stagePayload: Record<number, IApp['phase']> = {
  0: 'beginnings',
  1: 'countdown',
  2: 'day',
  3: 'dusk',
  4: 'night',
  5: 'lastmanfound',
}

export const appStore = createStore<StoreModel>({
  phase: 'beginnings',
  ticketState: 'default',
  round: 0,
  insertKeyword: action((state, payload) => {
    console.log('insertKeyword', payload)
  }),
  updateStage: action((state, payload) => {
    state.phase = stagePayload[payload]
  }),
  updateRound: action((state, payload) => {
    state.round = payload
  }),
  tickets: [],
  updateTickets: action((state, payload) => {
    state.tickets = payload
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
