import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import GameTab from '../ui/YourTickets'
import Title from '../ui/Title'
import Countdown from '../ui/Countdown'
import Average from '../ui/Average'
import YourTickets from '../ui/YourTickets'
import BuyTicket from '../ui/BuyTicket'
import { useStoreActions, useStoreState } from '../../../store'

const useStore = () => {
  const canBuyTicket = useStoreState((state) => state.canBuyTicket)

  return {
    canBuyTicket,
  }
}

export default function DesktopScreen() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-2 mx-auto">
        <Title />
        <Countdown />
        <Average />
        <BuyTicket />
        <YourTickets />
      </div>
    </>
  )
}
