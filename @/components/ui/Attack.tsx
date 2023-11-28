import React, { useRef, useState } from 'react'
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
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj, DOCS_URL_attack } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import CompletionModal from './CompletionModal'

import { useStoreActions, useStoreState } from '../../../store'
import { priceConversion } from '@/lib/utils'
import OnSignal from './OnSignal'
import { statusPayload } from '@/lib/utils'
import { formatUnits } from 'viem'

type AttackType = {
  id: number
}

const Attack: FC<AttackType> = ({ id }) => {
  // State variables
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const tokensPerAttack = useStoreState((state) => state.tokensPerAttack)
  const isAttackTime = useStoreState((state) => state.isAttackTime)

  const tokensPerAttackConverted = tokensPerAttack / priceConversion

  // Address read
  // Attacker
  const { address, isConnected } = useAccount()

  const { data: attackerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
  })

  let attackerStatus = attackerTicket?.[3] || 0
  let attackerAttacks = Number(attackerTicket?.[11]) || 0

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

  let defenderStatus = defenderTicket?.[3] || 0
  let defenderLastSeen = Number(defenderTicket?.[4] || 0)
  let defenderIsInPlay = Boolean(defenderTicket?.[5] || 0)
  let defenderValue = Number(defenderTicket?.[7]) || 0

  const defenderStatusString = statusPayload[defenderStatus] || 'unknown'

  // Active condition
  let attackActive: boolean
  attackActive =
    phase === 'night' &&
    isAttackTime === true &&
    attackerStatusString !== 'safe' &&
    attackerAttacks > 0 &&
    defenderIsInPlay === true &&
    defenderStatusString !== 'safe' &&
    !(defenderLastSeen === round && defenderStatusString === 'checked')

  // Contract write
  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'attackTicket',
  })

  const attackTicketHandler = async () => {
    try {
      // const nextPrice = parseUnits(String(nextTicketPriceConverted), 18)

      const tx = await writeAsync({
        args: [BigInt(id)],
      })
      const hash = tx.hash
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Attack ticket failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
    }
  }

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
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
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
                  <p className="mb-2 leading-tight">
                    You kill the player if he did not submit keyword/ submitted keyword is wrong.
                  </p>
                  <p className="mb-2 leading-tight">
                    Each attack earns you some $LAST during{' '}
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
                    Killed ticket value does not go to the killer. It goes to the player ticket
                    before him - if #4 is killed, all his value goes to #3
                  </div>
                  <a
                    href={DOCS_URL_attack}
                    target="_blank"
                    className="mb-2 underline text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Attack Player #{id}?
                </div>

                <div className="w-[280px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">$LAST per attack</p>
                      <p className="text-right"> {tokensPerAttackConverted}</p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Player status</p>
                      <p className="text-right capitalize"> {defenderStatusString}</p>
                    </div>

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

                  {attackActive && (
                    <Button
                      variant="attack"
                      size="lg"
                      className="w-[100%]"
                      onClick={attackTicketHandler}
                      isLoading={isLoading}
                    >
                      Attack Player #{id}
                    </Button>
                  )}

                  {!attackActive && (
                    <>
                      <Button variant="attack" size="lg" className="w-[100%]" disabled>
                        Attack
                      </Button>

                      <Prompt />
                    </>
                  )}
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
