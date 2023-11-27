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
import { Button } from './button'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import Prompt from './Prompt'
import { formatNumber, tokenConversion } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { defaultContractObj, DOCS_URL_buy } from '../../../services/constant'
import { parseUnits } from 'viem'
import { toast } from './use-toast'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import CustomConnectButton from './connect-button'
import OnSignal from './OnSignal'

function BuyTicket() {
  // State variables
  const phase = useStoreState((state) => state.phase)
  const nextTicketPrice = useStoreState((state) => state.nextTicketPrice)
  const increaseInPrice = useStoreState((state) => state.increaseInPrice)
  const ticketsAvailableAtCurrentPrice = useStoreState(
    (state) => state.ticketsAvailableAtCurrentPrice,
  )
  const ticketsCounter = useStoreState((state) => state.ticketsCounter)

  const ticketsLeft = ticketsAvailableAtCurrentPrice - ticketsCounter + 1
  const nextTicketPriceConverted = nextTicketPrice / tokenConversion
  const nextPrice = (nextTicketPrice + increaseInPrice) / tokenConversion

  // Address read
  const { address, isConnected } = useAccount()

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
  })

  let ticketId = playerTicket?.[0] || 0

  // Active condition
  const buyTicketActive = phase === 'start' && ticketId === 0

  // Contract write
  // call buyTicket() - default value 0
  const [buddyValue, setBuddyValue] = useState('0')

  const { writeAsync, isLoading } = useContractWrite({
    ...defaultContractObj,
    functionName: 'buyTicket',
    value: parseUnits(String(nextTicketPriceConverted), 18),
  })

  const buyTicketHandler = async () => {
    try {
      const tx = await writeAsync({
        args: [BigInt(buddyValue)],
      })
      const hash = tx.hash
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Buy ticket failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="enter"
            className="rounded-full px-1 py-1 leading-10 h-12 w-full mt-4 text-2xl"
          >
            {buyTicketActive && (
              <div className="flex justify-start items-center">
                <OnSignal active={buyTicketActive} own={true} />
                Join for{' '}
                {formatNumber(nextTicketPriceConverted, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}{' '}
                ETH
              </div>
            )}

            {!buyTicketActive && (
              <div className="flex justify-start items-center">
                <OnSignal active={buyTicketActive} own={true} />
                Starts at:{' '}
                {formatNumber(nextTicketPriceConverted, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 3,
                })}{' '}
                ETH
              </div>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <div className="overflow-auto">
            <DialogHeader className="items-center">
              <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
                Join game
                <Image
                  priority
                  src={`/indicator/startIndicator.svg`}
                  height={300}
                  width={60}
                  className=""
                  alt={`startIndicator`}
                />
              </DialogTitle>
              <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
                <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                  <Image
                    priority
                    src="/lore/EnterGame.png"
                    className="place-self-center rounded-xl"
                    height={400}
                    width={650}
                    alt="enter-into-the-pepe"
                  />

                  <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                    <p className="mb-2 leading-tight">
                      Entry price increases as more players join.
                    </p>
                    <p className="mb-2 leading-tight">
                      Players can no longer join the game once timer ends.
                    </p>
                    <p className="mb-2 leading-tight">Join with a buddy to increase $LAST earn.</p>
                    <a
                      href={DOCS_URL_buy}
                      target="_blank"
                      className="mb-2 underline text-xs sm:text-sm md:text-base leading-tight"
                    >
                      Learn more
                    </a>
                  </div>

                  {/* Pay for stay */}
                  <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                    Join us?
                  </div>

                  <div className="w-[280px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                    <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                      <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                        <p className="text-left leading-tight">Current price</p>
                        <p className="text-right align-middle"> {nextTicketPriceConverted} ETH </p>
                      </div>

                      <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                        <p className="text-left leading-tight">Tickets left at this price </p>
                        <p className="text-right align-middle"> {ticketsLeft} </p>
                      </div>

                      <div className="grid grid-cols-2 text-lg gap-1 mb-2">
                        <p className="text-left leading-tight">Next price</p>
                        <p className="text-right align-middle"> {nextPrice} ETH </p>
                      </div>
                    </div>

                    <div className="flex mt-4 px-4 items-center w-[100%] text-zinc-800 dark:text-zinc-200 text-lg justify-between">
                      <div className="flex gap-1 items-center">
                        <label htmlFor="buddy">(Optional) Buddy #</label>
                        <input
                          type="text"
                          id="buddy"
                          className="w-[3rem] border-[2px] border-slate-400 rounded-md px-1 text-center"
                          value={buddyValue}
                          onChange={(e) => setBuddyValue(e.target.value)}
                        />
                      </div>
                    </div>

                    {buyTicketActive && (
                      <Button
                        variant="enter"
                        size="lg"
                        className="rounded-full w-[100%]"
                        onClick={buyTicketHandler}
                        isLoading={isLoading}
                      >
                        Buy Ticket
                      </Button>
                    )}

                    {!buyTicketActive && (
                      <>
                        <Button
                          disabled
                          variant="enter"
                          size="lg"
                          className="rounded-full w-[100%]"
                          // onClick={buyTicketHandler}
                        >
                          Buy Ticket
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
    </>
  )
}

export default BuyTicket
