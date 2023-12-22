import React, { useEffect, useRef, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import {
  useAccount,
  useBalance,
  useEnsName,
  useContractRead,
  useContractReads,
  useContractWrite,
  useContractEvent,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { Button } from './button'
import Image from 'next/image'

import {
  defaultContractObj,
  tokenContractObj,
  LAST_MAN_STANDING_ADDRESS,
  AGOR_RELAYER_ADDRESS,
  TEAM_WALLET_ADDRESS,
} from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { formatNumber } from '@/lib/utils'
import { toast } from './use-toast'
import { ChefHat } from 'lucide-react'

export default function Admin() {
  const { isConnected } = useAccount()

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'round',
      },
      {
        ...defaultContractObj,
        functionName: 'phase',
      },
      {
        ...defaultContractObj,
        functionName: 'timeFlag',
      },
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [LAST_MAN_STANDING_ADDRESS as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'safehouseCostPerNight',
      },
      {
        ...defaultContractObj,
        functionName: 'tokensPerAttack',
      },
      {
        ...defaultContractObj,
        functionName: 'isAttackTime',
      },
      {
        ...defaultContractObj,
        functionName: 'randNumber',
      },
      {
        ...defaultContractObj,
        functionName: 'feePool',
      },
      {
        ...defaultContractObj,
        functionName: 'checkTimeLeft',
      },
    ],
    enabled: isConnected,
  })

  const round = Number(data?.[0]?.result || 0)
  const phase = Number(data?.[1]?.result || 0)
  const timeFlag = Number(data?.[2]?.result || 0)
  const balanceOf = data?.[3]?.result || BigInt(0)
  const safehouseCostPerNight = Number(data?.[4]?.result || 0)
  const tokensPerAttack = Number(data?.[5]?.result || 0)
  const isAttackTime = Number(data?.[6]?.result || 0)
  const randNumber = Number(data?.[7]?.result || 0)
  const feePool = data?.[8]?.result || BigInt(0)
  const checkTimeLeft = Number(data?.[9]?.result || BigInt(0))

  const tokensInContract = formatUnits(balanceOf, 18)
  const feesEarned = formatUnits(feePool, 18)

  const timeFlagInDate = new Date(timeFlag * 1000)

  type TimeLeftType = {
    // days: number;
    hours: number
    minutes: number
    seconds: number
  }

  const formatTime = (timeInSeconds: number): TimeLeftType => {
    let hours = Math.floor(timeInSeconds / 3600)
    let minutes = Math.floor((timeInSeconds % 3600) / 60)
    let seconds = Math.floor(timeInSeconds % 60)

    return {
      hours,
      minutes,
      seconds,
    }
  }

  useContractEvent({
    ...defaultContractObj,
    eventName: 'PhaseChange',
    listener: (event) => {
      const args = event[0]?.args
      const { caller, previousPhase, newPhase, time } = args
      refetch()
    },
  })

  /*-------------------- TEAM WALLET --------------------*/
  const { data: teamWalletData } = useBalance({
    address: TEAM_WALLET_ADDRESS,
  })

  /*-------------------- RELAYER --------------------*/
  const { data: relayerData } = useBalance({
    address: AGOR_RELAYER_ADDRESS,
  })

  /*-------------------- CHECK TIME LEFT --------------------*/

  // const {
  //   data: checkTimeLeftData,
  //   writeAsync: checkTimeLeft,
  //   isLoading: checkTimeLeftLoad,
  // } = useContractWrite({
  //   ...defaultContractObj,
  //   functionName: 'startGame',
  // })

  // const checkTime = async () => {
  //   try {
  //     const doStartGame = await startGame()

  //     const hash = doStartGame.hash
  //     toast({
  //       variant: 'success',
  //       title: 'Let the games begin',
  //       description: <p>Let the games begin</p>,
  //     })
  //   } catch (error: any) {
  //     console.log({ error })
  //     const errorMsg =
  //       error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'
  //     toast({
  //       variant: 'destructive',
  //       title: 'start fail',
  //       description: <p>{errorMsg}</p>,
  //     })
  //   }
  // }

  /*-------------------- START GAME --------------------*/

  const {
    data: startGameData,
    writeAsync: startGame,
    isLoading: startGameLoad,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'startGame',
  })

  const beginGame = async () => {
    try {
      const doStartGame = await startGame()

      const hash = doStartGame.hash
      toast({
        variant: 'success',
        title: 'Let the games begin',
        description: <p>Let the games begin</p>,
      })
    } catch (error: any) {
      console.log({ error })
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'
      toast({
        variant: 'destructive',
        title: 'start fail',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  /*-------------------- TRIGGER DRAIN --------------------*/

  const [drainRound, setDrainRound] = useState<string>('')

  const {
    data: triggerDrainData,
    writeAsync: triggerDrain,
    isLoading: triggerDrainLoad,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'triggerDrain',
  })

  const startDrainRound = async () => {
    try {
      const doTriggerDrain = await triggerDrain({
        args: [BigInt(drainRound)],
      })

      const hash = doTriggerDrain.hash
      setDrainRound('')
      // setApproved(true)
    } catch (error: any) {
      console.log({ error })
      setDrainRound('')
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Set Drain Round Fail',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: triggerDrainData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  /*-------------------- SAFEHOUSE PRICE --------------------*/

  const [safehousePrice, setSafehousePrice] = useState<string>('')

  const {
    data: adjustSafehouseCostData,
    writeAsync: adjustSafehouseCost,
    isLoading: adjustSafehouseCostLoad,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'adjustSafehouseCost',
  })

  const changePrice = async () => {
    try {
      const doAdjustCost = await adjustSafehouseCost({
        args: [BigInt(safehousePrice)],
      })

      const hash = doAdjustCost.hash
      setSafehousePrice('')
      // setApproved(true)
    } catch (error: any) {
      console.log({ error })
      setSafehousePrice('')
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Adjust Safehouse Cost failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: adjustSafehouseCostData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  /*-------------------- TOKEN EMISSION --------------------*/

  const [tokenEmission, setTokenEmission] = useState<string>('')

  const {
    data: adjustTokenEmissionData,
    writeAsync: adjustTokenEmission,
    isLoading: adjustTokenEmissionLoad,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'adjustTokenEmission',
  })

  const changeEmission = async () => {
    try {
      const doAdjustEmission = await adjustTokenEmission({
        args: [BigInt(tokenEmission)],
      })

      const hash = doAdjustEmission.hash
      setTokenEmission('')
      // setApproved(true)
    } catch (error: any) {
      console.log({ error })
      setTokenEmission('')
      const errorMsg =
        error?.cause?.reason || error?.cause?.shortMessage || 'Error, please try again!'

      toast({
        variant: 'destructive',
        title: 'Adjust Token Emission failed',
        description: <p>{errorMsg}</p>,
      })
    }
  }

  // update once txn is done
  const {} = useWaitForTransaction({
    hash: adjustTokenEmissionData?.hash,
    onSuccess(data) {
      if (data.status === 'success') {
        refetch()
      }
      console.log({ data })
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild className="shrink-0">
        {/* <p className="text-zinc-600 dark:text-zinc-200 whitespace-nowrap bg-transparent focus: outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-10 border rounded-xl px-4 py-2 text-md font-whitrabt">
          Admin
        </p> */}
        <div className="flex items-center border rounded-full px-2 sm:px-4 h-10 border-zinc-700 dark:border-zinc-200 hover:bg-zinc-400/50 hover:cursor-pointer">
          <Image
            priority
            src="/faces/duckface.png"
            height={25}
            width={25}
            alt="gamemaster-dashboard"
            className="shrink-0 mr-1"
          />
          {/* <ChefHat size={28} className="mr-1" /> */}
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">Game Master</DialogTitle>
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
                <div className="flex flex-col gap-4 justify-center items-center my-4">
                  <Button
                    onClick={beginGame}
                    variant="secondary"
                    className="w-full h-8 rounded-xl px-4 py-2 text-md font-whitrabt"
                  >
                    Start Game
                  </Button>
                </div>

                {/* Game */}
                <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 text-zinc-500 dark:text-zinc-400">
                  Game Info
                  <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">Time Flag</p>
                      <p className="text-right">
                        <p>
                          {timeFlagInDate.toDateString()} {timeFlagInDate.toLocaleTimeString()}
                        </p>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">Random Number</p>
                      <p className="text-right">{randNumber}</p>
                    </div>
                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">Time Left (in seconds)</p>
                      <p className="text-right">
                        <p>{checkTimeLeft}</p>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fund Management */}
                <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 justify-start text-zinc-500 dark:text-zinc-400">
                  Funds
                  <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">$LAST in contract</p>
                      <p className="text-right">
                        <p>
                          {formatNumber(tokensInContract, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">Relayer Funds</p>
                      <p className="text-right">
                        <p>
                          {formatNumber(relayerData?.formatted, {
                            maximumFractionDigits: 4,
                            minimumFractionDigits: 2,
                          })}{' '}
                          ETH
                        </p>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Wallet */}
                <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 justify-start text-zinc-500 dark:text-zinc-400">
                  Team Wallet
                  <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">Fees Earned</p>
                      <p className="text-right">
                        <p>
                          {formatNumber(feesEarned, {
                            maximumFractionDigits: 4,
                            minimumFractionDigits: 3,
                          })}{' '}
                          ETH
                        </p>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                      <p className="text-left">Amount in Wallet</p>
                      <p className="text-right">
                        <p>
                          {formatNumber(teamWalletData?.formatted, {
                            maximumFractionDigits: 4,
                            minimumFractionDigits: 3,
                          })}{' '}
                          ETH
                        </p>
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full h-8 px-4 py-2 my-2 text-xl"
                      onClick={changePrice}
                      isLoading={adjustSafehouseCostLoad}
                    >
                      Withdraw fees
                    </Button>
                  </div>
                </div>

                {/* <div className="grid grid-cols-2 gap-2">
                   <div className="w-[240px] mx-auto flex flex-col justify-center items-center text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 justify-start text-zinc-500 dark:text-zinc-400">
                    Check Time Left
                    <div className="rounded-lg text-lg flex flex-col justify-center items-center md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                      <Button
                        variant="secondary"
                        className="w-full h-8 px-4 py-2 text-xl"
                        onClick={checkTime}
                        isLoading={triggerDrainLoad}
                      >
                        Trigger Drain
                      </Button>
                    </div>
                  </div> */}

                <div className="w-[240px] mx-auto flex flex-col justify-center items-center text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 justify-start text-zinc-500 dark:text-zinc-400">
                  Trigger Drain
                  {/* <div className="w-[240px] flex flex-col justify-center items-center my-2"> */}
                  <div className="rounded-lg text-lg flex flex-col justify-center items-center md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                    <label htmlFor="triggerDrain">Set Stage 3 Round Number</label>
                    <input
                      type="text"
                      id="triggerDrain"
                      required
                      className="w-[6rem] rounded-md my-2 px-1 text-center border border-zinc-500 dark:border-zinc-400"
                      value={drainRound}
                      onChange={(e) => setDrainRound(e.target.value)}
                    />
                    <Button
                      variant="secondary"
                      className="w-full h-8 px-4 py-2 text-xl"
                      onClick={startDrainRound}
                      isLoading={triggerDrainLoad}
                    >
                      Trigger Drain
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 justify-start text-zinc-500 dark:text-zinc-400">
                    Safehouse Cost
                    <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                      <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                        <p className="text-left">Input</p>
                        <p className="text-right"> {safehouseCostPerNight}</p>
                      </div>
                      <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                        <p className="text-left">Price in tokens</p>
                        <p className="text-right"> {Number(safehouseCostPerNight) / 1000}</p>
                      </div>

                      <div className="flex flex-col justify-center items-center my-2">
                        <label htmlFor="adjustSafehousePrice">Change Safehouse Price</label>
                        <input
                          type="text"
                          id="adjustSafehousePrice"
                          required
                          className="w-[6rem] rounded-md border my-2 px-1 text-center border border-zinc-500 dark:border-zinc-400"
                          value={safehousePrice}
                          onChange={(e) => setSafehousePrice(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full h-8 px-4 py-2 text-xl"
                        onClick={changePrice}
                        isLoading={adjustSafehouseCostLoad}
                      >
                        Adjust Price
                      </Button>
                    </div>
                  </div>

                  {/* Token Emissions */}
                  <div className="text-lg md:text-xl lg:text-2xl whitespace-nowrap m-1 justify-start text-zinc-500 dark:text-zinc-400">
                    Token Emission
                    <div className="rounded-lg text-lg md:text-xl text-zinc-800 dark:text-zinc-200 p-2 border border-zinc-500 dark:border-zinc-400">
                      <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                        <p className="text-left">Input</p>
                        <p className="text-right"> {tokensPerAttack}</p>
                      </div>
                      <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
                        <p className="text-left">Emission in tokens</p>
                        <p className="text-right"> {tokensPerAttack / 1000}</p>
                      </div>
                      <div className="flex flex-col justify-center items-center my-2">
                        <label htmlFor="adjustTokenEmission">Change Token Emissions</label>
                        <input
                          type="text"
                          id="adjustTokenEmission"
                          required
                          className="w-[6rem] rounded-md border my-2 px-1 text-center border border-zinc-500 dark:border-zinc-400"
                          value={tokenEmission}
                          onChange={(e) => setTokenEmission(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full h-8 px-4 py-2 text-xl"
                        onClick={changeEmission}
                        isLoading={adjustTokenEmissionLoad}
                      >
                        Adjust Emission
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
