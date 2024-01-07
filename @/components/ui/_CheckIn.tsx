import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { Button } from './button'
import Image from 'next/image'
import { LogIn, ChevronUp, ChevronDown, AlertTriangle, AlertCircle } from 'lucide-react'
// import { , ChevronDownIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import Prompt from './Prompt'
import { formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
// import { tokenContractObj } from '../../../services/constant'
import OnSignal from './OnSignal'
import {
  defaultContractObj,
  tokenContractObj,
  DOCS_URL_safehouse,
  WEBSOCKET_ENDPOINT,
} from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { formatUnits, parseUnits } from 'viem'
import { io } from 'socket.io-client'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'

function CheckIn() {
  // State variables
  const phase = useStoreState((state) => state.phase)
  // const safehouseCostPerNight = useStoreState((state) => state.safehouseCostPerNight)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  // Address read
  const { address, isConnected } = useAccount()

  // const { data: playerTicket } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'playerTicket',
  //   args: [address as `0x${string}`],
  // })

  const { data, refetch } = useContractReads({
    contracts: [
      // {
      //   ...defaultContractObj,
      //   functionName: 'playerTicket',
      //   args: [address as `0x${string}`],
      // },
      {
        ...defaultContractObj,
        functionName: 'safehouseCostPerNight',
      },
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
    ],
  })

  const events: Event[] = [
    {
      name: 'events',
      async handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'SafehousePrice') {
          const { price, time } = dataJson
          refetch()
        }
      },
    },
  ]

  useSocketEvents(events)

  // const playerTicket = data?.[0].result || null
  const safehouseCostPerNight = data?.[0].result || BigInt(0)
  const balanceOf = data?.[1].result || BigInt(0)

  // const ticketStatus = Number(playerTicket?.[3] || BigInt(0))
  // const ticketIsInPlay = Boolean(playerTicket?.[5] || 0)
  // const ticketSafehouseNights = Number(playerTicket?.[15] || 0)

  const ticketStatus = ownedTicket?.status || 0
  const ticketIsInPlay = ownedTicket?.isInPlay || false
  const ticketSafehouseNights = ownedTicket?.safehouseNights || 0

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  const stayCost = formatUnits(safehouseCostPerNight, 3)
  const tokenBalance = formatUnits(balanceOf, 18)

  // Token contract read
  // const { data: balanceOf } = useContractRead({
  //   ...tokenContractObj,
  //   functionName: 'balanceOf',
  //   args: [address as `0x${string}`],
  // })

  // const tokenBalance = balanceOf / priceConversion
  // const tokenBalance = 200

  // Active condition
  let checkInActive: boolean
  checkInActive = phase === 'day' && ticketStatusString !== 'safe' && ticketIsInPlay === true

  // Contract write
  const [amountTicket, setAmountTicket] = React.useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const {
    data: checkInData,
    writeAsync,
    isLoading,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkIntoSafehouse',
  })

  const checkInHandler = async () => {
    try {
      const tx = await writeAsync({
        args: [BigInt(amountTicket)],
      })
      const hash = tx.hash
      console.log(hash)

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'checkedIn',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Check into Safehouse failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: checkInData?.hash,
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
        <Button variant="checkIn" className={`w-full text-xl flex justify-start`}>
          <OnSignal active={checkInActive} own={true} />
          Check In
          {/* <LogIn size={16} className="text-sm ml-1"></LogIn> */}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Check into Safehouse
              <Image
                priority
                src={`/indicator/dayIndicator.svg`}
                height={300}
                width={60}
                // fill={true}
                // sizes="max-width:150px"
                className=""
                // layout="fixed"
                alt={`dayIndicator`}
              />
              {/* <div className="day-last">
                <span className="font-headline">Day</span> Action
              </div> */}
            </DialogTitle>
            <ScrollArea className="h-[450px] md:h-[650px] rounded-md p-2">
              <div className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/CheckIntoSafehouse.png"
                  // layout="fill"
                  // objectFit='cover'
                  className="place-self-center rounded-xl"
                  height={400}
                  width={650}
                  alt="enter-into-the-pepe"
                />

                {/* <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Notes
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>Payment in $LAST. Pay before you stay.</p>
                      <p>You can check out anytime once you are checked in.</p>
                      <p>Ticket cannot be forfeited in the Safehouse.</p>
                      <p>But if you overstay, you can be kicked out. Your ticket is forfeited when you are kicked out.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-base sm:text-lg md:text-xl text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2 leading-tight">
                    Pay $LAST to stay in the Safehouse in the{' '}
                    <span className="font-headline day-last">Day</span>.
                  </p>

                  {/* <p className="mb-2">
                    You can only check in during the{' '}
                    <span className="font-headline day-last">Day</span>.
                  </p> */}
                  <p className="mb-2 leading-tight">
                    You cannot be killed in Safehouse. However, actions are limited.
                  </p>
                  {/* <p className="mb-2">Check out anytime once you are checked in.</p> */}
                  <p className="mb-2 leading-tight">
                    If you overstay, you can be kicked out and killed.
                  </p>
                  <a
                    href={DOCS_URL_safehouse}
                    target="_blank"
                    className="link text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>
                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  How long would you be staying?
                </div>

                <div className="w-[220px] md:w-[320px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">$LAST held</p>
                      <p className="text-right">
                        {' '}
                        {formatNumber(tokenBalance, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 0,
                        })}{' '}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">Nights stayed</p>
                      <p className="text-right"> {ticketSafehouseNights} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg justify-between gap-1">
                      <p className="text-left">Price per night</p>
                      <p className="text-right"> {stayCost} $LAST </p>
                    </div>
                  </div>
                  {/* Add new add/subtract component. Allow user to max nights based on $LAST in wallet / Price per night */}
                  <div className="flex justify-center">
                    <div className="text-2xl flex justify-between items-center p-2 gap-3">
                      Nights:
                    </div>
                    <div className="text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 rounded-xl flex justify-between items-center p-2 gap-3">
                      <p>{amountTicket}</p>
                      <div className="flex flex-col">
                        <button
                          className="w-[20px] h-[20px] flex justify-center items-center"
                          onClick={() => setAmountTicket(amountTicket + 1)}
                        >
                          <ChevronUp />
                        </button>
                        <button
                          className="w-[20px] h-[20px] flex justify-center items-center"
                          onClick={() => amountTicket > 0 && setAmountTicket(amountTicket - 1)}
                        >
                          <ChevronDown />
                        </button>
                      </div>
                    </div>
                  </div>
                  {checkInActive && (
                    <Button
                      variant="checkIn"
                      size="lg"
                      className="w-[100%]"
                      onClick={checkInHandler}
                      isLoading={isLoading}
                    >
                      Check In
                    </Button>
                  )}
                  {!checkInActive && ticketStatusString === 'safe' && (
                    <>
                      <Button variant="checkIn" size="lg" className="w-[100%]" disabled>
                        In Safehouse
                      </Button>

                      <Prompt docLink={DOCS_URL_safehouse} />
                    </>
                  )}
                  {!checkInActive && ticketStatusString !== 'safe' && (
                    <>
                      <Button variant="checkIn" size="lg" className="w-[100%]" disabled>
                        Check In
                      </Button>

                      <Prompt docLink={DOCS_URL_safehouse} />
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckIn
