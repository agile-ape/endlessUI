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
  numberList: number[]
  averageList: number[]
  referral: string
  triggerCompletionModal: CompletionModal

  updateNumberList: Action<StoreModel, number[]>
  updateAverageList: Action<StoreModel, number[]>
  updateReferral: Action<StoreModel, string>
  updateTriggerCompletionModal: Action<StoreModel, CompletionModal>
}

export const appStore = createStore<StoreModel>({
  numberList: [],

  averageList: [],

  referral: '',

  triggerCompletionModal: {
    isOpen: false,
    state: '',
    result: 0,
  },

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
