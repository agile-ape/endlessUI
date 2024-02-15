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
import dynamic from 'next/dynamic'

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
  ATTACK_PLAYER_IMG,
  ATTACK_PLAYER_MOBILE_IMG,
  CHAIN_ID,
} from '../../../services/constant'
import { toast } from '@/components/ui/use-toast'
import CompletionModal from './CompletionModal'

import { useStoreActions, useStoreState } from '../../../store'
import OnSignal from './OnSignal'
import { statusPayload } from '@/lib/utils'
import { formatUnits } from 'viem'
import { io } from 'socket.io-client'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'
import { useWindowSize } from '../../../hooks/useWindowSize'

type AttackType = {
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

/*
function pullPlayers(id: number) {
  const { phase, round, ticketStatusString, ticketIsInPlay } = useStore()

  const { address, isConnected } = useAccount()

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

  const attackerTicket = data?.[0].result || null
  const tokensPerAttack = data?.[1].result || BigInt(0)
  const isAttackTime = Boolean(data?.[2].result || BigInt(0))

  const playerId = attackerTicket?.[0] || 0
  const attackerStatus = attackerTicket?.[3] || 0
  const attackerIsInPlay = Boolean(attackerTicket?.[5] || 0)
  const attackerAttacks = Number(attackerTicket?.[11]) || 0
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

  return {
    phase,
    round,
    tokensPerAttack,
    isAttackTime,
    playerId,
    attackerStatus,
    attackerIsInPlay,
    attackerAttacks,
    tokensFarmed,
    attackerStatusString,
    defenderStatus,
    defenderLastSeen,
    defenderIsInPlay,
    defenderValue,
    defenderAddress,
    defenderStatusString,
    submitOrNot,
  }
}
*/

export const AttackActive = () => {
  const { phase, ticketStatusString, ticketIsInPlay } = useStore()

  const attackActive: boolean =
    phase === 'night' && ticketStatusString !== 'safe' && ticketIsInPlay === true

  return attackActive
}

const AttackNew: FC<AttackType> = ({ idList }) => {
  const { phase, round, updateCompletionModal, ownedTicket, ticketStatusString, ticketIsInPlay } =
    useStore()
  const active = AttackActive()
  const { address, isConnected } = useAccount()
  const { data, refetch } = useContractReads({
    contracts: [
      // {
      //   ...defaultContractObj,
      //   functionName: 'playerTicket',
      //   args: [address as `0x${string}`],
      // },
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

  // const attackerTicket = data?.[0].result || null
  const tokensPerAttack = data?.[0].result || BigInt(0)
  const isAttackTime = Boolean(data?.[1].result || BigInt(0))

  // const playerId = attackerTicket?.[0] || 0
  // const attackerStatus = attackerTicket?.[3] || 0
  // const attackerIsInPlay = Boolean(attackerTicket?.[5] || 0)
  // const attackerAttacks = Number(attackerTicket?.[11]) || 0

  const playerId = ownedTicket?.id || 0
  const playerStatus = ownedTicket?.status || 0
  const playerIsInPlay = ownedTicket?.isInPlay
  const playerStatusString = statusPayload[playerStatus] || 'unknown'

  const playerAttacks = ownedTicket?.attacks || 0
  const tokensFarmed = formatUnits(tokensPerAttack, 3)

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
  const defenderLastSeen = Number(defenderTicket?.[4] || 0)
  const defenderIsInPlay = Boolean(defenderTicket?.[5] || 0)
  const defenderValue = Number(defenderTicket?.[7]) || 0
  const defenderStatusString = statusPayload[defenderStatus] || 'unknown'

  const events: Event[] = [
    {
      name: `events-${CHAIN_ID}`,
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
            updateCompletionModal({
              isOpen: true,
              state: 'attackAndKill',
            })
          }
          // defender
          if (defendingTicket === playerId) {
            updateCompletionModal({
              isOpen: true,
              state: 'killed',
            })
          }
        }

        if (event === 'AttackAndSafe') {
          const { caller, defendingTicket, time } = dataJson

          // attacker
          if (caller === playerId) {
            updateCompletionModal({
              isOpen: true,
              state: 'attackButFail',
            })
          }
          // defender
          if (defendingTicket === playerId) {
            updateCompletionModal({
              isOpen: true,
              state: 'attackedButSafe',
            })
          }
        }

        if (event === 'ValueWaterfall') {
          const { receivingTicket, amount, time } = dataJson

          // receiver
          if (receivingTicket === playerId) {
            updateCompletionModal({
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

  /*------------ Attack from carousel input - mobile ------------*/
  const attackInputActive: boolean = active && isAttackTime == true && playerAttacks > 0

  const {
    data: attackInputData,
    writeAsync: attackFromInput,
    isLoading: attackInputIsLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'attackTicket',
  })

  const attackInputHandler = async () => {
    try {
      if (defenderAddress.toLowerCase() === address?.toLowerCase()) {
        throw new Error('You cannot attack yourself!')
      }

      const tx = await attackFromInput({
        args: [BigInt(defenderIdInput)],
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
    hash: attackInputData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  const [defenderIdInput, setDefenderIdInput] = useState<string>('')

  /*------------ Attack from TicketList - full screen ------------*/

  const attackListActive: boolean =
    active &&
    isAttackTime == true &&
    playerAttacks > 0 &&
    defenderIsInPlay === true &&
    defenderStatusString !== 'safe' &&
    !(defenderLastSeen === round && defenderStatusString === 'checked')

  const {
    data: attackListData,
    writeAsync: attackFromList,
    isLoading: attackListIsLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'attackTicket',
  })

  const attackListHandler = async () => {
    try {
      // const nextPrice = parseUnits(String(nextTicketPriceConverted), 18)

      if (defenderAddress.toLowerCase() === address?.toLowerCase()) {
        throw new Error('You cannot attack yourself!')
      }

      const tx = await attackFromList({
        args: [BigInt(idList || 0)],
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
    hash: attackListData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  const attackBackupImg = (event: any) => {
    event.target.src = '/lore/AttackPlayer.png'
  }

  const attackMobileBackupImg = (event: any) => {
    event.target.src = '/lore/AttackPlayerMobile.png'
  }

  return (
    <>
      <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
        <div className="sm:hidden block flex flex-col">
          {/* <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h1-last text-center">Attack</div>
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
            src={ATTACK_PLAYER_MOBILE_IMG}
            unoptimized
            className="place-self-center rounded-xl"
            height={400}
            width={650}
            alt="attack-player"
            onError={attackMobileBackupImg}
          />
        </div>

        <Image
          priority
          src={ATTACK_PLAYER_IMG}
          unoptimized
          className="hidden sm:block place-self-center rounded-xl"
          height={400}
          width={650}
          alt="attack-player"
          onError={attackBackupImg}
        />

        <div className="text-center">
          <p className="mb-2">Attacked player dies if no Pepe Protection.</p>
          <p className="mb-2">Attacker get $LAST tokens.</p>
          <p className="mb-2">Each player can only be attacked once per round.</p>
          <a href={DOCS_URL_waterfall} target="_blank" className="link underline">
            <p className="mb-2">Value of killed ticket drops to next valid ticket.</p>
          </a>{' '}
          <a href={DOCS_URL_attack} target="_blank" className="link h6-last align-top">
            Learn more
          </a>
        </div>

        <div
          className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
        >
          <div className="m-1 capitalize text-center h2-last">Attacking?</div>

          <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
            <div className="">
              <div className="grid grid-cols-2 gap-1">
                <p className="text-left">$LAST per attack</p>
                <p className="text-right">{tokensFarmed}</p>
              </div>

              <div>
                {idList ? (
                  <>
                    <div className="grid grid-cols-2 gap-1">
                      <p className="text-left">Player value</p>
                      <p className="text-right"> {formatUnits(BigInt(defenderValue), 18)} ETH</p>
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      <p className="text-left">Player last seen at</p>
                      <p className="text-right round-last"> {defenderLastSeen} </p>
                    </div>

                    <Button
                      variant="attack"
                      size="lg"
                      className="w-[100%] mt-4"
                      onClick={attackListHandler}
                      isLoading={attackListIsLoading}
                      disabled={!attackListActive}
                    >
                      Attack Player #{idList}
                    </Button>
                    {!attackListActive && <Prompt docLink={DOCS_URL_attack} />}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {phase === 'night' && isAttackTime === false && (
              <div className="font-digit h-12 rounded-xl px-5 py-1 text-xl leading-10">
                Keyword updating...
              </div>
            )}

            {!idList && (
              <div className="w-full flex flex-col justify-center items-center gap-2">
                <label htmlFor="attack" className="text-2xl">
                  Attack Player #
                </label>
                <input
                  type="text"
                  id="attack"
                  required
                  className="font-digit w-[6rem] text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-xl flex justify-between items-center p-2 gap-3"
                  value={defenderIdInput}
                  placeholder="0"
                  onChange={(e) => setDefenderIdInput(e.target.value)}
                />
                <Button
                  variant="attack"
                  size="lg"
                  className="w-[100%]"
                  onClick={attackInputHandler}
                  isLoading={attackInputIsLoading}
                  disabled={!attackInputActive}
                >
                  Attack
                </Button>
                {!attackInputActive && <Prompt docLink={DOCS_URL_attack} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(AttackNew), { ssr: false })
