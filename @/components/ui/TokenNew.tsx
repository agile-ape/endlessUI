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
import { Button } from './button'
import {
  useAccount,
  useEnsName,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import Image from 'next/image'
import { Split, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import { formatAddress, formatNumber } from '@/lib/utils'
import {
  TOKEN_ADDRESS,
  GAME_ADDRESS,
  defaultContractObj,
  tokenContractObj,
  BLOCK_EXPLORER,
  LIQUIDITY_POOL,
  WEBSOCKET_ENDPOINT,
  TOKEN_IMG,
  TOKEN_MOBILE_IMG,
  CHAIN_ID,
} from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { toast } from './use-toast'
import { useSocketEvents, type Event } from '../../../hooks/useSocketEvents'
function TokenNew() {
  // Address read
  const { address, isConnected } = useAccount()
  const ownedTicket = useStoreState((state) => state.ownedTicket)
  const updateCompletionModal = useStoreActions((actions) => actions.updateTriggerCompletionModal)
  const [receiverId, setReceiverId] = useState<string>('')
  const [approveValue, setApproveValue] = useState<string>('')
  const [tokenValue, setTokenValue] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        args: [address as `0x${string}`, GAME_ADDRESS],
      },
      //   {
      //     ...tokenContractObj,
      //     functionName: 'playCount',
      //     args: [address as `0x${string}`],
      //   },
      //   {
      //     ...defaultContractObj,
      //     functionName: 'playerTicket',
      //     args: [(address || '') as `0x${string}`],
      //   },
    ],
  })

  // assign to variables
  //   const playCount = data?.[2].result || BigInt(0)
  //   const playerTicket = data?.[3].result || null

  // reduces it by 18 decimals
  //   let playerId = playerTicket?.[0] || 0

  const balanceOf = data?.[0].result || BigInt(0)
  const allowance = data?.[1].result || BigInt(0)
  const tokenBalance = formatUnits(balanceOf, 18)
  const allowanceBalance = formatUnits(allowance, 18)
  const playerId = ownedTicket?.id || 0

  const events: Event[] = [
    {
      name: `events-${CHAIN_ID}`,
      handler(data) {
        const { event, dataJson } = data

        if (!Object.keys(dataJson).length) return

        if (event === 'TokensTransferred') {
          const { caller, recipient, amount, time } = dataJson

          if (recipient === playerId) {
            updateCompletionModal({
              isOpen: true,
              state: 'receivedTokens',
            })
            refetch()
          }
        }
      },
    },
  ]

  useSocketEvents(events)

  // Contract write
  /*---------------------- approve ----------------------*/
  const {
    data: approveData,
    writeAsync: approve,
    isLoading: approveLoad,
  } = useContractWrite({
    ...tokenContractObj,
    functionName: 'approve',
  })

  const approveToken = async () => {
    try {
      const doApprove = await approve({
        args: [GAME_ADDRESS, parseUnits(approveValue, 18)],
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
        description: <p>{errorMsg}</p>,
      })
    }
  }

  /*---------------------- send ----------------------*/
  const {
    data: transferData,
    writeAsync: transferTokens,
    isLoading: transferLoad,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'transferTokens',
  })

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

      updateCompletionModal({
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
        description: <p>{errorMsg}</p>,
      })
    }
  }

  /*---------------------- approve or send ----------------------*/

  const {} = useWaitForTransaction({
    hash: transferData?.hash || approveData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  function resetState() {
    setApproveValue('')
    setTokenValue('')
    setReceiverId('')
  }

  const tokenBackupImg = (event: any) => {
    event.target.src = '/lore/Token.png'
  }

  const tokenMobileBackupImg = (event: any) => {
    event.target.src = '/lore/TokenMobile.png'
  }

  return (
    <div className="w-[85%] mx-auto flex flex-col gap-3 mb-8 body-last">
      <div className="sm:hidden block flex flex-col">
        {/* <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h1-last text-center">Send Tokens</div>
        </div> */}
        <Image
          priority
          src={TOKEN_MOBILE_IMG}
          unoptimized
          className="place-self-center rounded-xl"
          height={400}
          width={650}
          alt="send-tokens"
          onError={tokenMobileBackupImg}
        />
      </div>
      <Image
        priority
        src={TOKEN_IMG}
        unoptimized
        className="hidden sm:block place-self-center rounded-xl"
        height={400}
        width={650}
        alt="send-tokens"
        onError={tokenBackupImg}
      />

      <div className="text-center">
        <p className="mb-2">Buy $LAST.</p>
        <p className="mb-2">Or send $LAST to players.</p>
        <p className="mb-2">Approve, then send via player #.</p>
      </div>

      <div className="flex text-lg justify-center my-2">
        <a href={LIQUIDITY_POOL} target="_blank" rel="noreferrer" className="">
          <Button variant="primary" className="w-full text-xl rounded-full">
            Buy $LAST tokens <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
          </Button>
        </a>
      </div>

      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
      >
        <div className="m-1 capitalize text-center h2-last">Feeling generous?</div>
        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div className="">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">$LAST holdings</p>
              <p className="text-right">
                {' '}
                {formatNumber(tokenBalance, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Allowance left</p>
              <p className="text-right">
                {' '}
                {formatNumber(allowanceBalance, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
          <div>
            {/* Approve */}
            <div className="whitespace-nowrap m-1 capitalize flex justify-start h3-last">
              Approve
              <TooltipProvider delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger className="ml-1">
                    {' '}
                    <HelpCircle />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <p className="px-3 py-1.5 max-w-[240px] cursor-default whitespace-normal text-sm">
                      Set an allowance amount for the game to send $LAST to another player for you{' '}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="rounded-lg p-2 px-4 border border-zinc-500 dark:border-zinc-400 body-last">
              <div className="flex flex-col justify-center items-center my-2">
                <label htmlFor="approve">Set Approval Amount</label>
                <input
                  type="text"
                  id="approve"
                  required
                  className="w-[6rem] text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-md my-2 px-1"
                  value={approveValue}
                  onChange={(e) => setApproveValue(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-[100%] rounded-full"
                onClick={approveToken}
                isLoading={approveLoad}
              >
                Approve
              </Button>
            </div>
          </div>
          <div>
            <div className="whitespace-nowrap m-1 capitalize flex justify-start h3-last">Send</div>
            <div className="rounded-lg p-2 border border-zinc-500 dark:border-zinc-400 body-last">
              <div className="flex md:flex-row flex-col justify-center items-center md:justify-between my-2">
                <label htmlFor="player_id">Player #</label>

                <div className="flex gap-1 items-center">
                  <input
                    type="text"
                    id="player_id"
                    className="w-[4rem] text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-md my-2 px-1"
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
                  className="w-[4rem] text-center text-4xl text-zinc-800 dark:text-zinc-200 border-[2px] border-slate-400 bg-slate-100 dark:bg-slate-700 rounded-md my-2 px-1"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                disabled={Number(allowance) <= Number(tokenValue)}
                size="md"
                className="w-[100%] rounded-full"
                onClick={transferToken}
                isLoading={transferLoad}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenNew
