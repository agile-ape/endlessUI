import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import {
  defaultContractObj,
  CHANGE_PHASE_IMG,
  CHANGE_PHASE_MOBILE_IMG,
} from '../../../services/constant'
import { toast } from '@/components/shadcn/use-toast'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreActions, useStoreState } from '../../../store'
import { cn } from '@/lib/utils'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import Image from 'next/image'

const useStore = () => {
  const feeShare = useStoreState((state) => state.feeShare)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  return {
    feeShare,
    updateCompletionModal,
  }
}

const RoundChange = () => {
  const { feeShare, updateCompletionModal } = useStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'changeRound',
  })

  const phaseChangeHandler = async () => {
    try {
      const tx = await writeAsync({})
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'changeRound',
        result: 0,
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

      <div className="capitalize text-center h2-last">Fee share</div>

      <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
        <div className="text-3xl text-center border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 shadow-md rounded-xl items-center p-2 gap-3">
          <p className="font-digit">{feeShare}%</p>
        </div>

        <div className="text-center">
          <p className="mb-2">This costs some gas.</p>
          <p className="mb-2">But you get fees.</p>
          <p className="mb-2">More players = More gas and fees</p>
        </div>

        <Button variant="primary" size="lg" onClick={phaseChangeHandler} isLoading={isLoading}>
          Change round
        </Button>
      </div>
    </div>
  )
}

export default RoundChange
