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

const GameFeed = () => {
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
          // style={{background: "linear-gradient(140deg, #0D032D 0%, #1E1049 100%)"}}
        >
          <p>GAME BEGINS.</p>
          <p>1 CHANGED THE PHASE FROM ENTER TO DAY.</p>
          <p>
            1 <span>is bought</span> by 0x12...31 for 20ETH.
          </p>
          <p>
            1 <span>submitted</span> the keyword.
          </p>
          <p>
            1 <span>voted yes</span> to split pot.
          </p>
          <p>
            1 <span>voted back no</span> to split pot.
          </p>
          <p>
            1 <span>checked into</span> the safehouse till round 12.
          </p>
          <p>
            1 <span>checked out</span> from the safehouse.
          </p>
          <p>
            1 <span>exited</span> at rank 13.
          </p>
          <p>DRAIN HAS BEEN TRIGGERED.</p>
          <p>Keyword as been updated to ${'pepe'}. Players can begin attacking.</p>
          <p>
            1 <span>kicked</span> 23 out of the safehouse. 23 is dead.
          </p>
          <p>
            1 <span>attacked and received</span> 2 tokens.
          </p>
          <p>
            1 <span>attacked and killed</span> 3. 3 had 12ETH.
          </p>
          <p>
            1 <span>attacked</span> 4 but 4 is safe.
          </p>
          <p>
            1 <span>transferred</span> 20 tokens to 13.
          </p>

          <GameTextVariant
            variant="exit"
            number={11}
            text="at Rank 10 with 1.5ETH (0.5 from pool)"
            timestamp="4 minutes"
            isLastIndex={false}
          />

          <GameTextVariant
            variant="safe"
            number={14}
            text="(attacker: 12)"
            timestamp="4 minutes"
            isLastIndex={true}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default GameFeed
