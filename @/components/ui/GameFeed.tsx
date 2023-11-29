import React, { useEffect } from 'react'
import GameTextVariant from './GameTextVariant'
import useSWR from 'swr'
import { fetcher, replacePlaceholders } from '@/lib/utils'
import { API_ENDPOINT, LAST_MAN_STANDING_ADDRESS } from '../../../services/constant'

// Limit to 15 events. Avoid scrolling if possible
const GameFeed = () => {
  // i guess the logic is pull out an array of statements and .map them here?
  /* < 1 min == just */

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
  }>(`/events?address=${LAST_MAN_STANDING_ADDRESS}&page=1&limit=10`, fetcher)

  return (
    <div
      className="overflow-auto container-last rounded-xl px-2"
      // style={{background: "linear-gradient(140deg, #0D032D 0%, #1E1049 100%)"}}
    >
      {data?.data?.map((item, index) => (
        <GameTextVariant
          key={item.block_number}
          number={index + 1}
          keyword={''}
          text={replacePlaceholders(item.message)}
          timestamp={item.datetime}
          isLastIndex={index === data.data.length - 1}
        />
      ))}
      {/* <p className="py-2 border-b-[1px] border-dotted border-zinc-600 dark:border-zinc-300">
        GAME BEGINS.
      </p>
      <p className="py-2 border-b-[1px] border-dotted border-zinc-600 dark:border-zinc-300">
        PHASE CHANGED FROM ENTER TO DAY.
      </p>

      <GameTextVariant
        number={14}
        keyword="is bought"
        text="by 0x12...31."
        timestamp="just"
        isLastIndex={false}
      />

      <GameTextVariant
        number={13}
        keyword="submitted"
        text="the keyword."
        timestamp="just"
        isLastIndex={false}
      />
      <GameTextVariant
        number={1}
        keyword="voted yes"
        text="to split pot."
        timestamp="1 min ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={1}
        keyword="voted back no"
        text="to split pot."
        timestamp="1 min ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={1}
        keyword="checked into"
        text="the safehouse."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={5}
        keyword="checked out"
        text="from the safehouse."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={52}
        keyword="exited"
        text="the game."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={2}
        keyword="exited"
        text="the game."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <p className="py-2 border-b-[1px] border-dotted border-zinc-600 dark:border-zinc-300">
        DRAIN HAS BEEN TRIGGERED.
      </p>

      <p className="py-2 border-b-[1px] border-dotted border-zinc-600 dark:border-zinc-300">
        Keyword has been updated.
      </p>

      <GameTextVariant
        number={2}
        keyword="exited"
        text="the game."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={2}
        keyword="kicked"
        text="23 out of the safehouse."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={2}
        keyword="attacked and received"
        text="2 tokens."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={2}
        keyword="attacked and killed"
        text="3."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={2}
        keyword="attacked"
        text="4 but 4 is safe."
        timestamp="1 hr ago"
        isLastIndex={false}
      />

      <GameTextVariant
        number={2}
        keyword="transferred"
        text="20 tokens to 12."
        timestamp="1 hr ago"
        isLastIndex={false}
      /> */}
    </div>
  )
}

export default GameFeed
