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
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { Button } from './button'
import Image from 'next/image'
import { LogOut, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStoreActions, useStoreState } from '../../../store'
import Prompt from './Prompt'
import OnSignal from './OnSignal'
import { defaultContractObj, DOCS_URL_checkout } from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

function CheckOut() {
  // State variables
  const phase = useStoreState((state) => state.phase)
  const round = useStoreState((state) => state.round)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  let ticketStatus = ownedTicket?.status || 0
  let ticketLastSeen = ownedTicket?.lastSeen || 0
  let ticketIsInPlay = ownedTicket?.isInPlay || false
  let ticketSafehouseNights = ownedTicket?.safehouseNights || 0
  let ticketCheckOutRound = ownedTicket?.checkOutRound || 0

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

  // Active condition
  const checkOutActive: boolean = phase === 'day' && ticketStatusString === 'safe'

  // Contract write

  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'checkOutFromSafehouse',
  })

  const checkOutHandler = async () => {
    try {
      // const nextPrice = parseUnits(String(nextTicketPriceConverted), 18)

      const tx = await writeAsync({})
      const hash = tx.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'checkedOut',
      })
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Check out failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Button to click on */}
        <Button variant="checkOut" className="w-full text-xl">
          <OnSignal active={checkOutActive} own={true} />
          Check Out
          {/* <LogOut size={16} className="text-sm ml-1"></LogOut> */}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
              Check out of Safehouse
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
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/CheckOutOfSafehouse.png"
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
                      <p>You can check in again after you have checked out.</p>
                      <p>Remember to Submit keyword once checked out. You are back in the game!</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2 leading-tight">Make sure to check out on time.</p>
                  <p className="mb-2 leading-tight">
                    You can check in again after you have checked out.
                  </p>
                  <p className="mb-2 leading-tight">Remember to Submit keyword once checked out!</p>
                  <a
                    href={DOCS_URL_checkout}
                    target="_blank"
                    className="mb-2 underline text-xs sm:text-sm md:text-base leading-tight"
                  >
                    Learn more
                  </a>
                </div>
                {/* Pay for stay */}
                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  How long do you have with us?
                </div>

                <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left">Checked in on</p>
                      <p className="text-right underline"> {ticketLastSeen} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg gap-1">
                      <p className="text-left"> Check out round </p>
                      <p className="text-right underline"> {ticketCheckOutRound} </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg justify-between mt-2 gap-1">
                      <p className="text-left">Current round</p>
                      <p className="text-right underline"> {round} </p>
                    </div>
                  </div>

                  {checkOutActive && (
                    <Button
                      variant="checkOut"
                      size="lg"
                      className="w-[100%]"
                      onClick={checkOutHandler}
                      isLoading={isLoading}
                    >
                      Check Out
                    </Button>
                  )}

                  {!checkOutActive && (
                    <>
                      <Button variant="checkOut" size="lg" className="w-[100%]" disabled>
                        Check Out
                      </Button>
                      <Prompt docLink={DOCS_URL_checkout} />
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

export default CheckOut
