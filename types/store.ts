import type { Action } from 'easy-peasy'
import type { IApp } from './app'

interface StoreModel {
  phase: IApp['phase']
  round: IApp['round']
  ticketState: IApp['ticketState']
  insertKeyword: Action<StoreModel, string>
  updateStage: Action<StoreModel, number>
  updateRound: Action<StoreModel, number>
}

export type { StoreModel }
