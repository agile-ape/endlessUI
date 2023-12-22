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
  useEnsName,
  useEnsAvatar,
  useContractRead,
  useContractReads,
  useContractWrite,
  useContractEvent,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import Image from 'next/image'
import { Split, AlertTriangle, ExternalLink, HelpCircle, User } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import { formatAddress, formatNumber, cn } from '@/lib/utils'
import {
  TOKEN_ADDRESS,
  LAST_MAN_STANDING_ADDRESS,
  defaultContractObj,
  tokenContractObj,
  BLOCK_EXPLORER,
  LIQUIDITY_POOL,
  DOCS_URL,
} from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

import { usePrivy, useLogin, useLogout, useWallets, useConnectWallet } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'

import { connect } from 'http2'

function Dashboard() {
  // Address read
  const { address, isConnected } = useAccount()

  const { ready, authenticated, user, createWallet, setWalletPassword, exportWallet } = usePrivy()
  const { wallets } = useWallets()
  console.log(wallets)

  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()

  const wallet = wallets.find((wallet) => wallet.address === address)

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy')
  const embeddedWalletAddress = embeddedWallet?.address

  const connector = user?.wallet?.connectorType
  let connectorType: string

  if (connector === 'embedded') {
    connectorType = 'embedded'
  } else {
    connectorType = 'external'
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  const setPasswordHandler = async () => {
    try {
      await setWalletPassword()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <p>{error.message}</p>,
      })
    }
  }

  const exportKeyHandler = async () => {
    try {
      await exportWallet()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <p>{error.message}</p>,
      })
    }
  }

  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User logged out')
      toast({
        variant: 'destructive',
        // title: 'Keyword updated',
        description: <p>You are logged out.</p>,
      })
    },
  })

  const { login } = useLogin({
    onComplete: () => {
      console.log('User logged in')
      toast({
        variant: 'success',
        // title: 'Keyword updated',
        description: <p>You are logged in.</p>,
      })
    },
  })

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  })

  console.log(ensName)
  console.log(ensAvatar)

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...tokenContractObj,
        functionName: 'playCount',
        args: [address as `0x${string}`],
      },
      {
        ...tokenContractObj,
        functionName: 'sideQuestCount',
        args: [address as `0x${string}`],
      },
    ],
  })

  // assign to variables
  const playCount = data?.[0].result || BigInt(0)
  const sideQuestCount = data?.[1].result || BigInt(0)

  // potential to add game stats
  return (
    <Dialog>
      <DialogTrigger asChild className="shrink-0">
        <div className="flex items-center border rounded-full px-2 sm:px-3 py-0 sm:py-1 border-zinc-700 dark:border-zinc-200 hover:bg-zinc-400/50 hover:cursor-pointer">
          <Image
            priority
            src="/faces/stare.png"
            height={25}
            width={25}
            alt="player-dashboard"
            className="shrink-0 mr-1"
          />
          <User size={28} className="mr-1" />
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">Player Dashboard</DialogTitle>
            <ScrollArea className="h-[450px] md:h-[650px] rounded-md p-2">
              {/* <DialogDescription className="w-[100%] mx-auto flex flex-col gap-3"> */}
              <div className="text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[85%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex justify-center rounded-full p-2">
                      <Image
                        priority
                        src={'/lore/EnterGame.png'}
                        className="place-self-center"
                        height={400}
                        width={650}
                        alt="enter-into-the-pepe"
                      />
                    </div>
                    <div className="">
                      <Accordion type="multiple">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <div className="flex text-lg justify-between gap-4 text-lg">
                              <p className="text-left">Wallet:</p>
                              <p className="text-right">
                                <a
                                  href={`${BLOCK_EXPLORER}address/${activeWallet?.address}`}
                                  target="_blank"
                                >
                                  {ensName ? ensName : formatAddress(String(activeWallet?.address))}
                                </a>
                              </p>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="gap-1">
                            <div className="text-xl text-center text-zinc-500 dark:text-zinc-400">
                              Select Wallet
                            </div>
                            <ul className="flex flex-col lg:flex-row gap-2 justify-center items-center">
                              {wallets.map((wallet) => (
                                <li key={wallet.address}>
                                  <Button
                                    // variant="wallet"
                                    className={cn(
                                      'flex justify-center items-center border border-slate-950 gap-4 p-2 rounded-sm',
                                      activeWallet?.address === wallet.address
                                        ? 'text-white bg-slate-500 disabled:cursor-not-allowed disabled:pointer-events-none'
                                        : 'text-black bg-slate-100 hover:bg-slate-300',
                                    )}
                                    onClick={() => setActiveWallet(wallet)}
                                  >
                                    <span className="text-lg">
                                      {formatAddress(String(wallet.address))}
                                    </span>
                                    <span
                                      className={cn(
                                        'text-sm border border-black px-1 rounded-sm',
                                        activeWallet?.address === wallet.address
                                          ? ' text-white bg-slate-700 border border-white'
                                          : '',
                                      )}
                                    >
                                      {wallet.connectorType === 'embedded'
                                        ? 'embedded'
                                        : 'external'}
                                    </span>
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex text-lg justify-between gap-4 text-lg">
                        <p className="text-left">Chain</p>
                        <p className="text-right">{wallet?.chainId}</p>
                      </div>

                      <div className="flex text-lg justify-between gap-4 text-lg">
                        <p className="text-left">Game play count</p>
                        <p className="text-right">{Number(playCount)}</p>
                      </div>

                      <div className="flex text-lg justify-between gap-4 text-lg">
                        <p className="text-left">Side quest count</p>
                        <p className="text-right">{Number(sideQuestCount)}</p>
                      </div>
                      <a
                        href={DOCS_URL}
                        target="_blank"
                        className="link text-xs sm:text-sm md:text-base leading-tight"
                      >
                        Learn more
                      </a>

                      <Accordion type="multiple">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            <div className="text-xl text-zinc-500 dark:text-zinc-400 my-1 flex justify-start">
                              Embedded Wallet
                              <TooltipProvider delayDuration={10}>
                                <Tooltip>
                                  <TooltipTrigger className="ml-1">
                                    {' '}
                                    <HelpCircle />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" align="center">
                                    <p className="px-3 py-1.5 max-w-[240px] cursor-default whitespace-normal text-sm">
                                      An embedded wallet is automatically created for you if you do
                                      not have a wallet during login. You can also create an
                                      embedded wallet if you use an external wallet.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between gap-4 text-lg">
                                <p className="text-left">Create wallet</p>

                                {embeddedWallet && (
                                  <p className="text-right text-zinc-500 dark:text-zinc-400">
                                    {' '}
                                    You already have one{' '}
                                  </p>
                                )}
                                {!embeddedWallet && (
                                  <Button
                                    variant="primary"
                                    className="w-24 h-8 rounded-xl px-4 text-lg"
                                    disabled={
                                      !(ready && authenticated) || Boolean(embeddedWalletAddress)
                                    }
                                    onClick={createWallet}
                                  >
                                    Create
                                  </Button>
                                )}
                              </div>

                              <div className="flex justify-between gap-4 text-lg">
                                <p className="text-left">Set password</p>
                                <p className="text-right">
                                  {!embeddedWallet && (
                                    <p className="text-right text-zinc-500 dark:text-zinc-400">
                                      {' '}
                                      No embedded wallet{' '}
                                    </p>
                                  )}
                                  {embeddedWallet && (
                                    <Button
                                      variant="primary"
                                      className="w-24 h-8 rounded-xl px-4 text-lg"
                                      disabled={!(ready && authenticated)}
                                      onClick={setPasswordHandler}
                                    >
                                      Set
                                    </Button>
                                  )}
                                </p>
                              </div>

                              <div className="flex justify-between gap-4 text-lg">
                                <p className="text-left">Export key</p>
                                <p className="text-right">
                                  {!embeddedWallet && (
                                    <p className="text-right text-zinc-500 dark:text-zinc-400">
                                      {' '}
                                      No embedded wallet{' '}
                                    </p>
                                  )}
                                  {embeddedWallet && (
                                    <Button
                                      variant="primary"
                                      className="w-24 h-8 rounded-xl px-4 text-lg"
                                      disabled={!(ready && authenticated)}
                                      onClick={exportKeyHandler}
                                    >
                                      Export
                                    </Button>
                                  )}
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="flex flex-col gap-4 justify-center items-center my-4">
                        {authenticated ? (
                          <>
                            <Button
                              onClick={logout}
                              variant="secondary"
                              className="w-48 h-10 rounded-xl px-4 py-2 text-md font-whitrabt"
                            >
                              Log Out
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={login}
                            variant="secondary"
                            className="w-48 h-10 rounded-xl px-4 py-2 text-md font-whitrabt"
                          >
                            Log In
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* </DialogDescription> */}
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Dashboard
