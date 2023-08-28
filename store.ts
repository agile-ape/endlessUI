import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'
import type { IApp } from 'types/app'

const stagePayload: Record<number, IApp['stage']> = {
  0: 'beginnings',
  1: 'countdown',
  2: 'day',
  3: 'dusk',
  4: 'night',
  5: 'lastmanfound',
}

export const appStore = createStore<StoreModel>({
  stage: 'beginnings', // initial state will be whitelist
  ticketState: 'default',
  round: 0,
  insertKeyword: action((state, payload) => {
    console.log('insertKeyword', payload)
  }),
  updateStage: action((state, payload) => {
    state.stage = stagePayload[payload]
  }),
  updateRound: action((state, payload) => {
    state.round = payload
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
