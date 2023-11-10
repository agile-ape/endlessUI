import React from 'react'
import GameTextVariant from './GameTextVariant'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'

// Limit to 15 events. Avoid scrolling if possible
const GameFeed = () => {
  // i guess the logic is pull out an array of statements and .map them here?
  return (
    <div
      className="overflow-auto"
      // style={{background: "linear-gradient(140deg, #0D032D 0%, #1E1049 100%)"}}
    >
      <p className="py-2 border-b-[1px] border-dotted border-zinc-600 dark:border-zinc-300">
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
      {/* < 1 min == just */}
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
      />
    </div>
  )
}

export default GameFeed
