import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from './button'
import Image from 'next/image'
import type { FC } from 'react'

import { LogOut, AlertCircle, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import Prompt from './Prompt'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import {
  defaultContractObj,
  DOCS_URL_attack,
  DOCS_URL_waterfall,
  WEBSOCKET_ENDPOINT,
} from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import CompletionModal from './CompletionModal'

import { useStoreActions, useStoreState } from '../../../store'
import OnSignal from './OnSignal'
import { statusPayload } from '@/lib/utils'
import { formatUnits } from 'viem'
import { io } from 'socket.io-client'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'

type AttackType = {
  id: number
}

const Attack: FC<AttackType> = ({ id }) => {
  // State variables
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  // const tokensPerAttack = useStoreState((state) => state.tokensPerAttack)
  // const isAttackTime = useStoreState((state) => state.isAttackTime)

  // Address read
  // Attacker
  const { address, isConnected } = useAccount()

  // const { data: attackerTicket } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'playerTicket',
  //   args: [address as `0x${string}`],
  // })

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'playerTicket',
        args: [address as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'tokensPerAttack',
      },
      {
        ...defaultContractObj,
        functionName: 'isAttackTime',
      },
    ],
  })

  const events: Event[] = [
    {
      name: 'events',
      async handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'KeywordUpdated') {
          const { newKeyword, time } = dataJson
          toast({
            variant: 'info',
            // title: 'Keyword updated',
            description: <p>Keyword updated. Time to rumble</p>,
          })
        }

        if (event === 'AttackAndKilled') {
          const { caller, defendingTicket, ticketValue, time } = dataJson

          // attacker
          if (caller === playerId) {
            triggerCompletionModal({
              isOpen: true,
              state: 'attackAndKill',
            })
          }
          // defender
          if (defendingTicket === playerId) {
            triggerCompletionModal({
              isOpen: true,
              state: 'killed',
            })
          }
        }

        if (event === 'AttackAndSafe') {
          const { caller, defendingTicket, time } = dataJson

          // attacker
          if (caller === playerId) {
            triggerCompletionModal({
              isOpen: true,
              state: 'attackButFail',
            })
          }
          // defender
          if (defendingTicket === playerId) {
            triggerCompletionModal({
              isOpen: true,
              state: 'attackedButSafe',
            })
          }
        }

        if (event === 'ValueWaterfall') {
          const { receivingTicket, amount, time } = dataJson

          // receiver
          if (receivingTicket === playerId) {
            triggerCompletionModal({
              isOpen: true,
              state: 'received',
            })
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        refetch()
      },
    },
  ]

  useSocketEvents(events)

  const attackerTicket = data?.[0].result || null
  const tokensPerAttack = data?.[1].result || BigInt(0)
  const isAttackTime = Boolean(data?.[2].result || BigInt(0))

  const playerId = attackerTicket?.[0] || 0
  const attackerStatus = attackerTicket?.[3] || 0
  const attackerIsInPlay = Boolean(attackerTicket?.[5] || 0)
  const attackerAttacks = Number(attackerTicket?.[11]) || 0

  // const tokensPerAttackConverted = tokensPerAttack / priceConversion

  const tokensFarmed = formatUnits(tokensPerAttack, 3)
  const attackerStatusString = statusPayload[attackerStatus] || 'unknown'

  // Defender
  const { data: idAddress } = useContractRead({
    ...defaultContractObj,
    functionName: 'idToPlayer',
    args: [BigInt(id)],
  })

  const { data: defenderTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [idAddress as `0x${string}`],
  })

  const defenderStatus = defenderTicket?.[3] || 0
  const defenderLastSeen = Number(defenderTicket?.[4] || 0)
  const defenderIsInPlay = Boolean(defenderTicket?.[5] || 0)
  const defenderValue = Number(defenderTicket?.[7]) || 0
  const defenderAddress = defenderTicket?.[1] || ''

  const defenderStatusString = statusPayload[defenderStatus] || 'unknown'
  const submitOrNot =
    defenderStatusString === 'submitted' || ('checked' && defenderLastSeen === round) ? 'Yes' : 'No'

  // Active condition
  const attackActive: boolean =
    phase === 'night' &&
    attackerStatusString !== 'safe' &&
    attackerIsInPlay === true &&
    isAttackTime === true &&
    attackerAttacks > 0 &&
    defenderIsInPlay === true &&
    defenderStatusString !== 'safe' &&
    !(defenderLastSeen === round && defenderStatusString === 'checked')

  // Contract write
  const {
    data: attackData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'attackTicket',
  })

  const attackTicketHandler = async () => {
    try {
      // const nextPrice = parseUnits(String(nextTicketPriceConverted), 18)

      if (defenderAddress.toLowerCase() === address?.toLowerCase()) {
        throw new Error('You cannot attack yourself!')
      }

      const tx = await writeAsync({
        args: [BigInt(id)],
      })
      const hash = tx.hash
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason ||
        error?.cause?.shortMessage ||
        error?.message ||
        'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Attack ticket failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  const {} = useWaitForTransaction({
    hash: attackData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="attack" className="w-full py-1 text-lg h-8 mt-2">
          {/* <div className="flex items-center"> */}
          <OnSignal active={attackActive} own={false} />
          Attack
          {/* </div> */}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Attack player
              <Image
                priority
                src={`/indicator/nightIndicator.svg`}
                height={300}
                width={60}
                // fill={true}
                // sizes="max-width:150px"
                className=""
                // layout="fixed"
                alt={`nightIndicator`}
              />
              {/* <div className="night-last">
                <span className="font-headline">Night</span> Action
              </div> */}
            </DialogTitle>
            <ScrollArea className="h-[450px] md:h-[650px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/AttackPlayer.png"
                  // layout="fill"
                  // objectFit='cover'
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                <div className="w-[100%] text-base sm:text-lg md:text-xl text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2 leading-tight">You kill the player if his keyword is wrong.</p>
                  <p className="mb-2 leading-tight">
                    Attacker receives $LAST for each attack during{' '}
                    <span className="font-semibold">Stage 1</span>.
                  </p>
                  <p className="mb-2 leading-tight">
                    You cannot attack if you or player is in safehouse.
                  </p>
                  <p className="mb-2 leading-tight">
                    Each player can only be attacked once per{' '}
                    <span className="font-headline night-last">Night</span>.
                  </p>
                  <div className="flex mb-2 border rounded-lg border-zinc-800 dark:border-zinc-200 py-2 px-3">
                    <AlertCircle size={48} className="align-top mr-2"></AlertCircle>
                    <p>
                      Killed ticket value does not go to the killer. It follows the{' '}
                      <a href={DOCS_URL_waterfall} target="_blank" className="link">
                        value waterfall
                      </a>{' '}
                      rule.
                    </p>
                  </div>
                  <a
                    href={DOCS_URL_attack}
                    target="_blank"
                    className="link text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Attack Player #{id}?
                </div>

                <div className="w-[220px] md:w-[320px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">$LAST per attack</p>

                      <p className="text-right">
                        {/* {stage} */}
                        {tokensFarmed}
                      </p>
                    </div>

                    {/* <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Submitted?</p>
                      <p className="text-right capitalize"> {submitOrNot}</p>
                    </div> */}

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Player value</p>
                      <p className="text-right"> {formatUnits(BigInt(defenderValue), 18)} ETH</p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Player last seen at</p>
                      <p className="text-right underline"> {defenderLastSeen} </p>
                    </div>

                    {/* <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Last action </p>
                      <p className="text-right"> Entered game </p>
                    </div> */}
                  </div>

                  {phase === 'night' && isAttackTime === false && (
                    <div className="h-12 rounded-xl px-5 py-1 text-xl leading-10">
                      Keyword updating...
                    </div>
                  )}

                  <Button
                    variant="attack"
                    size="lg"
                    className="w-[100%]"
                    onClick={attackTicketHandler}
                    isLoading={isLoading}
                    disabled={!attackActive}
                  >
                    Attack Player #{id}
                  </Button>

                  {!attackActive && <Prompt docLink={DOCS_URL_attack} />}
                </div>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Attack
