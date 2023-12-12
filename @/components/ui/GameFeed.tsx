import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, replacePlaceholders } from '@/lib/utils'
import {
  API_ENDPOINT,
  LAST_MAN_STANDING_ADDRESS,
  WEBSOCKET_ENDPOINT,
} from '../../../services/constant'
import { formatDistanceToNow } from 'date-fns'
import { io } from 'socket.io-client'

type Feeds = {
  block_timestamp: number
  block_number: number
  datetime: number
  message: {
    value: string
    args: Record<string, string>
  }
}

// Limit to 15 events. Avoid scrolling if possible
const GameFeed = () => {
  const { data, error, isLoading } = useSWR<{
    data: {
      block_timestamp: number
      block_number: number
      datetime: number
      message: {
        value: string
        args: Record<string, string>
      }
    }[]
  }>(`/events?address=${LAST_MAN_STANDING_ADDRESS}&page=1&limit=100`, fetcher)

  const [feeds, setFeeds] = useState<Feeds[]>([])

  useEffect(() => {
    if (data?.data?.length) {
      setFeeds(data.data)
    }
  }, [data])

  useEffect(() => {
    const socket = io(WEBSOCKET_ENDPOINT)

    socket.on('events', (data) => {
      console.log('events', data)
      setFeeds((prev) => [data, ...prev])
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div className="overflow-auto max-h-[70vh] container-last rounded-xl px-5">
      {feeds?.map((item, index) => (
        <div
          key={item.block_number}
          className="flex flex-col justify-between py-1 tracking-wide
      text-black dark:text-white border-b-[1px] border-dotted border-zinc-600 dark:border-zinc-300"
        >
          <div className="text-left text-md leading-5">{replacePlaceholders(item.message)}</div>
          <div className="text-xs text-right whitespace-nowrap text-neutral-600 dark:text-neutral-300">
            {formatDistanceToNow(new Date(item.datetime), { addSuffix: false })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameFeed
