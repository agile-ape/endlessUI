import { createStore, action, createTypedHooks } from 'easy-peasy'
import type { StoreModel } from './types/store'

export const appStore = createStore<StoreModel>({
  stage: 'beginnings', // initial state will be whitelist
  ticketState: 'default',
  round: 0,
  insertKeyword: action((state, payload) => {
    console.log('insertKeyword', payload)
  }),
  updateStage: action((state, payload) => {
    state.stage = payload
  }),
})

const typedAppStoreHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedAppStoreHooks.useStoreActions
export const useStoreDispatch = typedAppStoreHooks.useStoreDispatch
export const useStoreState = typedAppStoreHooks.useStoreState
