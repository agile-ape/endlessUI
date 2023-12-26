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

import { useOutsideClick } from '../../../hooks/useOutclideClick'

type ModalType = {
  action: string
  toggle: () => void
}

const titleMapping: string = {
  buyTicket: '',
  exitGame: '',
  phaseChange: '',
  submit: 'Submit keyword of the day',
  checkIn: 'Check into Safehouse',
  checkOut: 'Check out from Safehouse',
  splitIt: 'Vote to Split Pot',
  wager: '',
  attack: '',
  kickOut: '',
  token: '',
  dashboard: 'Dashboard',
}

const indicatorMapping: string = {
  buyTicket: '',
  exitGame: '',
  phaseChange: '',
  submit: 'day',
  checkIn: 'day',
  checkOut: 'day',
  splitIt: 'day',
  wager: '',
  attack: '',
  kickOut: '',
  token: '',
  dashboard: '',
}

const modalMapping = {
  buyTicket: <Submit />,
  exitGame: <Submit />,
  phaseChange: <Submit />,
  submit: <Submit />,
  checkIn: <CheckInNew />,
  checkOut: <CheckOutNew />,
  splitIt: <SplitPotNew />,
  wager: <Submit />,
  attack: <Submit />,
  kickOut: <Submit />,
  token: <Submit />,
  dashboard: <DashboardNew />,
}

const Modal: FC<ModalType> = ({ action, toggle }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false)

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
                <div className="w-[85%] mx-auto flex justify-between p-2 h2-last items-center text-center font-normal">
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
                  {modalMapping[action]}
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
