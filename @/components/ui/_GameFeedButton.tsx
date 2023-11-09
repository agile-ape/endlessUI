import React from 'react'
import GameTextVariant from './GameTextVariant'
import { Button } from './button'
import GameFeed from './GameFeed'
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

const GameFeedButton = () => {
  // i guess the logic is pull out an array of statements and .map them here?
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="dropdown" className="text-lg rounded-xl h-10 px-4 py-2">
          Recent Plays
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div
          className="md:w-[400px] w-[100%]
          mx-auto px-4 py-2 grid grid-cols-1 text-lg
          overflow-auto max-h-[680px] rounded-xl
          container-last bg-opacity-100 dark:bg-opacity-100
        "
        >
          <GameFeed />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GameFeedButton
