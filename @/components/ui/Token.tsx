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
  useContractEvent,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import Image from 'next/image'
import { Split, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import { formatNumber } from '@/lib/utils'
import {
  TOKEN_ADDRESS,
  LAST_MAN_STANDING_ADDRESS,
  defaultContractObj,
  tokenContractObj,
  LIQUIDITY_POOL,
} from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

function Token() {
  // const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const triggerCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  // const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [receiverId, setReceiverId] = useState<string>('')

  const [approveValue, setApproveValue] = useState<string>('')
  const [tokenValue, setTokenValue] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [approved, setApproved] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  // Address read
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
        args: [address as `0x${string}`, LAST_MAN_STANDING_ADDRESS],
      },
      {
        ...defaultContractObj,
        functionName: 'playerTicket',
        args: [(address || '') as `0x${string}`],
      },
    ],
  })

  // assign to variables
  const balanceOf = data?.[0].result || BigInt(0)
  const allowance = data?.[1].result || BigInt(0)
  const playerTicket = data?.[2].result || null

  // reduces it by 18 decimals
  const tokenBalance = formatUnits(balanceOf, 18)
  const allowanceBalance = formatUnits(allowance, 18)
  let ticketId = playerTicket?.[0] || 0

  // receiver of tokens
  useContractEvent({
    ...defaultContractObj,
    eventName: 'TokensTransferred',
    listener: (event) => {
      const args = event[0]?.args
      const { caller, recipient, amount, time } = args
      console.log(recipient)

      if (recipient === ticketId) {
        triggerCompletionModal({
          isOpen: true,
          state: 'receivedTokens',
        })
        refetch()
      }
      console.log({ args })
    },
  })

  // Contract write
  const {
    data: transferData,
    writeAsync: transferTokens,
    isLoading: transferLoad,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'transferTokens',
  })

  const {
    data: approveData,
    writeAsync: approve,
    isLoading: approveLoad,
  } = useContractWrite({
    ...tokenContractObj,
    functionName: 'approve',
  })

  const {} = useWaitForTransaction({
    hash: transferData?.hash || approveData?.hash,
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
        args: [LAST_MAN_STANDING_ADDRESS, parseUnits(approveValue, 18)],
      })

      const hash = doApprove.hash
      setApproveValue('')
      // setApproved(true)
    } catch (error: any) {
      console.log({ error })
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Approve failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
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

      if (!Number(receiverId)) {
        toast({
          variant: 'destructive',
          description: `Please enter the player id to send tokens to`,
        })
        return
      }

      const doTransfer = await transferTokens({
        args: [BigInt(receiverId), parseUnits(tokenValue, 18)],
      })

      const hash = doTransfer.hash

      setIsModalOpen(false)

      triggerCompletionModal({
        isOpen: true,
        state: 'sentTokens',
      })

      setTokenValue('')
      setReceiverId('')
    } catch (error: any) {
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Transfer failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="shrink-0">
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
                <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                  <p className="mb-2">
                    Buy $LAST tokens, or transfer $LAST tokens to another in-game player
                  </p>
                </div>

                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  $LAST info
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

                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">Tokens allowance left</p>
                      <p className="text-right">
                        {' '}
                        {formatNumber(allowanceBalance, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>

                    <div className="flex text-lg justify-center mt-2">
                      <a href={LIQUIDITY_POOL} target="_blank" rel="noreferrer" className="">
                        <Button variant="primary" className="w-full text-xl">
                          Buy on Uniswap{' '}
                          <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-xl md:text-2xl lg:text-3xl m-1 capitalize flex justify-center text-zinc-500 dark:text-zinc-400">
                  Send $LAST to player
                </div>

                {/* 2 columns */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                  <div>
                    {/* Approve */}
                    <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 flex justify-start text-zinc-500 dark:text-zinc-400">
                      Approve
                      <TooltipProvider delayDuration={10}>
                        <Tooltip>
                          <TooltipTrigger className="ml-1">
                            {' '}
                            <HelpCircle />
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p className="px-3 py-1.5 max-w-[240px] cursor-default whitespace-normal text-sm">
                              Set an allowance so that the game can send $LAST on your behalf to the
                              player{' '}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                      <div className="flex flex-col justify-center items-center my-2">
                        <label htmlFor="approve">Set Approval Amount</label>
                        <input
                          type="text"
                          id="approve"
                          required
                          className="w-[6rem] rounded-md border my-2 px-1 text-center border border-zinc-500 dark:border-zinc-400"
                          value={approveValue}
                          onChange={(e) => setApproveValue(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="filter"
                        className="w-full h-8 px-4 py-2 text-xl"
                        onClick={approveToken}
                        isLoading={approveLoad}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 capitalize flex justify-start text-zinc-500 dark:text-zinc-400">
                      Transfer
                    </div>
                    <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                      <div className="flex md:flex-row flex-col justify-center items-center md:justify-between my-2">
                        <label htmlFor="player_id">Player #</label>

                        <div className="flex gap-1 items-center">
                          <input
                            type="text"
                            id="player_id"
                            className="w-[3rem] rounded-md border px-1 text-center border border-zinc-500 dark:border-zinc-400"
                            value={receiverId}
                            onChange={(e) => setReceiverId(e.target.value)}
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
                      <Button
                        variant="exit"
                        disabled={Number(allowance) <= Number(tokenValue)}
                        className="w-full h-8 px-4 mt-2 py-2 text-xl"
                        isLoading={transferLoad}
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
