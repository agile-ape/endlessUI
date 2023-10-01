import type { Action } from 'easy-peasy'
import type { IApp } from './app'

interface StoreModel {
  phase: IApp['phase']
  ticketState: IApp['ticketState']
  round: IApp['round']
  totalPrizePool: IApp['totalPrizePool']
  nextPrizeAmount: IApp['nextPrizeAmount']
  topPrize: IApp['topPrize']
  bounty: IApp['bounty']
  currentTicketCount: IApp['currentTicketCount']
  totalTicketCount: IApp['totalTicketCount']
  suddenDeathRound: IApp['suddenDeathRound']
  insertKeyword: Action<StoreModel, string>
  updatePhase: Action<StoreModel, number>
  updateRound: Action<StoreModel, number>
  updateTotalPrizePool: Action<StoreModel, number>
  updateNextPrizeAmount: Action<StoreModel, number>
  updateTopPrize: Action<StoreModel, number>
  updateBounty: Action<StoreModel, number>
  updateCurrentTicketCount: Action<StoreModel, number>
  updateTotalTicketCount: Action<StoreModel, number>
  updateSuddenDeathRound: Action<StoreModel, number>
  tickets: IApp['tickets']
  updateTickets: Action<StoreModel, IApp['tickets']>
  addTicket: Action<StoreModel, IApp['tickets'][0]>
}

export type { StoreModel }
