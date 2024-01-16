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
import { Split, AlertTriangle, ExternalLink, HelpCircle, User, Copy } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import { formatAddress, formatNumber, cn, copyToClipboard, findChainName } from '@/lib/utils'
import {
  TOKEN_ADDRESS,
  GAME_ADDRESS,
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

  // 'wallet', 'sms', 'email', 'google', 'twitter'

  const loginMethod = user?.linkedAccounts[1].type
  let username

  if (loginMethod === 'email') {
    username = user?.linkedAccounts[1].address
  } else if (loginMethod === 'phone') {
    username = user?.linkedAccounts[1].number
  } else if (loginMethod === 'google_oauth') {
    username = user?.linkedAccounts[1].email
  } else if (loginMethod === 'wallet') {
    username = formatAddress(String(user?.linkedAccounts[1].address))
  }

  const { wallets } = useWallets()
  // search for embedded wallet and pull address
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === 'privy')
  const embeddedWalletAddress = embeddedWallet?.address
  const embeddedWalletChain = embeddedWallet?.chainId
  const chainWithoutPrefix = embeddedWalletChain
    ? Number(embeddedWalletChain.replace(/^eip155:/i, ''))
    : null
  console.log(embeddedWalletChain)
  console.log(chainWithoutPrefix)
  console.log(typeof embeddedWalletChain)

  // const chainName = chainWithoutPrefix ? findChainName(chainWithoutPrefix).then : null
  // console.log(chainName)

  const [chainName, setChainName] = useState('')
  useEffect(() => {
    if (chainWithoutPrefix !== null) {
      findChainName(chainWithoutPrefix)
        .then((result) => {
          setChainName(result)
          console.log(chainName)
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

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  })

  const { data: balanceData } = useBalance({
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
    ],
  })

  // assign to variables
  const playCount = data?.[0].result || BigInt(0)
  const sideQuestCount = data?.[1].result || BigInt(0)
  const balanceOf = data?.[2].result || BigInt(0)
  const tokenBalance = formatUnits(balanceOf, 18)

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
    <div className="w-[85%] mx-auto flex flex-col mb-8 body-last">
      <div className="hidden sm:block flex flex-col">
        <div className="flex items-center justify-center gap-2 my-2">
          <>
            <Image
              priority
              src="/lore/Dashboard.png"
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
        <div className="m-1 capitalize text-center h2-last">Wallet Info</div>

        <div className="mx-auto flex flex-col gap-4 justify-center items-center mb-4">
          <div className="w-full">
            <div className="underline">Login info</div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Method</p>
              <p className="text-right capitalized">
                {authenticated ? loginMethod : <p className="text-right"> Not logged in</p>}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">User</p>
              <p className="text-right">
                {authenticated ? username : <p className="text-right"> Not logged in</p>}
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="underline">Embedded wallet</div>
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-2 gap-1">
                <p className="text-left">Address</p>
                <p className="text-right flex justify-end">
                  <span>
                    {embeddedWallet ? (
                      <div className="flex">
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
                      <p className="text-right">No embedded wallet</p>
                    )}
                  </span>
                </p>
              </div>
              {/* <div className="flex flex-col gap-2 h3-last"> */}
              <div className="grid grid-cols-2 gap-1">
                <p className="text-left">Create wallet</p>
                {embeddedWallet ? (
                  <p className="text-right"> Already created </p>
                ) : (
                  <p className="text-right">
                    <Button
                      variant="privy"
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
                      variant="privy"
                      className="w-24 h-8 rounded-xl px-4 text-lg"
                      disabled={!(ready && authenticated)}
                      onClick={setPasswordHandler}
                    >
                      Set
                    </Button>
                  ) : (
                    <p className=""> No embedded wallet </p>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <p className="text-left">Export key</p>
                <p className="text-right">
                  {embeddedWallet ? (
                    <Button
                      variant="privy"
                      className="w-24 h-8 rounded-xl px-4 text-lg"
                      disabled={!(ready && authenticated)}
                      onClick={exportKeyHandler}
                    >
                      Export key
                    </Button>
                  ) : (
                    <p className=""> No embedded wallet </p>
                  )}
                </p>
              </div>
            </div>
            {/* </div> */}
          </div>

          <div className="w-full">
            <div className="underline">Game info </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Current Chain</p>
              <p className="text-right">{chainName}</p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Game play count</p>
              <p className="text-right">{Number(playCount)}</p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">Side quest count</p>
              <p className="text-right">{Number(sideQuestCount)}</p>
            </div>
          </div>

          <div className="w-full">
            <div className="underline">Tokens</div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">ETH holdings</p>
              <p className="text-right">
                {' '}
                {formatNumber(ethBalance, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                })}{' '}
                ETH{' '}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <p className="text-left">LAST holdings</p>
              <p className="text-right">
                {' '}
                {formatNumber(tokenBalance, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 0,
                })}{' '}
                LAST{' '}
              </p>
            </div>
            <div className="flex text-lg justify-center my-2">
              <a href={LIQUIDITY_POOL} target="_blank" rel="noreferrer" className="">
                <Button variant="buy" className="w-full text-xl rounded-full">
                  Buy $LAST tokens <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
                </Button>
              </a>
            </div>
            <a
              href={DOCS_URL}
              target="_blank"
              className="link h6-last flex items-center justify-center"
            >
              Learn more
            </a>
          </div>

          {authenticated ? (
            <>
              <Button
                onClick={logout}
                variant="primary"
                className="w-full rounded-xl text-xl font-whitrabt"
              >
                Log Out
              </Button>
            </>
          ) : (
            <Button
              onClick={login}
              variant="primary"
              className="w-full rounded-xl text-xl font-whitrabt"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
