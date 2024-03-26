// @ts-nocheck
import React from 'react'
import type { FC } from 'react'
import { Button } from './button'

type TicketUIType = {
  id: number
  number: number
}

const TicketUI: FC<TicketUIType> = ({ id, number }) => {
  const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
  const toggleLoad = () => setShowLoadModal((prevState) => !prevState)
  return (
    <div className="flex flex-col mx-auto justify-center gap-2">
      <div className="rounded-xl border border-gray-600 px-4 py-2">
        <div className="text-2xl font-digit text-center uppercase shadow-xl m-2 rounded-lg">
          #{String(id)}
        </div>
        <div className="font-digit text-center text-3xl leading-tight">{number}</div>
      </div>

      <Button
        className="w-full
    rounded-xl px-4 py-2 \
    bg-[#404833] border-2 border-[#404833] \
    font-digit text-lg text-[#FCFDC7] \
    hover:text-[#FCFC03] hover:border-[#FCFC03] \
    active:text-[#FCFC03]/50 active:border-[#FCFC03]/50
    "
        disabled={false}
      >
        Claim
      </Button>

      <Button
        className="w-full
    rounded-xl px-4 py-2 \
    bg-[#404833] border-2 border-[#404833] \
    font-digit text-lg text-[#FCFDC7] \
    hover:text-[#FCFC03] hover:border-[#FCFC03] \
    active:text-[#FCFC03]/50 active:border-[#FCFC03]/50
    "
        disabled={false}
      >
        Redeem
      </Button>
    </div>
  )
}

export default TicketUI
