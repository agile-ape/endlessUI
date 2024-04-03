import React, { useRef, useState, useEffect } from 'react'
import Title from '../ui/Title'
import Countdown from '../ui/Countdown'
import PotSize from '../ui/PotSize'
import Average from '../ui/Average'
import BuyTicket from '../ui/BuyTicket'
import YourTickets from '../ui/YourTickets'
import { useReadContracts, useSendTransaction, useWatchContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { toast } from '@/components/shadcn/use-toast'
// import { toast } from '@/components/shadcn/sonner'

export default function DesktopScreen() {
  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'NewTicketBought',
    onLogs() {
      toast({
        variant: 'bought',
        description: <p className="text-xl">🔑 A key is bought</p>,
      })
    },
    poll: true,
  })

  useWatchContractEvent({
    ...defaultContractObj,
    eventName: 'PotAdded',
    onLogs() {
      toast({
        variant: 'bought',
        description: <p className="text-xl">🎊 Someone added to the pot</p>,
      })
    },
    poll: true,
  })

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

        {/* <div
          className="px-2 my-2 \
          buy-last \
          flex flex-col min-w-[280px]"
        >
          <BuyTicket />
        </div> */}

        <div className="average-last min-w-[280px] max-w-[480px]">
          <Average />
        </div>

        <div
          className="px-2 my-2 \
          keys-last \
          flex flex-col min-w-[320px]"
        >
          <YourTickets />
        </div>
      </div>
    </>
  )
}
