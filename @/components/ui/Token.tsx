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
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useSignMessage,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi'
import Image from 'next/image'
import { Split, AlertTriangle, ExternalLink } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import { formatNumber } from '@/lib/utils'
import { TOKEN_ADDRESS, tokenContractObj } from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

function Token() {
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [tokenValue, setTokenValue] = useState<string>('0')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [approved, setApproved] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const { address, isConnected } = useAccount()

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        ...tokenContractObj,
        functionName: 'allowance',
        args: [address as `0x${string}`, TOKEN_ADDRESS],
      },
    ],
  })

  const balance = data?.[0].result || BigInt(0)
  const allowance = data?.[1].result || BigInt(0)

  const tokenBalance = formatUnits(balance, 18)

  const { data: trfData, writeAsync: transfer } = useContractWrite({
    ...tokenContractObj,
    functionName: 'transfer',
  })

  const { writeAsync: approve } = useContractWrite({
    ...tokenContractObj,
    functionName: 'approve',
  })

  const {} = useWaitForTransaction({
    hash: trfData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  const approveToken = async () => {
    try {
      const doApprove = await approve({
        args: [
          '0xe6E5Ba2d06ba33882F563e0f75D64F8e89ced9Bb',
          BigInt('100000000000000000000000000000000'),
        ],
      })

      const hash = doApprove.hash
      setApproved(true)
    } catch (error) {
      console.log({ error })
    }
  }

  const transferToken = async () => {
    try {
      if (Number(tokenBalance) < Number(tokenValue)) {
        toast({
          variant: 'destructive',
          description: `You don't have enough tokens to transfer`,
        })
        return
      }

      if (!Number(tokenValue)) {
        toast({
          variant: 'destructive',
          description: `Amount must be greater than 0`,
        })
        return
      }

      if (!receiverAddress) {
        toast({
          variant: 'destructive',
          description: `Please enter a receiver address`,
        })
        return
      }

      const doTransfer = await transfer({
        args: [receiverAddress as `0x${string}`, parseUnits(tokenValue, 18)],
      })

      const hash = doTransfer.hash

      setIsModalOpen(false)

      updateCompletionModal({
        isOpen: true,
        state: 'sentTokens',
      })

      setTokenValue('')
      setReceiverAddress('')
    } catch (error) {
      console.log(error)
    }
  }

  //   if (isDisabled)
  //     return (
  //       <TooltipProvider delayDuration={10}>
  //         <Tooltip>
  //           <TooltipTrigger>
  //             <Button variant="splitPot" className="w-full text-xl" disabled>
  //               Split Pot
  //             </Button>
  //           </TooltipTrigger>
  //           <TooltipContent side="top" align="center">
  //             <div className="flex flex-row px-3 py-1 max-w-[240px] text-sm cursor-default">
  //               <AlertTriangle size={16} className="text-sm mr-1"></AlertTriangle>
  //               <span>
  //                 Players can only vote to split pot during the Day, and only after Stage 1.
  //               </span>
  //             </div>
  //           </TooltipContent>
  //         </Tooltip>
  //       </TooltipProvider>
  //     )

  return (
    <Dialog>
      <DialogTrigger asChild className="shrink-0">
        {/* Button to click on */}
        {/* <Button variant="splitPot" className="w-full text-xl">
          Split Pot
          <Split size={16} className="text-sm ml-1"></Split>
        </Button> */}

        <div className="flex items-center border border-transparent rounded-full px-2 sm:px-3 py-0 sm:py-1 hover:border-zinc-300 hover:bg-zinc-200/50 hover:cursor-pointer">
          <Image
            priority
            src="/logo/token.svg"
            height={30}
            width={30}
            alt="last token"
            className="shrink-0 mr-2"
          />

          <span className="text-lg sm:text-xl font-whitrabt">
            {formatNumber(tokenBalance, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">
              Buy or Transfer $LAST tokens
              {/* <div className="day-last">
                <span className="font-headline">Day</span> Action (Stage 2 and 3)
              </div> */}
            </DialogTitle>
            <ScrollArea className="h-[650px] md:h-[600px] rounded-md p-2">
              <DialogDescription className="w-[85%] mx-auto flex flex-col gap-3">
                <Image
                  priority
                  src="/lore/TokenImage.png"
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
                      <p>The pot is split once the votes cross the threshold.</p>
                      <p>You can change your mind and vote No later too.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">
                    Buy $LAST tokens, or transfer $LAST tokens to another in-game player
                  </p>
                </div>

                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  $LAST price info
                </div>

                <div className="w-[280px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">$LAST tokens in wallet</p>
                      <p className="text-right">
                        {' '}
                        {formatNumber(tokenBalance, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>

                    {/* <div className="flex text-lg justify-between gap-4">
                      <p className="text-left">$LAST price</p>
                      <p className="text-right"> 3 ETH </p>
                    </div> */}
                  </div>
                </div>
                {/* 2 columns */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 capitalize flex justify-start text-zinc-500 dark:text-zinc-400">
                      Buy $LAST
                    </div>
                    <a
                      href="https://app.uniswap.org/"
                      target="_blank"
                      rel="noreferrer"
                      className=""
                    >
                      <Button variant="primary" className="w-full text-xl">
                        Buy on Uniswap{' '}
                        <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
                      </Button>
                    </a>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 capitalize flex justify-start text-zinc-500 dark:text-zinc-400">
                      Transfer
                    </div>
                    <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                      <div className="flex md:flex-row flex-col justify-center items-center md:justify-between my-2">
                        <label htmlFor="player_address">Player #</label>

                        <div className="flex gap-1 items-center">
                          <input
                            type="text"
                            id="player_address"
                            className="w-[3rem] rounded-md border px-1 text-center border border-zinc-500 dark:border-zinc-400"
                            value={receiverAddress}
                            onChange={(e) => setReceiverAddress(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex md:flex-row flex-col justify-center items-center md:justify-between my-2">
                        <label htmlFor="token">Tokens</label>
                        <input
                          type="text"
                          id="token"
                          required
                          className="w-[3rem] rounded-md border px-1 text-center border border-zinc-500 dark:border-zinc-400"
                          value={tokenValue}
                          onChange={(e) => setTokenValue(e.target.value)}
                        />
                      </div>
                      {Number(allowance) <= Number(tokenValue) && (
                        <Button
                          variant="filter"
                          className="w-full h-8 px-4 mt-2 py-2 text-xl"
                          onClick={approveToken}
                        >
                          Approve {String(allowance)}
                        </Button>
                      )}

                      <Button
                        variant="filter"
                        disabled={Number(allowance) <= Number(tokenValue) && !approved}
                        className="w-full h-8 px-4 mt-2 py-2 text-xl"
                        onClick={transferToken}
                      >
                        Transfer
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Token
