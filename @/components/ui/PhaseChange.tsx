import { Button } from '@/components/ui/button'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import React from 'react'
import type { FC } from 'react'
import type { IApp } from 'types/app'

type PhaseChangeType = {
  phaseType: IApp['phase']
}

const PhaseChange: FC<PhaseChangeType> = ({ phaseType }) => {
  let phaseChangeFunction = ''
  if (phaseType == 'countdown') {
    phaseChangeFunction = 'changeCountdownToDay'
  } else if (phaseType == 'day') {
    phaseChangeFunction = 'changeDayToDusk'
  } else if (phaseType == 'night') {
    phaseChangeFunction = 'changeNightToDay'
  }

  const { address, isConnected } = useAccount()

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
    enabled: isConnected,
  })

  console.log(playerTicket)
  // const playerGotTicket = playerTicket[0] > 0 ? true : false;

  const { write, isLoading } = useContractWrite({
    ...defaultContractObj,
    // functionName: phaseChangeFunction,
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
      size="sm"
      variant="default"
      onClick={() => write()}
      isLoading={isLoading && !playerTicket}
    >
      {playerTicket ? 'Change phase' : 'Hold on'}
    </Button>
  )
}

export default PhaseChange
