import type { Action } from 'easy-peasy'
import type { IApp, Ticket } from './app'

interface StoreModel {
  round: IApp['round']
  phase: IApp['phase']
  stage: IApp['stage']
  suddenDeath: IApp['suddenDeath']
  currentPot: IApp['currentPot']
  ticketCount: IApp['ticketCount']
  voteCount: IApp['voteCount']
  nextTicketPrice: IApp['nextTicketPrice']
  tokenBalance: IApp['tokenBalance']

  tickets: IApp['tickets']
  ownedTicket: Ticket | null
  gameTab: 'ticket' | 'game'
  triggerCompletionModal: CompletionModal
  lastChangedTicket: number

  updateRound: Action<StoreModel, number>
  updatePhase: Action<StoreModel, number>
  updateStage: Action<StoreModel, number>
  updateSuddenDeath: Action<StoreModel, number>
  updateCurrentPot: Action<StoreModel, number>
  updateTicketCount: Action<StoreModel, number>
  updateVoteCount: Action<StoreModel, number>
  updateNextTicketPrice: Action<StoreModel, number>
  updateTokenBalance: Action<StoreModel, number>

  updateTickets: Action<StoreModel, IApp['tickets']>
  modifyTicket: Action<StoreModel, { id: number; ticket: Ticket }>
  updateOwnedTicket: Action<StoreModel, Ticket | null>
  updateGameTab: Action<StoreModel, 'ticket' | 'game'>
  updateTriggerCompletionModal: Action<StoreModel, CompletionModal>
  updateLastChangedTicket: Action<StoreModel, number>
}

type CompletionModal = {
  state: string
  isOpen: boolean
}

export type { StoreModel }
