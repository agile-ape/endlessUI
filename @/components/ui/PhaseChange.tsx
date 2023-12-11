import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
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

const mappedFunction: Record<string, string> = {
  start: 'changeStartToDay',
  day: 'changeDayToNight',
  night: 'changeNightToDay',
  lastmanfound: 'closeGame',
  peacefound: 'closeGame',
  drain: 'closeGame',
}

const bgColorPhase: Record<string, string> = {
  start: 'text-black border border-white bg-blue-100 hover:bg-blue-200',
  day: 'text-white border border-white bg-green-600 hover:bg-green-700',
  night: 'text-black border border-white bg-amber-500 hover:bg-amber-400',
  lastmanfound: 'bg-neutral-900 hover:bg-neutral-800',
  peacefound: 'bg-blue-800 hover:bg-blue-900',
  drain: 'bg-red-400 hover:bg-red-500',
}

const PhaseChange = () => {
  const phase = useStoreState((state) => state.phase)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  const { address, isConnected } = useAccount()

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
    enabled: isConnected,
  })

  let ticketId = Number(playerTicket?.[0] || BigInt(0))

  let phaseChangeActive: boolean
  phaseChangeActive = ticketId > 0

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

  //   onError(error) {
  //     // @ts-ignore
  //     const errorMsg = error?.cause?.shortMessage || error?.message
  //     toast({
  //       variant: 'destructive',
  //       // title: 'Its not time yet 😭',
  //       description: <p>{errorMsg}</p>,
  //     })
  //   },
  //   onSuccess(data) {
  //     console.log('Success', data)

  //     toast({
  //       variant: 'success',
  //       // title: 'The phase has change',
  //       description: 'The phase has change!',
  //     })
  //   },
  // })

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="default"
          className={cn('h-10 px-3 text-xl', bgColorPhase[phase])}
        >
          {/* {playerTicket ? 'Change phase' : 'Hold on'} */}
          <OnSignal active={phaseChangeActive} own={true} />
          Change phase
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto" ref={modalRef}>
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Trigger the phase change
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <div className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/ChangePhase.png"
                  // layout="fill"
                  // objectFit='cover'
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                {/* <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                      Notes
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>Ticket price increases as more tickets are bought.</p>
                    <p>Price is split to wallet (30%), pot(60%), and treasury(10%).</p>
                    <p>Players can no longer join the game once it begins.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion> */}
                <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">
                    Every phase change needs to be called by one of the players, dead or alive.
                  </p>
                  <p className="mb-2">Would you help us usher in the new phase?</p>
                  <a
                    href={DOCS_URL_phases}
                    target="_blank"
                    className="link text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>

                {/* Pay for stay */}
                {/* <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Join us?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Current phase</p>
                      <p className="text-right capitalize"> {phase} </p>
                    </div>
                  </div>
                </div> */}

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center">
                  {phaseChangeActive && (
                    <Button
                      variant="default"
                      onClick={phaseChangeHandler}
                      isLoading={isLoading}
                      className={cn('h-10 px-3 text-xl', bgColorPhase[phase])}
                    >
                      {/* {playerTicket ? 'Change phase' : 'Hold on'} */}
                      Change phase
                    </Button>
                  )}

                  {!phaseChangeActive && (
                    <Button
                      disabled
                      variant="default"
                      className={cn('h-10 px-3 text-xl', bgColorPhase[phase])}
                    >
                      Change phase
                    </Button>
                  )}
                </div>
                {!phaseChangeActive && <Prompt docLink={DOCS_URL_phases} />}
              </div>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PhaseChange
