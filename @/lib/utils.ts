import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { IApp, Ticket } from 'types/app'
import { API_ENDPOINT, LAST_MAN_STANDING_ADDRESS } from '../../services/constant'
import { formatUnits } from 'viem'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateTimeLeft = () => {
  const difference = +new Date('2023-09-01T19:00:00+05:30') - +new Date()
  let timeLeft = {
    // days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
  if (difference > 0) {
    timeLeft = {
      // use this if u want to add days in timeleft
      // days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      // hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      hours: Math.floor(difference / (1000 * 60 * 60)),
      // minutes: Math.floor((difference / 1000 / 60) % 60),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  return timeLeft
}

// To delete
// export const tokenConversion = 1e18
// export const shareConversion = 1000
// export const priceConversion = 1000

export const transformToTicket = (ticket: Ticket[]): IApp['tickets'] => {
  return ticket.map((t) => ({
    ...t,
  }))
}

export const isJson = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function formatNumber(value: any, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    ...options,
  }).format(Number(value))
}

export function formatCount(value: any): string {
  return value == 0 ? '-' : String(value)
}

export const phasePayload: Record<number, IApp['phase']> = {
  0: 'deployed',
  1: 'start',
  2: 'day',
  3: 'night',
  4: 'lastmanfound',
  5: 'peacefound',
  6: 'drain',
  7: 'gameclosed',
}

export const statusPayload: Record<number, IApp['ticketStatus']> = {
  0: 'new',
  1: 'submitted',
  2: 'checked',
  3: 'safe',
  4: 'dead',
  5: 'exited',
}

export async function fetcher(path: string) {
  try {
    const response = await fetch(API_ENDPOINT + path)
    const json = await response.json()

    return json
  } catch (error) {
    console.log({ error })
    throw new Error('Failed to fetch API')
  }
}

export function replacePlaceholders(message: { value: string; args: Record<string, string> }) {
  let result = message.value

  for (const key in message.args) {
    if (key === 'address') {
      result = result.replace(`[${key}]`, formatAddress(message.args[key]))
      continue
    }
    result = result.replace(`[${key}]`, message.args[key])
  }

  return result
}

export function formatAddress(address: string) {
  if (!address) return '0x'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function encodeSvg(svg: string) {
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export function transformPlayerTicket(playerTicket: any, test?: any): Ticket {
  return {
    id: Number(playerTicket?.[0]) || 0,
    user: playerTicket?.[1] || '',
    sign: playerTicket?.[2] || '',
    status: test ? 3 : Number(playerTicket?.[3]) || 0,
    lastSeen: Number(playerTicket?.[4]) || 0,
    isInPlay: Boolean(playerTicket?.[5]) || false,
    vote: Boolean(playerTicket?.[6]) || false,
    value: Number(formatUnits(playerTicket?.[7] || 0, 18)),
    purchasePrice: Number(formatUnits(playerTicket?.[8] || 0, 18)),
    potClaim: Number(playerTicket?.[9]) || 0,
    redeemValue: Number(formatUnits(playerTicket?.[10] || 0, 18)),
    attacks: Number(playerTicket?.[11]) || 0,
    attackCount: Number(playerTicket?.[12]) || 0,
    killCount: Number(playerTicket?.[13]) || 0,
    killedBy: Number(playerTicket?.[14]) || 0,
    safehouseNights: Number(playerTicket?.[15]) || 0,
    checkOutRound: Number(playerTicket?.[16]) || 0,
    buddy: Number(playerTicket?.[17]) || 0,
    buddyCount: Number(playerTicket?.[18]) || 0,
    rank: Number(playerTicket?.[19]) || 0,
    contractAddress: LAST_MAN_STANDING_ADDRESS,
  }
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
