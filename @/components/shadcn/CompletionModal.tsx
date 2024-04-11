import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { Button } from './button'
import Image from 'next/image'
import { Send, CheckCircle2 } from 'lucide-react'

import { useStoreActions, useStoreState } from '../../../store'
import dynamic from 'next/dynamic'
import { DialogClose } from '@radix-ui/react-dialog'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

const getAlertLook = (alertLookTest: string) => {
  switch (alertLookTest) {
    case 'changeRound':
      return {
        bgImage: 'rainbow',
        face: 'salute',
        title: 'phase changed',
        message: 'We thank you for your service',
      }

    case 'afterPurchase':
      return {
        bgImage: 'rainbow',
        face: 'happy',
        title: 'welcome',
        message: 'A warrior enters the arena',
      }

    case 'roll':
      return {
        bgImage: 'rainbow',
        face: 'roll',
        title: 'Keep rolling',
        message: 'Enjoy your stay. Remember to check out on time. Or else.',
      }

    case 'exitGame':
      return {
        bgImage: 'burst',
        face: 'exit',
        title: 'bye',
        message: 'We hope you had fun. We will see you in the next game.',
      }

    default:
      return {}
  }
}

interface CompletionModalType {
  alertLookTest: string
}

const CompletionModal: React.FC<CompletionModalType> = () => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => closeModal())

  const modalState = useStoreState((state) => state.triggerCompletionModal)
  const modalLooks = getAlertLook(modalState.state)
  const closeModalAction = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  function closeModal() {
    closeModalAction({
      isOpen: false,
      state: '',
      result: 0,
    })
  }

  const { bgImage, face, title, message } = modalLooks

  return (
    <Dialog open={modalState.isOpen}>
      <DialogContent className="bg-white dark:bg-white rounded-lg p-0 w-[75%] md:w-[20rem]">
        <div
          ref={modalRef}
          className="rounded-lg shadow-xl"
          style={{
            backgroundImage: `url('/ticket/${bgImage}.svg')`, // different for true
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div className="rounded-t-sm">
            <div className="flex flex-col justify-center gap-1 items-center pt-5">
              <p className="text-center border bg-slate-100/50 px-4 py-2 rounded-lg text-2xl font-digit text-[#404833]">
                {title}
              </p>
              <Image
                priority
                src={`/faces/${face}.webp`}
                height={152}
                width={152}
                alt={`${face} pepe`}
              />
            </div>
          </div>

          <div className="w-[90%] flex flex-col px-4 mx-auto text-center border bg-slate-100/50 rounded-lg my-4">
            <div className="text-black text-xl my-2">{message}</div>
            <div className="flex justify-center mb-4">
              <div className="flex justify-center w-full" onClick={closeModal}>
                <Button
                  variant="primary"
                  className="w-[100%] px-10 py-2 rounded-full mx-auto text-xl"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default dynamic(() => Promise.resolve(CompletionModal), {
  ssr: false,
})
