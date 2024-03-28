import React, { useRef, useState, useEffect } from 'react'
import Title from '../ui/Title'
import Countdown from '../ui/Countdown'
import PotSize from '../ui/PotSize'
import Average from '../ui/_Average'
import Winners from '../ui/Winners'
import BuyTicket from '../ui/BuyTicket'
import YourTickets from '../ui/YourTickets'

export default function DesktopScreen() {
  return (
    <>
      <div className="flex flex-col justify-center items-center mx-auto">
        <Title />

        <div
          className="px-2 my-2 \
          outer-last \
          flex flex-col min-w-[220px]"
        >
          <Countdown />
          <PotSize />
        </div>

        <div
          className="px-2 my-2 \
          outer-last \
          flex flex-col min-w-[280px]"
        >
          <BuyTicket />
        </div>

        <div className="min-w-[280px] max-w-[480px]">
          <Winners />
        </div>

        <div
          className="px-2 my-2 \
          outer-last \
          flex flex-col min-w-[280px]"
        >
          <YourTickets />
        </div>
      </div>
    </>
  )
}
