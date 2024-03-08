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
import { LogOut, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Prompt from './Prompt'
import OnSignal from './_OnSignal'
import { toast } from './use-toast'
import {
  defaultContractObj,
  DOCS_URL_kickout,
  DOCS_URL_waterfall,
  WEBSOCKET_ENDPOINT,
  KICK_OUT_IMG,
  KICK_OUT_MOBILE_IMG,
  CHAIN_ID,
  GAME_ADDRESS,
} from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { useStoreActions, useStoreState } from '../../../store'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits } from 'viem'
import { io } from 'socket.io-client'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'

type KickOutType = {
  idList?: number
}

const useStore = () => {
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const ticketStatus = ownedTicket?.status || 0
  const ticketIsInPlay = ownedTicket?.isInPlay || false
  const ticketSafehouseNights = ownedTicket?.safehouseNights || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  return {
    phase,
    round,
    updateCompletionModal,
    ownedTicket,
    ticketStatus,
    ticketIsInPlay,
    ticketSafehouseNights,
    ticketStatusString,
  }
}

export const KickOutActive = () => {
  const { phase, ticketStatusString, ticketIsInPlay } = useStore()

  const kickOutActive: boolean =
    phase === 'night' && ticketStatusString !== 'safe' && ticketIsInPlay === true

  return kickOutActive
}

const KickOut: FC<KickOutType> = ({ idList }) => {
  const { phase, round, updateCompletionModal, ownedTicket, ticketStatusString, ticketIsInPlay } =
    useStore()
  const active = KickOutActive()
  const { address, isConnected } = useAccount()
  // State variables
  // const phase = useStoreState((state) => state.phase)
  // const round = useStoreState((state) => state.round)
  // const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  // Address read
  // Attacker
  // const { data: attackerTicket } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'playerTicket',
  //   args: [address as `0x${string}`],
  // })

  // const playerId = attackerTicket?.[0] || 0
  // const attackerStatus = attackerTicket?.[3] || 0
  // const attackerIsInPlay = Boolean(attackerTicket?.[5] || 0)
  // const attackerStatusString = statusPayload[attackerStatus] || 'unknown'

  const playerId = ownedTicket?.id || 0
  const playerStatus = ownedTicket?.status || 0
  const playerIsInPlay = ownedTicket?.isInPlay
  const playerStatusString = statusPayload[playerStatus] || 'unknown'

  // Defender
  const { data: idAddress } = useContractRead({
    ...defaultContractObj,
    functionName: 'idToPlayer',
    args: [BigInt(idList || 0)],
  })

  const { data: defenderTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [idAddress as `0x${string}`],
  })

  const defenderAddress = defenderTicket?.[1] || ''
  const defenderStatus = defenderTicket?.[3] || 0
  const defenderIsInPlay = Boolean(defenderTicket?.[5] || 0)
  const defenderValue = defenderTicket?.[7] || BigInt(0)
  const defenderCheckOutRound = Number(defenderTicket?.[16] || 0)
  const defenderStatusString = statusPayload[defenderStatus] || 'unknown'

  const events: Event[] = [
    {
      name: `events-${CHAIN_ID}-${GAME_ADDRESS}`,
      handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'KickedOutFromSafehouse') {
          const { caller, kickedOut, time } = dataJson

          if (kickedOut === playerId) {
            updateCompletionModal({
              isOpen: true,
              state: 'killed',
            })
          }
        }
      },
    },
  ]

  useSocketEvents(events)

  /*------------ Kick out from carousel input - mobile ------------*/

  // Active condition
  const kickOutInputActive: boolean = active

  // Contract write
  const [isModalOpen, setIsModalOpen] = useState(false)

  // const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: kickOutInputData,
    writeAsync: kickOutFromInput,
    isLoading: kickOutInputIsLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'kickOutFromSafehouse',
  })

  const kickOutInputHandler = async () => {
    try {
      if (defenderAddress.toLowerCase() === address?.toLowerCase()) {
        throw new Error('You cannot kick out yourself!')
      }

      const tx = await kickOutFromInput({
        args: [BigInt(defenderIdInput)],
      })
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
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

  const [defenderIdInput, setDefenderIdInput] = useState<string>('')

  /*------------ Kick out from TicketList - full screen  ------------*/
  const kickOutListActive: boolean =
    active &&
    defenderIsInPlay === true &&
    defenderStatusString === 'safe' &&
    defenderCheckOutRound <= round

  const {
    data: kickOutListData,
    writeAsync: kickOutFromList,
    isLoading: kickOutListIsLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'kickOutFromSafehouse',
  })

  const kickOutListHandler = async () => {
    try {
      if (defenderAddress.toLowerCase() === address?.toLowerCase()) {
        throw new Error('You cannot kick out yourself!')
      }

      const tx = await kickOutFromInput({
        args: [BigInt(idList || 0)],
      })
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
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

  const kickOutBackupImg = (event: any) => {
    event.target.src = '/lore/KickOut.png'
  }

  const kickOutMobileBackupImg = (event: any) => {
    event.target.src = '/lore/KickOutMobile.png'
  }

  return (
    <>
      <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
        <div className="sm:hidden block flex flex-col">
          {/* <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h1-last text-center">Kick Out</div>
            <Image
              priority
              src={`/indicator/nightIndicator.svg`}
              height={300}
              width={60}
              className=""
              alt="nightIndicator"
            />
          </div> */}
          <Image
            priority
            src={KICK_OUT_MOBILE_IMG}
            unoptimized
            className="place-self-center rounded-xl"
            height={400}
            width={650}
            alt="kick-out-player"
            onError={kickOutMobileBackupImg}
          />
        </div>
        <Image
          priority
          src={KICK_OUT_IMG}
          unoptimized
          className="hidden sm:block place-self-center rounded-xl"
          height={400}
          width={650}
          alt="kick-out-player"
          onError={kickOutBackupImg}
        />

        <div className="text-center">
          <p className="mb-2">Kick out and kill overstayers.</p>
          <p className="mb-2">Players overstay once it is night of their check out round</p>
          <a href={DOCS_URL_waterfall} target="_blank" className="link underline">
            <p className="mb-2">Value of killed ticket drops to next valid ticket.</p>
          </a>{' '}
          <a href={DOCS_URL_kickout} target="_blank" className="link h6-last align-top">
            Learn more
          </a>
        </div>

        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
        >
          <div className="m-1 capitalize text-center h2-last">Kicking?</div>

          <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
            {idList && (
              <>
                <div className="">
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
                <div className="digit-last">
                  {defenderCheckOutRound > round && (
                    <p className="text-xl text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                      Not yet. He can still chill
                    </p>
                  )}

                  {defenderCheckOutRound === round && phase === 'day' && (
                    <p className="text-xl text-amber-600 mt-2 text-center">
                      Watch him. He got to check out now
                    </p>
                  )}

                  {defenderCheckOutRound === round && phase === 'night' && (
                    <p className="text-xl text-red-600 mt-2 text-center">He is overstaying...</p>
                  )}

                  {defenderCheckOutRound < round && (
                    <p className="text-xl text-red-600 mt-2 text-center">He is overstaying...</p>
                  )}
                </div>

                <Button
                  variant="kickOut"
                  size="lg"
                  className="w-[100%] mt-4"
                  onClick={kickOutListHandler}
                  isLoading={kickOutListIsLoading}
                  disabled={!kickOutListActive}
                >
                  Kick Out Player 🪖{idList}
                </Button>
                {/* {!kickOutListActive && <Prompt docLink={DOCS_URL_kickout} />} */}
                {kickOutListActive ? '' : <Prompt docLink={DOCS_URL_kickout} />}
              </>
            )}

            {!idList && (
              <div className="w-full flex flex-col justify-center items-center gap-2">
                <label htmlFor="kickOut" className="text-2xl">
                  Kick Player 🪖
                </label>
                <input
                  type="text"
                  id="kickOut"
                  placeholder="0"
                  required
                  className="font-digit w-[6rem] text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl flex justify-between items-center p-2 gap-3"
                  value={defenderIdInput}
                  onChange={(e) => setDefenderIdInput(e.target.value)}
                />
                <Button
                  variant="kickOut"
                  size="lg"
                  className="w-[100%]"
                  onClick={kickOutInputHandler}
                  isLoading={kickOutInputIsLoading}
                  disabled={!kickOutInputActive}
                >
                  Kick out
                </Button>
                {/* {!kickOutInputActive && <Prompt docLink={DOCS_URL_kickout} />} */}

                <div className="digit-last">
                  {kickOutInputActive ? '' : <Prompt docLink={DOCS_URL_kickout} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default KickOut
