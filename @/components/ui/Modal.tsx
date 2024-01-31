import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { FC } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from './button'
import Prompt from './Prompt'
import OnSignal from './OnSignal'
import Submit from './Submit'
import DashboardNew from './DashboardNew'
import CheckInNew from './CheckInNew'
import CheckOutNew from './CheckOutNew'
import SplitPotNew from './SplitPotNew'
import WagerNew from './WagerNew'
import AttackNew from './AttackNew'
import KickOutNew from './KickOutNew'
import BuyTicketNew from './BuyTicketNew'
import ExitGameNew from './ExitGameNew'
import TokenNew from './TokenNew'
import PhaseChangeNew from './PhaseChangeNew'
import AdminNew from './AdminNew'

import { useOutsideClick } from '../../../hooks/useOutclideClick'

type ModalType = {
  action: string
  toggle: () => void
  id?: number
}

const titleMapping: { [key: string]: string } = {
  phaseChange: 'Trigger phase change',
  buyTicket: 'Enter Arena',
  exitGame: 'Exit Game',
  submit: 'Submit keyword of the day',
  checkIn: 'Check into Safehouse',
  checkOut: 'Check out from Safehouse',
  splitIt: 'Vote to Split Pot',
  wager: 'Place Your Bets',
  attack: 'Attack Player',
  kickOut: 'Kick Out Player',
  token: 'Send Tokens',
  dashboard: 'Dashboard',
  admin: 'Gamemaster',
}

const indicatorMapping: { [key: string]: string } = {
  phaseChange: '',
  buyTicket: 'start',
  exitGame: 'day',
  submit: 'day',
  checkIn: 'day',
  checkOut: 'day',
  splitIt: 'day',
  wager: '',
  attack: 'night',
  kickOut: 'night',
  token: '',
  dashboard: '',
  admin: '',
}

const modalMapping: { [key: string]: JSX.Element } = {
  phaseChange: <PhaseChangeNew />,
  buyTicket: <BuyTicketNew />,
  exitGame: <ExitGameNew />,
  submit: <Submit />,
  checkIn: <CheckInNew />,
  checkOut: <CheckOutNew />,
  splitIt: <SplitPotNew />,
  wager: <WagerNew />,
  token: <TokenNew />,
  dashboard: <DashboardNew />,
  admin: <AdminNew />,
}

const Modal: FC<ModalType> = ({ action, toggle, id }) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => toggle())

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div
            ref={modalRef}
            className="h-[40rem] md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-[80%] mx-auto bg-slate-200 dark:bg-slate-800 outline-none focus:outline-none overflow-auto"
          >
            <div className="overflow-auto">
              <button className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
                <span
                  className="text-white m-1 h-6 w-6 text-2xl outline-none focus:outline-none flex justify-center items-center"
                  onClick={toggle}
                >
                  <Cross1Icon className="text-black" />
                </span>
              </button>
              <div className="items-center pt-10">
                <div className="w-[85%] mx-auto flex justify-between p-2 items-center text-center h1-last">
                  <div className="">{titleMapping[action]}</div>
                  {indicatorMapping[action] && (
                    <Image
                      priority
                      src={`/indicator/${indicatorMapping[action]}Indicator.svg`}
                      height={300}
                      width={60}
                      className=""
                      alt={`indicator`}
                    />
                  )}
                </div>
                <ScrollArea className="h-[450px] md:h-[650px] rounded-md p-2">
                  {action === 'attack' && <AttackNew idList={id} />}

                  {action === 'kickOut' && <KickOutNew idList={id} />}

                  {!(action === 'attack' || action === 'kickOut') && modalMapping[action]}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-4"></div>
    </>
  )
}

export default Modal
