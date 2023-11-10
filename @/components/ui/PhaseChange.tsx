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
  day: 'bg-green-600 hover:bg-green-800',
  dusk: 'bg-purple-200',
  night: 'bg-amber-500',
  // countdown: 'changeCountdownToDay',
  beginnings: 'bg-blue-100',
  lastmanfound: 'bg-slate-300',
}

const PhaseChange = () => {
  // const phase = useStoreState((state) => state.phase)
  const phase = 'day'
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
          // variant="change"
          onClick={() => write()}
          isLoading={isLoading}
          // variant="change"
          className={cn('text-white', bgColorPhase[phase])}
        >
          {/* {playerTicket ? 'Change phase' : 'Hold on'} */}
          Change phase
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
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
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">Ticket price increases as more tickets are bought.</p>
                  <p className="mb-2">Price is split to wallet, pot and treasury (30,60,10).</p>
                  <p className="mb-2">Players can no longer join the game once it begins.</p>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Join us?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Next ticket price</p>
                      <p className="text-right"> 0.5ETH </p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Tickets left at this price </p>
                      <p className="text-right"> 30 </p>
                    </div>
                  </div>

                  <Button
                    disabled={!write || !playerTicket}
                    // size="md"
                    // variant="change"
                    onClick={() => write()}
                    isLoading={isLoading}
                    // variant="change"
                    className={cn('text-white', bgColorPhase[phase])}
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
