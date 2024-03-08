import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import OnSignal from '../ui/_OnSignal'
import TicketList from '../ui/TicketList'
import { Button } from '@/components/ui/button'
import Modal from '../ui/Modal'
import GameTab from '../ui/GameTab'
import { useStoreActions, useStoreState } from '../../../store'

const useStore = () => {
  const canBuyTicket = useStoreState((state) => state.canBuyTicket)

  return {
    canBuyTicket,
  }
}

export default function DesktopScreen() {
  const { canBuyTicket } = useStore()
  const [showJoinModal, setShowJoinModal] = React.useState<boolean>(false)
  const toggleJoin = () => setShowJoinModal((prevState) => !prevState)

  return (
    <>
      <div className="flex flex-col text-center gap-2 px-5 pb-2 my-2">
        <div className="flex flex-col justify-center mx-auto gap-2">
          <div className="text-center text-2xl font-digit text-[#FCFC03]">Pass the pot 🍯</div>
          <div className="bg-[#FCFC03]/80 rounded-xl">
            <Button
              className="
            rounded-xl px-4 py-2
            bg-[#404833] shadow-sm
            font-digit text-2xl text-[#FCFDC7] border border-[#FCFDC7]
            hover:-translate-y-1 hover:text-[#FCFC03] hover:border-[#FCFC03]
            active:-translate-y-0 active:brightness-200
            "
              onClick={toggleJoin}
              disabled={false}
            >
              <div
                className={cn(
                  canBuyTicket ? 'bg-[#FCFC03]' : 'bg-yellow-950',
                  `rounded-full shadow-md border-gray-500 h-[0.5rem] w-[0.5rem] mx-2 border-[0.05rem]`,
                )}
              ></div>
              🎟 Join game
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-4 container-last w-min mx-auto">
          <GameTab />
        </div>

        <div className="grow rounded-xl py-2 sm:container-last">
          <TicketList />
        </div>
      </div>
      {showJoinModal && <Modal action={'joinGame'} toggle={toggleJoin} />}
    </>
  )
}
