import React from 'react'
import GameTextVariant from './GameTextVariant'

const GameFeed = () => {
  // i guess the logic is pull out an array of statements and .map them here?
  return (
    <div
      className="md:w-[400px] w-[100%] rounded-2xl
      mx-auto px-4 py-2 grid grid-cols-1 text-white
      bg-muted dark:bg-[#272727] overflow-auto max-h-[300px]
    "
      // style={{background: "linear-gradient(140deg, #0D032D 0%, #1E1049 100%)"}}
    >
      <GameTextVariant
        variant="triggered_change"
        number={13}
        text="the phase change from day to dusk"
        timestamp="4 minutes"
        isLastIndex={false}
      />

      <GameTextVariant
        variant="new_entry"
        number={14}
        text="for 130ETH. Prize pool is now 100ETH."
        timestamp="4 minutes"
        isLastIndex={false}
      />

      <GameTextVariant
        variant="checked_in"
        number={15}
        text="Ticket value: 10.000ETH"
        timestamp="4 minutes"
        isLastIndex={false}
      />

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
        isLastIndex={false}
      />

      <GameTextVariant
        variant="killed"
        number={13}
        text="(attacker: 12)"
        timestamp="4 minutes"
        isLastIndex={true}
      />

      <GameTextVariant
        variant="checked_in"
        number={15}
        text="Ticket value: 10.000ETH"
        timestamp="4 minutes"
        isLastIndex={false}
      />

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
        isLastIndex={false}
      />
    </div>
  )
}

export default GameFeed
