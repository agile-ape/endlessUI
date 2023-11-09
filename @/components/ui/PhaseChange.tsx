import { Button } from '@/components/ui/button'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'

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
        title: 'Its not time yet 😭',
        description: <p className="text-base">Reason: {errorMsg}</p>,
      })
    },
    onSuccess(data) {
      console.log('Success', data)
      toast({
        title: 'The phase has change',
        description: 'Welcome to the Day!',
      })
    },
  })

  return (
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
  )
}

export default PhaseChange
