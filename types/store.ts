import type { Action } from 'easy-peasy'
import type { IApp } from './app'

interface StoreModel {
  stage: IApp['stage']
  round: IApp['round']
  ticketState: IApp['ticketState']
  insertKeyword: Action<StoreModel, string>
  updateStage: Action<StoreModel, number>
  updateRound: Action<StoreModel, number>
}

export type { StoreModel }
