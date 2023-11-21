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
import { useAccount, useContractWrite } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { parseUnits } from 'viem'
import { toast } from './use-toast'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import CustomConnectButton from './connect-button'

function BuyTicket() {
  const nextTicketPrice = useStoreState((state) => state.nextTicketPrice)
  const increaseInPrice = useStoreState((state) => state.increaseInPrice)
  const ticketsAvailableAtCurrentPrice = useStoreState(
    (state) => state.ticketsAvailableAtCurrentPrice,
  )
  const ticketsCounter = useStoreState((state) => state.ticketsCounter)
  const timeAddon = useStoreState((state) => state.timeAddon)

  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)
  const [buddyValue, setBuddyValue] = useState('')
  const { isConnected } = useAccount()

  // const phase = useStoreState((state) => state.phase)
  // const [value, setValue] = useState(0)

  const nextTicketPriceConverted = nextTicketPrice / tokenConversion

  const ticketsLeft = ticketsAvailableAtCurrentPrice - ticketsCounter + 1

  const nextPrice = (nextTicketPrice + increaseInPrice) / tokenConversion

  const { writeAsync } = useContractWrite({
    ...defaultContractObj,
    functionName: 'buyTicket',
    value: parseUnits(String(nextTicketPriceConverted), 18),
  })

  const buyTicketHandler = async () => {
    try {
      const nextPrice = parseUnits(String(nextTicketPriceConverted), 18)

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
      {isConnected ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="enter"
              className="rounded-full px-1 py-1 leading-10 h-12 w-full mt-4 text-2xl"
            >
              Buy for{' '}
              {formatNumber(nextTicketPriceConverted, {
                maximumFractionDigits: 3,
                minimumFractionDigits: 3,
              })}{' '}
              ETH
            </Button>
          </DialogTrigger>

          <DialogContent>
            <div className="overflow-auto">
              <DialogHeader className="items-center">
                <DialogTitle className="w-[85%] mx-auto flex justify-between p-2 text-xl sm:text-2xl md:text-3xl items-center text-center font-normal">
                  Enter game
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
                      // layout="fill"
                      // objectFit='cover'
                      className="place-self-center rounded-xl"
                      height={400}
                      width={650}
                      alt="enter-into-the-pepe"
                    />

                    <div className="w-[100%] text-base sm:text-lg md:text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                      <p className="mb-2">Entry price increases as more players join.</p>
                      {/* <p className="mb-2">Price is split to wallet, pot and treasury (30,60,10).</p> */}
                      <p className="mb-2">Players can no longer join the game once it begins.</p>
                      <p className="mb-2">
                        Enter a buddy # to receive a $LAST farming boost when either of you attack
                        another player.
                      </p>
                    </div>

                    {/* Pay for stay */}
                    <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                      Join us?
                    </div>

                    <div className="w-[240px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                      <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                        <div className="flex text-lg justify-between gap-4">
                          <p className="text-left">Current ticket price</p>
                          <p className="text-right"> {nextTicketPriceConverted} ETH </p>
                        </div>

                        <div className="flex text-lg justify-between gap-4">
                          <p className="text-left">Tickets left at this price </p>
                          <p className="text-right"> {ticketsLeft} </p>
                        </div>

                        <div className="flex text-lg justify-between gap-4">
                          <p className="text-left">Next ticket price</p>
                          <p className="text-right"> {nextPrice} ETH </p>
                        </div>

                        <div className="flex text-lg justify-between gap-4">
                          <p className="text-left">Time add on per joiner </p>
                          <p className="text-right"> {timeAddon} secs </p>
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
                      <Button
                        disabled={isDisabled}
                        variant="enter"
                        size="lg"
                        className="rounded-full w-[100%]"
                        onClick={buyTicketHandler}
                      >
                        Buy Ticket
                      </Button>

                      {isDisabled && <Prompt />}
                    </div>
                  </DialogDescription>
                </ScrollArea>
              </DialogHeader>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="mx-auto flex justify-center mt-2">
          <CustomConnectButton />
        </div>
      )}
    </>
  )
}

export default BuyTicket
