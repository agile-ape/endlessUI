import React, { useEffect } from 'react'
import useSWR from 'swr'
import { fetcher, replacePlaceholders } from '@/lib/utils'
import { API_ENDPOINT, LAST_MAN_STANDING_ADDRESS } from '../../../services/constant'
import { formatDistanceToNow } from 'date-fns'

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
  }>(`/events?address=${LAST_MAN_STANDING_ADDRESS}&page=1&limit=30`, fetcher)

  return (
    <div className="overflow-auto max-h-[80vh] container-last rounded-xl px-5">
      {data?.data?.map((item, index) => (
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
