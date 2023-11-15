import { Button } from '@/components/ui/button'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'
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

type PhaseChangeType = {
  phaseType: IApp['phase']
}

const mappedFunction: Record<string, string> = {
  day: 'changeDayToDusk',
  dusk: 'changeDuskToNight',
  night: 'changeNightToDay',
  countdown: 'changeCountdownToDay',
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
  // const phase = useStoreState((state) => state.phase)
  const phase = 'night'
  const { address, isConnected } = useAccount()
  console.log({ phase: bgColorPhase[phase], phaseNow: phase })
  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
    enabled: isConnected,
  })

  const ticketSignature = (playerTicket?.[2] || 0) as `0x${string}`

  const { write, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: mappedFunction[phase] as any,
    onError(error) {
      // @ts-ignore
      const errorMsg = error?.cause?.shortMessage || error?.message
      toast({
        variant: 'destructive',
        // title: 'Its not time yet 😭',
        description: <p className="text-base">{errorMsg}</p>,
      })
    },
    onSuccess(data) {
      console.log('Success', data)
      toast({
        variant: 'success',
        // title: 'The phase has change',
        description: 'Welcome to the Day!',
      })
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={!write || !playerTicket}
          // size="md"
          variant="default"
          onClick={() => write()}
          isLoading={isLoading}
          // variant="change"
          className={cn('h-10 px-3 text-xl', bgColorPhase[phase])}
        >
          {/* {playerTicket ? 'Change phase' : 'Hold on'} */}
          Change phase
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Trigger the phase change
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
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
                </div>

                <div className="w-[240px] mx-auto flex justify-center">
                  <Button
                    disabled={!write || !playerTicket}
                    // size="md"
                    variant="default"
                    onClick={() => write()}
                    isLoading={isLoading}
                    // variant="change"
                    className={cn('h-10 px-3 text-xl', bgColorPhase[phase])}
                  >
                    {/* {playerTicket ? 'Change phase' : 'Hold on'} */}
                    Change phase
                  </Button>
                </div>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PhaseChange
