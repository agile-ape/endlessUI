import { Button } from '@/components/ui/button'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'
import { useStoreState } from '../../../store'

type PhaseChangeType = {
  phaseType: IApp['phase']
}

const mappedFunction: Record<string, string> = {
  day: 'changeDayToDusk',
  dusk: 'changeDuskToNight',
  night: 'changeNightToDay',
  countdown: 'changeCountdownToDay',
}

const PhaseChange = () => {
  const phase = useStoreState((state) => state.phase)
  const { address, isConnected } = useAccount()

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
    <div className="bg-gradient-to-br from-orange-600 to-yellow-400 rounded-lg p-0.5 shadow-md shadow-orange-400/70">
      <Button
        disabled={!write || !playerTicket}
        size="md"
        variant="change"
        onClick={() => write()}
        isLoading={isLoading}
      >
        {playerTicket ? 'Change phase' : 'Hold on'}
      </Button>
    </div>
  )
}

export default PhaseChange
