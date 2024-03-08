import type { Action } from 'easy-peasy'
import type { IApp, Ticket } from './app'

type CompletionModal = {
  state: string
  isOpen: boolean
}

interface StoreModel {
  // IApp
  currentPot: IApp['currentPot']
  round: IApp['round']
  timeFlag: IApp['timeFlag']
  buyFlag: IApp['buyFlag']
  potFlag: IApp['potFlag']
  ticketId: IApp['ticketId']
  ticketCount: IApp['ticketCount']

  canBuyTicket: IApp['canBuyTicket']
  ticketPrice: IApp['ticketPrice']
  buyTicketDelay: IApp['buyTicketDelay']
  roundTime: IApp['roundTime']
  feeShare: IApp['feeShare']
  startingPassRate: IApp['startingPassRate']
  lastMultiplier: IApp['lastMultiplier']

  tokenBalance: IApp['tokenBalance']

  tickets: IApp['tickets']

  // Others
  ownedTicket: Ticket | null
  triggerCompletionModal: CompletionModal
  lastChangedTicket: number

  // Updates
  updateCurrentPot: Action<StoreModel, number>
  updateRound: Action<StoreModel, number>
  updateTimeFlag: Action<StoreModel, number>
  updateBuyFlag: Action<StoreModel, number>
  updatePotFlag: Action<StoreModel, number>
  updateTicketId: Action<StoreModel, number>
  updateTicketCount: Action<StoreModel, number>
  updateCanBuyTicket: Action<StoreModel, boolean>
  updateTicketPrice: Action<StoreModel, number>
  updateBuyTicketDelay: Action<StoreModel, number>
  updateRoundTime: Action<StoreModel, number>
  updateFeeShare: Action<StoreModel, number>
  updateStartingPassRate: Action<StoreModel, number>
  updateLastMultiplier: Action<StoreModel, number>
  updateTokenBalance: Action<StoreModel, number>

  updateTickets: Action<StoreModel, IApp['tickets']>
  modifyTicket: Action<StoreModel, { id: number; ticket: Ticket }>

  updateOwnedTicket: Action<StoreModel, Ticket | null>
  updateTriggerCompletionModal: Action<StoreModel, CompletionModal>
  updateLastChangedTicket: Action<StoreModel, number>
}

export type { StoreModel }
