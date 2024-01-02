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
import { Split, AlertTriangle, ExternalLink, HelpCircle, User, Copy } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import { formatAddress, formatNumber, cn, copyToClipboard } from '@/lib/utils'
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
import { useWindowSize } from '../../../hooks/useWindowSize'

import { connect } from 'http2'

export default function DashboardNew() {
  // Address read
  const { address, isConnected } = useAccount()
  const { xs } = useWindowSize()

  const { ready, authenticated, user, createWallet, setWalletPassword, exportWallet } = usePrivy()
  const { wallets } = useWallets()

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
      setIsModalOpen(false)
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
      setIsModalOpen(false)
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

  function copyAddress() {
    copyToClipboard(activeWallet?.address || '')
    toast({
      variant: 'success',
      title: 'Address copied',
      description: 'Address copied to clipboard',
    })
  }

  // potential to add game stats
  return (
    <div className="w-[85%] mx-auto flex flex-col mb-16 body-last">
      <div className="hidden sm:block flex flex-col">
        <div className="flex items-center justify-center gap-2 my-2">
          <>
            <Image
              priority
              src="/lore/EnterGame.png"
              className="place-self-center rounded-xl"
              height={400}
              width={650}
              alt="enter-into-the-pepe"
            />
          </>
        </div>
      </div>
      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
      >
        <div className="m-1 capitalize text-center h2-last">Player Info</div>
        <div className="flex justify-between gap-4 mt-2">
          <p className="text-left">Address:</p>
          <p className="text-right flex justify-center items-center gap-2">
            <span>
              <a href={`${BLOCK_EXPLORER}address/${activeWallet?.address}`} target="_blank">
                {formatAddress(String(activeWallet?.address))}
              </a>
            </span>
            <span onClick={copyAddress}>
              <Copy size={18} />
            </span>
          </p>
        </div>
        <div className="">
          {/* <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="h2-last text-center">Select Wallet</div>
            </AccordionTrigger>
            <AccordionContent className="gap-1">
              <ul className="flex flex-col lg:flex-row gap-2 justify-center items-center">
                {wallets.map((wallet) => (
                  <li key={wallet.address}>
                    <Button
                      className={cn(
                        'flex justify-center items-center border border-indigo-950 gap-4 p-2 rounded-sm',
                        activeWallet?.address === wallet.address
                          ? 'text-black bg-violet-300 disabled:cursor-not-allowed disabled:pointer-events-none'
                          : 'text-black bg-slate-100 hover:bg-slate-300',
                      )}
                      onClick={() => setActiveWallet(wallet)}
                    >
                      <span className="text-lg">{formatAddress(String(wallet.address))}</span>
                      <span
                        className={cn(
                          'text-sm border border-black px-1 rounded-sm',
                          activeWallet?.address === wallet.address
                            ? ' text-white bg-violet-600 border border-white'
                            : '',
                        )}
                      >
                        {wallet.connectorType === 'embedded' ? 'embedded' : 'external'}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}

          <div className="flex justify-between gap-4">
            <p>Wallet type</p>
            <p>{wallet?.connectorType === 'Embedded' ? 'Embedded' : 'External'}</p>
          </div>

          <div className="flex justify-between gap-4">
            <p>Current Chain</p>
            <p>{wallet?.chainId}</p>
          </div>

          <div className="flex justify-between gap-4">
            <p>Game play count</p>
            <p>{Number(playCount)}</p>
          </div>

          <div className="flex justify-between gap-4">
            <p>Side quest count</p>
            <p>{Number(sideQuestCount)}</p>
          </div>
          <a href={DOCS_URL} target="_blank" className="link h6-last flex justify-start">
            Learn more
          </a>

          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="h3-last text-center my-1 flex justify-start">
                  Embedded Wallet
                  {!xs && (
                    <TooltipProvider delayDuration={10}>
                      <Tooltip>
                        <TooltipTrigger className="ml-1">
                          {' '}
                          <HelpCircle />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          <p className="px-3 py-1.5 max-w-[240px] cursor-default whitespace-normal text-sm">
                            An embedded wallet is automatically created for you if you do not have a
                            wallet during login. You can also create an embedded wallet if you use
                            an external wallet.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 body-last">
                  <div className="flex justify-between gap-4">
                    <p className="text-left">Create wallet</p>

                    {wallet && <p className=""> You already have one </p>}
                    {!wallet && (
                      <Button
                        variant="wallet"
                        className="w-24 h-8 rounded-xl px-4"
                        disabled={!(ready && authenticated) || Boolean(embeddedWalletAddress)}
                        onClick={createWallet}
                      >
                        Create
                      </Button>
                    )}
                  </div>

                  <div className="flex justify-between gap-4 ">
                    <p className="">Set password</p>
                    <p className="">
                      {!embeddedWallet && <p className=""> No embedded wallet </p>}
                      {embeddedWallet && (
                        <Button
                          variant="wallet"
                          className="w-24 h-8 rounded-xl px-4"
                          disabled={!(ready && authenticated)}
                          onClick={setPasswordHandler}
                        >
                          Set
                        </Button>
                      )}
                    </p>
                  </div>

                  <div className="flex justify-between gap-4 ">
                    <p className="">Export key</p>
                    <p className="">
                      {!embeddedWallet && <p className=""> No embedded wallet </p>}
                      {embeddedWallet && (
                        <Button
                          variant="wallet"
                          className="w-24 h-8 rounded-xl px-4"
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
                  variant={xs ? 'primary' : 'secondary'}
                  className="w-48 h-10 rounded-xl px-4 py-2 text-md font-whitrabt"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Button
                onClick={login}
                variant={xs ? 'primary' : 'secondary'}
                className="w-48 h-10 rounded-xl px-4 py-2 text-md font-whitrabt"
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
