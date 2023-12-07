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
import { LogOut, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Prompt from './Prompt'
import OnSignal from './OnSignal'
import { toast } from './use-toast'
import { defaultContractObj, DOCS_URL_kickout } from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useContractEvent,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { useStoreActions, useStoreState } from '../../../store'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits } from 'viem'

type KickOutType = {
  id: number
}

const KickOut: FC<KickOutType> = ({ id }) => {
  // State variables
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  // Address read
  // Attacker
  const { address, isConnected } = useAccount()

  const { data: attackerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
  })

  const playerId = attackerTicket?.[0] || 0
  const attackerStatus = attackerTicket?.[3] || 0
  const attackerIsInPlay = Boolean(attackerTicket?.[5] || 0)

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
  const defenderIsInPlay = Boolean(defenderTicket?.[5] || 0)
  const defenderCheckOutRound = Number(defenderTicket?.[16] || 0)
  const defenderValue = defenderTicket?.[7] || BigInt(0)

  const defenderStatusString = statusPayload[defenderStatus] || 'unknown'

  // Active condition
  const kickOutActive: boolean =
    phase === 'night' &&
    attackerIsInPlay === true &&
    attackerStatusString !== 'safe' &&
    defenderIsInPlay === true &&
    defenderStatusString === 'safe' &&
    defenderCheckOutRound <= round

  // Contract write
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: kickOutData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'kickOutFromSafehouse',
  })

  const kickOutHandler = async () => {
    try {
      const tx = await writeAsync({
        args: [BigInt(id)],
      })
      const hash = tx.hash

      setIsModalOpen(false)

      triggerCompletionModal({
        isOpen: true,
        state: 'kickedOut',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        // title: 'Kick out failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // got kicked out
  useContractEvent({
    ...defaultContractObj,
    eventName: 'KickedOutFromSafehouse',
    listener: (event) => {
      const args = event[0]?.args
      const { caller, kickedOut, time } = args

      if (kickedOut === playerId) {
        triggerCompletionModal({
          isOpen: true,
          state: 'killed',
        })
      }
      console.log({ args })
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="kickOut" className="w-full py-1 text-lg h-8 rounded-md">
          <OnSignal active={kickOutActive} own={false} />
          Kick Out
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Kick player out
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
                  src="/lore/KickOut.png"
                  // layout="fill"
                  // objectFit='cover'
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                <div className="w-[100%] text-base sm:text-lg md:text-xl text-zinc-800 dark:text-zinc-200">
                  <p className="leading-tight mb-2">Kick out players that overstay in Safehouse.</p>
                  <p className="leading-tight mb-2">
                    Track their check out round: Once it is the{' '}
                    <span className="font-headline night-last">Night</span> of their check out
                    round, you can kick them out.
                  </p>

                  <div className="flex mb-2 border border-zinc-800 dark:border-zinc-200 rounded-lg py-2 px-3">
                    <AlertCircle size={48} className="align-top mr-2"></AlertCircle>
                    Killed ticket value does not go to the kicker. It goes to the player ticket
                    before him - if #4 is killed, all his value goes to #3
                  </div>
                  <a
                    href={DOCS_URL_kickout}
                    target="_blank"
                    className="mb-2 underline text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>

                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Kick Player #{id} Out?
                </div>

                <div className="w-[280px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left"> Player value</p>
                      <p className="text-right">{formatUnits(defenderValue, 18)}ETH</p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left"> Check out round</p>
                      <p className="text-right underline"> {defenderCheckOutRound} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left">Current round</p>
                      <p className="text-right underline"> {round} </p>
                    </div>
                  </div>

                  {kickOutActive && (
                    <Button
                      variant="kickOut"
                      size="lg"
                      className="w-[100%]"
                      onClick={kickOutHandler}
                      isLoading={isLoading}
                    >
                      {/* {IsCurrentRound>=CheckOutDay ? 'Kick out' : 'Not yet'} */}
                      Kick Out Player #{id}
                    </Button>
                  )}

                  {!kickOutActive && (
                    <>
                      <Button variant="kickOut" size="lg" className="w-[100%]" disabled>
                        Kick Out
                      </Button>
                      <Prompt docLink={DOCS_URL_kickout} />
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

export default KickOut
