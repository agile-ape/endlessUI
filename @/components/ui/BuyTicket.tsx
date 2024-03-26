import React, { useRef, useState, useEffect } from 'react'
import { Button } from './button'

export default function BuyTicket() {
  const [value, setValue] = useState('')

  return (
    <div
      className="px-6 py-2 my-2 \
      gap-2 mx-auto
      rounded-xl border border-gray-700 \
      flex flex-col justify-center items-center"
    >
      <label htmlFor="number" className="text-2xl">
        Input number
      </label>
      <input
        type="text"
        id="number"
        className="w-[200px] font-digit text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl flex justify-between items-center p-2 gap-3"
        placeholder="0"
        onChange={(e) => setValue(e.target.value)}
      />

      <Button
        className="w-full
            rounded-xl px-4 py-2 \
            bg-[#404833] border-2 border-[#404833] \
            font-digit text-2xl text-[#FCFDC7] \
            hover:text-[#FCFC03] hover:border-[#FCFC03] \
            active:text-[#FCFC03]/50 active:border-[#FCFC03]/50
            "
        disabled={false}
      >
        Buy
      </Button>
    </div>
  )
}
