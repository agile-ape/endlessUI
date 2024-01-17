import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import {
  defaultContractObj,
  CHANGE_PHASE_IMG,
  CHANGE_PHASE_MOBILE_IMG,
} from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../../store'
import { cn } from '@/lib/utils'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import Prompt from './Prompt'
import OnSignal from './OnSignal'
// type PhaseChangeType = {
//   phaseType: IApp['phase']
// }
import { DOCS_URL_phases } from '../../../services/constant'
import { useWindowSize } from '../../../hooks/useWindowSize'

const mappedFunction: Record<string, string> = {
  start: 'changeStartToDay',
  day: 'changeDayToNight',
  night: 'changeNightToDay',
  lastmanfound: 'closeGame',
  peacefound: 'closeGame',
  drain: 'closeGame',
}

// const bgColorPhase: Record<string, string> = {
//   start: 'text-black border border-white bg-blue-100 hover:bg-blue-200',
//   day: 'text-white border border-white bg-green-600 hover:bg-green-700',
//   night: 'text-black border border-white bg-amber-500 hover:bg-amber-400',
//   lastmanfound: 'bg-neutral-900 hover:bg-neutral-800',
//   peacefound: 'bg-blue-800 hover:bg-blue-900',
//   drain: 'bg-red-400 hover:bg-red-500',
// }

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ticketId = ownedTicket?.id || 0

  return {
    phase,
    updateCompletionModal,
    ticketId,
  }
}

export const PhaseChangeActive = () => {
  const { ticketId } = useStore()
  const phaseChangeActive: boolean = ticketId > 0
  return phaseChangeActive
}

const PhaseChangeNew = () => {
  const { phase, updateCompletionModal } = useStore()
  const active = PhaseChangeActive()

  //   const { xs } = useWindowSize()

  //   const { address, isConnected } = useAccount()

  //   const { data: playerTicket } = useContractRead({
  //     ...defaultContractObj,
  //     functionName: 'playerTicket',
  //     args: [address as `0x${string}`],
  //     enabled: isConnected,
  //   })

  //   let ticketId = Number(playerTicket?.[0] || BigInt(0))

  //   let phaseChangeActive: boolean
  //   phaseChangeActive = ticketId > 0

  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: mappedFunction[phase] as any,
  })

  const phaseChangeHandler = async () => {
    try {
      const tx = await writeAsync({})
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'changePhase',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Its not time yet',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const changePhaseBackupImg = (event: any) => {
    event.target.src = '/lore/ChangePhase.png'
  }

  const changePhaseMobileBackupImg = (event: any) => {
    event.target.src = '/lore/ChangePhaseMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Change Phase</div>
        </div> */}
        <Image
          priority
          src={CHANGE_PHASE_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="change-phase"
          onError={changePhaseMobileBackupImg}
        />
      </div>
      <Image
        priority
        src={CHANGE_PHASE_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="change-phase"
        onError={changePhaseBackupImg}
      />

      <div className="text-center">
        <p className="mb-2">Any player can change phase.</p>
        <p className="mb-2">Once timer ends.</p>
        <a href={DOCS_URL_phases} target="_blank" className="link h6-last align-top">
          Learn more
        </a>
      </div>

      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
      >
        <div className="m-1 capitalize text-center h2-last">Do us a favor?</div>

        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div className="w-[100%] mx-auto flex flex-col justify-center">
            <Button
              variant="change"
              onClick={phaseChangeHandler}
              isLoading={isLoading}
              disabled={!active}
              className="h-10 px-3 text-xl"
              // className={cn('h-10 px-3 text-xl', bgColorPhase[phase])}
            >
              {/* {playerTicket ? 'Change phase' : 'Hold on'} */}
              Change phase
            </Button>
            {!active ?? <Prompt docLink={DOCS_URL_phases} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhaseChangeNew
