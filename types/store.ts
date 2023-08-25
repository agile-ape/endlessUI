import type { Action } from 'easy-peasy'
import type { IApp } from './app'

interface StoreModel {
  stage: IApp['stage']
  round: IApp['round']
  insertKeyword: Action<StoreModel, string>
}

export type { StoreModel }
