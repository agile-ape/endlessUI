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
import { defaultContractObj } from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import CompletionModal from './CompletionModal'

import { useStoreActions, useStoreState } from '../../../store'
import { priceConversion } from '@/lib/utils'

type AttackType = {
  id: number
}

// pass id as argument into the write function

const Attack: FC<AttackType> = ({ id }) => {
  // const [otpInput, setOtpInput] = React.useState<string>('')
  // const excludeSpecialChar = /^[a-zA-Z0-9]+$/
  const phase = useStoreState((state) => state.phase)
  const tokensPerAttack = useStoreState((state) => state.tokensPerAttack)
  const isAttackTime = useStoreState((state) => state.isAttackTime)
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  const tokensPerAttackConverted = tokensPerAttack / priceConversion
  // const {write, isLoading} = useContractWrite({
  //   ...defaultContractObj,
  //   functionName:'checkTicket',
  //   onError(error) {
  //     // @ts-ignore
  //     const errorMsg = error?.cause?.shortMessage || error?.message
  //     toast({
  //       variant: 'destructive',
  //       description: (
  //         <div className="flex flex-row">
  //           <AlertCircle size={24} className="mr-2 stroke-red-800" />
  //           <span className="text-base">Reason: {errorMsg}</span>
  //         </div>
  //       ),
  //     })
  //   },
  //   onSuccess(data) {
  //     console.log('Success', data)
  //     <CompletionModal alertLookTest={ }/>
  //   },

  // })

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="attack" className="w-full py-1 text-lg h-8 mt-2">
          Attack
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

                {/* <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                        Notes
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>If keyword is wrong, his ticket is forfeited.</p>
                      <p>Ticket value goes to player before him - if Ticket #4 is forfeited, ticket #4's value goes to Player #3</p>
                      <p>Each check earns you some $LAST during Normal rounds.</p>
                      <p>Ticket can only be checked once per night.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}

                <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">You kill the player if the submitted keyword is wrong.</p>
                  <div className="flex mb-2 border rounded-lg border-zinc-800 dark:border-zinc-200 py-2 px-3">
                    <AlertCircle size={48} className="align-top mr-2"></AlertCircle>
                    Killed player value does not go to the killer. It goes to the player before him
                    - if #4 is killed, all his value goes to #3
                  </div>
                  <p className="mb-2">
                    Each check earns you some $LAST during{' '}
                    <span className="font-semibold">Stage 1</span>.
                  </p>
                  <p className="mb-2">
                    Each player can only be attacked once per{' '}
                    <span className="font-headline night-last">Night</span>.
                  </p>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Attack this player?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">$LAST per check</p>
                      <p className="text-right"> {tokensPerAttackConverted}</p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Player value</p>
                      <p className="text-right"> 30 ETH</p>
                    </div>

                    <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Player last seen at</p>
                      <p className="text-right underline"> 4 </p>
                    </div>

                    {/* <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">Last action </p>
                      <p className="text-right"> Entered game </p>
                    </div> */}
                  </div>

                  {!isDisabled && (
                    <Button variant="attack" size="lg" className="w-[100%]">
                      Attack
                    </Button>
                  )}

                  {isDisabled && (
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
