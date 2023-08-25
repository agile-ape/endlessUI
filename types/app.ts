interface IApp {
  stage: 'whitelist' | 'beginnings' | 'countdown' | 'day' | 'dusk' | 'night' | 'lastmanfound'
  round: number
}

export type { IApp }
