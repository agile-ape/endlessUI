import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import type { FC } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'

import RoundChange from './RoundChange'
import JoinGame from './JoinGame'
import LoadLast from './_LoadLast'
import ExitGame from './_ExitGame'
import AddPot from './AddPot'

import { useOutsideClick } from '../../../hooks/useOutclideClick'

type ModalType = {
  action: string
  toggle: () => void
  id?: number
}

const titleMapping: { [key: string]: string } = {
  roundChange: '🪜 Change round',
  joinGame: '🎟 Buy ticket',
  loadLast: '🛡️ Reduce pass rate',
  exitGame: '🚪 Exit Game',
  addPot: '🍯 Add to Pot',
}

const modalMapping: { [key: string]: JSX.Element } = {
  roundChange: <RoundChange />,
  joinGame: <JoinGame />,
  loadLast: <LoadLast />,
  exitGame: <ExitGame />,
  addPot: <AddPot />,
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
