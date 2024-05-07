import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
// import type { IApp, Ticket, Event } from 'types/app'
import {
  API_ENDPOINT,
  GAME_ADDRESS,
  CHAIN_LIST,
  CRYTPOCOMPARE_ENDPOINT,
} from '../../services/constant'
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

// export const transformToTicket = (ticket: Ticket[]): IApp['tickets'] => {
//   return ticket.map((t) => ({
//     ...t,
//   }))
// }

// export const transformToEvent = (event: Event[]): IApp['events'] => {
//   return event.map((e) => ({
//     ...e,
//   }))
// }

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

// Make an HTTP POST request
export async function poster(data: any, path: string) {
  try {
    const response = await fetch(API_ENDPOINT + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // JSON => JSON string
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // const responseData = await response.json()

    return response
    // console.log('Success:', responseData)
  } catch (error) {
    console.error('Error:', error)
  }
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

export function formatShortAddress(address: string) {
  if (!address) return '0x'
  return `${address.slice(0, 4)}..${address.slice(-2)}`
}

export function encodeSvg(svg: string) {
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

export function scrollToBottom() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })
}

export async function findChainName(chainId: number) {
  try {
    // Fetch the JSON data from the URL
    const response = await fetch(CHAIN_LIST)
    const data = await response.json()

    // Find the name based on chainId
    const foundItem = data.find((item: any) => item.chainId === chainId)

    if (foundItem) {
      return foundItem.name
    } else {
      return 'Chain name not found'
    }
  } catch (error) {
    return 'Error fetching data'
  }
}

export function showCurrentDate(date: Date): string {
  const year = date.getFullYear()
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const month = monthNames[date.getMonth()] // Note: Month is zero-based, so add 1

  const day = date.getDate()

  return `${month} ${day}`
}

export function showCurrentTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds}`
}

export function showLocaleDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
}

export function showLocaleTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
