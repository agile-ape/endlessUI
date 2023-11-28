import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { IApp, Ticket } from 'types/app'
import { API_ENDPOINT } from '../../services/constant'

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

export const tokenConversion = 1e18
export const shareConversion = 1000
export const priceConversion = 1000

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
