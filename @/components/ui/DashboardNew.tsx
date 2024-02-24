import React, { useEffect, useRef, useState } from 'react'
import type { MouseEventHandler, FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from './button'
import {
  useAccount,
  useBalance,
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
import {
  Split,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  User,
  RefreshCcw,
  Copy,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import {
  formatAddress,
  formatShortAddress,
  formatNumber,
  cn,
  copyToClipboard,
  findChainName,
} from '@/lib/utils'
import {
  TOKEN_ADDRESS,
  GAME_ADDRESS,
  defaultContractObj,
  tokenContractObj,
  BLOCK_EXPLORER,
  LIQUIDITY_POOL,
  DOCS_URL,
  DASHBOARD_IMG,
  DASHBOARD_MOBILE_IMG,
  CHAIN_ID,
  TOKEN_NAME,
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

  // 'wallet', 'sms', 'email', 'google', 'twitter'

  const loginMethod = user?.linkedAccounts[1]?.type
  let username: any
  let loginAccount

  if (loginMethod === 'email') {
    username = user?.linkedAccounts[1].address
    loginAccount = 'Email'
  } else if (loginMethod === 'phone') {
    username = user?.linkedAccounts[1].number
    loginAccount = 'Phone'
  } else if (loginMethod === 'google_oauth') {
    username = user?.linkedAccounts[1].email
    loginAccount = 'Google'
  } else if (loginMethod === 'twitter_oauth') {
    username = user?.linkedAccounts[1].username
    loginAccount = 'Twitter'
  } else if (loginMethod === 'wallet') {
    username = formatAddress(String(user?.linkedAccounts[1].address))
    loginAccount = 'Web3 Wallet'
  }

  const { wallets } = useWallets()
  // search for embedded wallet and pull address
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy')

  const setToDefaultChain = async () => {
    await embeddedWallet?.switchChain(CHAIN_ID)
  }

  const embeddedWalletAddress = embeddedWallet?.address
  const embeddedWalletChain = embeddedWallet?.chainId || null
  const chainWithoutPrefix = embeddedWalletChain
    ? Number(embeddedWalletChain.replace(/^eip155:/i, ''))
    : null

  // const chainName = chainWithoutPrefix ? findChainName(chainWithoutPrefix).then : null
  // console.log(chainName)

  const [chainName, setChainName] = useState('')
  useEffect(() => {
    setToDefaultChain()
    if (chainWithoutPrefix !== null) {
      findChainName(chainWithoutPrefix)
        .then((result) => {
          setChainName(result)
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      console.error('embeddedWalletChain is undefined or null')
    }
  }, [chainWithoutPrefix, chainName])

  // const wallet = wallets.find((wallet) => wallet.address === address)

  // link to Wagmi hooks
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
  setActiveWallet(embeddedWallet)

  // const connector = user?.wallet?.connectorType
  // let connectorType: string

  // if (connector === 'embedded') {
  //   connectorType = 'embedded'
  // } else {
  //   connectorType = 'external'
  // }

  // console.log(connectorType)
  // console.log(embeddedWallet)

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

  /* remove ENS integration
  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  })
  */

  const { data: balanceData, refetch: refetchETH } = useBalance({
    address: address,
  })

  const ethBalance = formatUnits(balanceData?.value || BigInt(0), 18)

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
      {
        ...tokenContractObj,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        ...defaultContractObj,
        functionName: 'randNumber',
      },
    ],
  })

  // assign to variables
  const playCount = data?.[0].result || BigInt(0)
  const sideQuestCount = data?.[1].result || BigInt(0)
  const balanceOf = data?.[2].result || BigInt(0)
  const randNumber = Number(data?.[3].result || 0)
  const tokenBalance = formatUnits(balanceOf, 18)

  function copyAddress() {
    copyToClipboard(embeddedWallet?.address || '')
    toast({
      variant: 'success',
      title: 'Address copied',
      description: 'Address copied to clipboard',
    })
  }

  function copyUsername() {
    copyToClipboard(username)
    toast({
      variant: 'success',
      title: 'Username copied',
      description: 'Username copied to clipboard',
    })
  }

  const dashboardBackupImg = (event: any) => {
    event.target.src = '/lore/Dashboard.png'
  }

  const dashboardMobileBackupImg = (event: any) => {
    event.target.src = '/lore/DashboardMobile.png'
  }

  const refetchETHHandler: MouseEventHandler<HTMLButtonElement> = async (event) => {
    refetchETH()
  }

  // console.log(typeof loginMethod)

  // potential to add game stats
  return (
    <div className="w-[85%] mx-auto flex flex-col mb-8 body-last">
      <div className="hidden sm:block flex flex-col">
        <div className="flex items-center justify-center gap-2 my-2">
          <>
            <Image
              priority
              src={DASHBOARD_IMG}
              unoptimized
              className="place-self-center rounded-xl"
              height={400}
              width={650}
              alt="dashboard"
              onError={dashboardBackupImg}
            />
          </>
        </div>
      </div>
      <div
        className="w-[100%] rounded-xl p-3 border border-zinc-400 dark:border-zinc-200 flex flex-col
                gap-4 justify-center items-center h3-last
                "
      >
        {/* <div className="m-1 capitalize text-center h2-last">Player Info</div> */}

        <Tabs defaultValue="wallet" className="w-[240px] sm:w-[360px]">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl">
            {/* <TabsList className="rounded-2xl w- mx-auto mb-2"> */}
            <TabsTrigger value="wallet" className="rounded-xl font-digit">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="game" className="rounded-xl font-digit">
              <div className="">Game</div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wallet">
            <div className="mx-auto flex flex-col gap-6 justify-center items-center mb-4">
              {/* <div className="font-digit uppercase text-center h2-last text-2xl sm:text-xl underline">
                player wallet
              </div> */}
              <div className="w-full">
                <div className="underline flex flex-row justify-center">Login</div>
                {/* <div className="underline">Login</div> */}
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">Method</p>
                  <p className="text-right capitalized">
                    {authenticated ? loginAccount : <p className="text-right"> Not logged in</p>}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">User</p>
                  <p className="text-right flex justify-end">
                    <div className="flex justify-center items-center">
                      {authenticated ? username : <p className="text-right"> Not logged in</p>}
                      {/* <span onClick={copyUsername}>
                        <Copy size={18} className="cursor-pointer ml-2" />
                      </span> */}
                    </div>
                  </p>
                </div>
              </div>

              <div className="w-full">
                <div className="underline flex flex-row justify-center">
                  Game wallet
                  <div className="hidden sm:block">
                    <TooltipProvider delayDuration={10}>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle size={24} className="ml-1 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="">
                          <p className="px-3 py-1 max-w-[260px] text-sm">
                            Fund this wallet with ETH to buy tickets and enter the arena.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="block sm:hidden">
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle size={24} className="ml-1 cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent side="top" align="center" className="">
                        <p className="px-3 py-1 max-w-[260px] text-sm">
                          Fund this wallet with ETH to buy ticket and enter the arena.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-left">Address</p>
                    <p className="text-right flex justify-end">
                      <span>
                        {embeddedWallet ? (
                          <div className="flex justify-center items-center">
                            <a
                              href={`${BLOCK_EXPLORER}address/${embeddedWallet?.address}`}
                              target="_blank"
                              className="mr-2"
                            >
                              {formatAddress(String(embeddedWallet?.address))}
                            </a>
                            <span onClick={copyAddress}>
                              <Copy size={18} className="cursor-pointer" />
                            </span>
                          </div>
                        ) : (
                          <p className="text-right">No game wallet</p>
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-left">ETH in wallet</p>
                    <div className="flex justify-end">
                      <p className="flex text-right">
                        {' '}
                        <p className="text-right text-[#11140C] dark:text-[#FCFC03]">
                          {formatNumber(ethBalance, {
                            maximumFractionDigits: 3,
                            minimumFractionDigits: 0,
                          })}
                        </p>{' '}
                        <p className="ml-1"> ETH </p>
                      </p>
                      <button onClick={refetchETHHandler}>
                        <RefreshCcw size={16} className="text-sm ml-1 rounded-full"></RefreshCcw>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-left">{TOKEN_NAME} in wallet</p>
                    <p className="flex justify-end text-right">
                      {' '}
                      <p className="text-right text-[#11140C] dark:text-[#FCFC03]">
                        {formatNumber(tokenBalance, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 0,
                        })}
                      </p>{' '}
                      <p className="ml-1"> {TOKEN_NAME} </p>
                    </p>
                  </div>

                  {/* <div className="flex flex-col text-lg justify-center mt-2 mb-4">
                    <a
                      href={LIQUIDITY_POOL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex justify-center items-center"
                    >
                      <Button variant="secondary" className="text-xl rounded-full" disabled={true}>
                        Buy $LAST <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
                      </Button>
                    </a>
                  </div> */}

                  {/* <div className="flex flex-col gap-2 h3-last"> */}

                  <div className="underline flex flex-row justify-center">Wallet management</div>

                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-left">Create game wallet</p>
                    {embeddedWallet ? (
                      <p className="text-right"> Already created </p>
                    ) : (
                      <p className="text-right">
                        <Button
                          variant="secondary"
                          className="w-24 h-8 rounded-xl px-4"
                          disabled={!(ready && authenticated) || Boolean(embeddedWalletAddress)}
                          onClick={createWallet}
                        >
                          Create
                        </Button>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-left">Set password</p>
                    <p className="text-right">
                      {embeddedWallet ? (
                        <Button
                          variant="secondary"
                          className="w-24 h-8 rounded-xl px-4 text-lg"
                          disabled={!(ready && authenticated)}
                          onClick={setPasswordHandler}
                        >
                          Set
                        </Button>
                      ) : (
                        <p className=""> No game wallet </p>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <p className="text-left">Export key</p>
                    <p className="text-right">
                      {embeddedWallet ? (
                        <Button
                          variant="secondary"
                          className="w-24 h-8 rounded-xl px-4 text-lg"
                          disabled={!(ready && authenticated)}
                          onClick={exportKeyHandler}
                        >
                          Export key
                        </Button>
                      ) : (
                        <p className=""> No game wallet </p>
                      )}
                    </p>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="game">
            <div className="mx-auto flex flex-col gap-6 justify-center items-center mb-4">
              {/* <div className="font-digit uppercase text-center h2-last text-2xl sm:text-xl underline">
                player wallet
              </div> */}
              <div className="w-full">
                <div className="underline flex justify-center">Game info</div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">Game</p>
                  <p className="text-right">3</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">Theme</p>
                  <p className="text-right">Desert</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">Rand</p>
                  <p className="text-right">{randNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">Current Chain</p>
                  <p className="text-right text-[#11140C] dark:text-[#FCFC03]">{chainName}</p>
                </div>

                <div className="underline flex justify-center mt-6">Play count</div>
                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">Game play</p>
                  <p className="text-right">{Number(playCount)}</p>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <p className="text-left">Side quest</p>
                  <p className="text-right">{Number(sideQuestCount)}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mb-4"></div>

        {authenticated ? (
          <Button
            onClick={logout}
            variant="primary"
            className="w-9/12 h-12 rounded-xl text-2xl font-digit"
          >
            Log Out
          </Button>
        ) : (
          <Button
            onClick={login}
            variant="primary"
            className="w-9/12 h-12 rounded-xl text-2xl font-digit"
          >
            Log In
          </Button>
        )}
      </div>
    </div>
  )
}
