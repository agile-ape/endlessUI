import type { Action } from 'easy-peasy'
import type { IApp } from './app'

interface StoreModel {
  stage: IApp['stage']
  insertKeyword: Action<StoreModel, string>
}

export type { StoreModel }
