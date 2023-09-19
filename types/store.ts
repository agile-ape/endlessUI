import type { Action } from 'easy-peasy'
import type { IApp } from './app'

interface StoreModel {
  phase: IApp['phase']
  round: IApp['round']
  ticketState: IApp['ticketState']
  insertKeyword: Action<StoreModel, string>
  updateStage: Action<StoreModel, number>
  updateRound: Action<StoreModel, number>
  tickets: IApp['tickets']
  updateTickets: Action<StoreModel, IApp['tickets']>
}

export type { StoreModel }
