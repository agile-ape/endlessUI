import type { Action } from 'easy-peasy'
import type { IApp, Ticket } from './app'

type CompletionModal = {
  isOpen: boolean
  state: string
  result: number
}

interface StoreModel {
  // IApp
  canBuyTicket: IApp['canBuyTicket']
  ticketPrice: IApp['ticketPrice']
  buyTicketDelayCeiling: IApp['buyTicketDelayCeiling']
  roundTime: IApp['roundTime']
  feeShare: IApp['feeShare']
  startingPassRate: IApp['startingPassRate']
  auctionPrice: IApp['auctionPrice']
  poohPerRoll: IApp['poohPerRoll']
  passRateRange: IApp['passRateRange']
  passRateFloor: IApp['passRateFloor']

  round: IApp['round']
  timeFlag: IApp['timeFlag']
  buyFlag: IApp['buyFlag']
  potFlag: IApp['potFlag']
  ticketIdCounter: IApp['ticketIdCounter']
  ticketCount: IApp['ticketCount']

  currentPot: IApp['currentPot']
  tokenBalance: IApp['tokenBalance']
  auctionAllowance: IApp['auctionAllowance']
  totalPoohSupply: IApp['totalPoohSupply']

  tickets: IApp['tickets']
  events: IApp['events']

  // Addons
  ownedTickets: Ticket[]
  triggerCompletionModal: CompletionModal
  lastChangedTicket: number

  // Updates
  updateCanBuyTicket: Action<StoreModel, boolean>
  updateTicketPrice: Action<StoreModel, number>
  updateBuyTicketDelayCeiling: Action<StoreModel, number>
  updateRoundTime: Action<StoreModel, number>
  updateFeeShare: Action<StoreModel, number>
  updateStartingPassRate: Action<StoreModel, number>
  updateAuctionPrice: Action<StoreModel, number>
  updatePoohPerRoll: Action<StoreModel, number>
  updatePassRateRange: Action<StoreModel, number>
  updatePassRateFloor: Action<StoreModel, number>

  updateRound: Action<StoreModel, number>
  updateTimeFlag: Action<StoreModel, number>
  updateBuyFlag: Action<StoreModel, number>
  updatePotFlag: Action<StoreModel, number>
  updateTicketIdCounter: Action<StoreModel, number>
  updateTicketCount: Action<StoreModel, number>

  updateCurrentPot: Action<StoreModel, number>
  updateTokenBalance: Action<StoreModel, number>
  updateAuctionAllowance: Action<StoreModel, number>
  updateTotalPoohSupply: Action<StoreModel, number>

  updateTickets: Action<StoreModel, IApp['tickets']>
  modifyTicket: Action<StoreModel, { id: number; ticket: Ticket }>
  updateEvents: Action<StoreModel, IApp['events']>

  updateOwnedTickets: Action<StoreModel, Ticket[]>
  updateTriggerCompletionModal: Action<StoreModel, CompletionModal>
  updateLastChangedTicket: Action<StoreModel, number>
}

export type { StoreModel }
