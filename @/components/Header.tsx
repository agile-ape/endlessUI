import Image from 'next/image'
import React, { useRef, useState } from 'react'
import CustomConnectButton from '@/components/ui/connect-button'

import Logo from './ui/Logo'
import SideMenu from './_SideMenu'

import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Token from './ui/_Token'
import Indicator from './ui/Indicator'
import Dashboard from './ui/_Dashboard'
import DashboardNew from './ui/DashboardNew'
import Modal from '../components/ui/Modal'
import { useStoreActions, useStoreState } from '../../store'

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
import { useAccount } from 'wagmi'
import CompletionModal from './ui/CompletionModal'
import { cn } from '@/lib/utils'
import {
  DOCS_URL,
  TWITTER_URL,
  TELEGRAM_URL,
  BLOG_URL,
  GAMEMASTER_ADDRESS,
} from '../../services/constant'
import { useRouter } from 'next/router'
import Admin from './ui/Admin'
import { usePrivy, useLogin, useLogout, useWallets, useConnectWallet } from '@privy-io/react-auth'
import { toast } from '../components/ui/use-toast'
import { useWindowSize } from '../../hooks/useWindowSize'
import { User, Menu, Users, Clock, Move } from 'lucide-react'

function Header() {
  const tokenBalance = useStoreState((state) => state.tokenBalance)

  const { isConnected, address } = useAccount()
  const [hoveredLink, setHoveredLink] = useState<null | number>(null)
  const [hoveredHeader, setHoveredHeader] = useState<null | boolean>(false)
  const router = useRouter()
  const { ready, authenticated, user, createWallet } = usePrivy()
  const { xs } = useWindowSize()

  const [showDashboardModal, setShowDashboardModal] = React.useState<boolean>(false)
  const toggleDashboard = () => setShowDashboardModal((prevState) => !prevState)

  const [showTokenModal, setShowTokenModal] = React.useState<boolean>(false)
  const toggleToken = () => setShowTokenModal((prevState) => !prevState)
  // const { wallets } = useWallets()
  // const wallet = wallets.find((wallet) => wallet.address === address)

  // const handleLinkHover = (index: number) => {
  //   setHoveredLink(index)
  // }

  // const { logout } = useLogout({
  //   onSuccess: () => {
  //     console.log('User logged out')
  //     toast({
  //       variant: 'destructive',
  //       // title: 'Keyword updated',
  //       description: <p>You are logged out.</p>,
  //     })
  //   },
  // })

  // const { login } = useLogin({
  //   onComplete: () => {
  //     console.log('User logged in')
  //     toast({
  //       variant: 'success',
  //       // title: 'Keyword updated',
  //       description: <p>You are logged in.</p>,
  //     })
  //   },
  // })

  // const handleHeaderHover = (index: boolean) => {
  //   setHoveredHeader(index)
  // }

  const isActive = (href: string) => {
    return router.pathname === href
  }

  return (
    <>
      {/* 
      <div className="sm:hidden fixed bottom-0 w-full h-14 container-last border-l-0 border-r-0 border-b-0 bg-opacity-100 dark:bg-opacity-100 px-2 pt-1">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col justify-center items-center">
            <Link href="/">
              <User size={24} />
              <div className="">You</div>
            </Link>
          </div>

          <div className="flex flex-col justify-center items-center">
            <Move size={24} />
            <div className="">Actions</div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <Clock size={24} />
            <div className="">Events</div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <Users size={24} />
            <div className="">List</div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <Menu size={24} />
            <div className="">Menu</div>
          </div>
        </div>
      </div>
    */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 gap-2 items-center py-3 px-5">
          <div className="flex justify-start order-1">
            <Logo />
          </div>

          <div className="flex justify-self-end gap-3 order-3">
            {/* <div className="flex justify-self-end xl:hidden order-4">
              <SideMenu />
            </div> */}
            {/* <div className={`hidden xl:flex items-center space-x-4`}> */}
            <div className="flex items-center space-x-4">
              {/* custom styling */}
              {/* border border-white/40 rounded-md */}
              {/* <Link
            className={cn(
              `px-2 text-xl text-zinc-700 dark:text-zinc-200 hover:underline hover:text-neutral-900 dark:hover:text-zinc-50 py-1 px-3 mx-2 flex items-center`,
              isActive('/quickstart') && 'underline', //example of active class link
              )}
              href="/quickstart"
              >
              Quickstart
            </Link> */}
              <a href={DOCS_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Docs
                  {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
                </Button>
              </a>
              <a href={TWITTER_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Follow
                  {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
                </Button>
              </a>
              <a href={TELEGRAM_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Community
                  {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
                </Button>
              </a>
              <a href={BLOG_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Blog
                  {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
                </Button>
              </a>
              {address === GAMEMASTER_ADDRESS ? (
                <div className="ml-2">
                  <Admin />
                </div>
              ) : (
                ''
              )}

              {authenticated && (
                <>
                  {/* <Token /> */}
                  {/* <Dashboard /> */}

                  <button onClick={toggleToken}>
                    <div className="flex p-1 md:px-2 md:py-2 items-center justify-center border rounded-full border-zinc-700 dark:border-zinc-200 hover:bg-zinc-400/50 hover:cursor-pointer">
                      <div className="relative p-3">
                        <Image
                          priority
                          src="/logo/token.svg"
                          fill={true}
                          // height={25}
                          // width={25}
                          alt="last-token"
                          className=""
                        />
                      </div>
                      <span className="ml-1 h5-last font-whitrabt">{tokenBalance}</span>
                    </div>
                  </button>

                  <button onClick={toggleDashboard}>
                    <div className="flex p-1 md:px-4 md:py-2 items-center justify-center border rounded-full border-zinc-700 dark:border-zinc-200 hover:bg-zinc-400/50 hover:cursor-pointer">
                      <div className="relative p-3">
                        <Image
                          priority
                          src="/faces/stare.png"
                          fill={true}
                          // height={25}
                          // width={25}
                          alt="player-dashboard"
                          className=""
                        />
                      </div>
                    </div>
                  </button>
                  {/* <DashboardNew /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDashboardModal && <Modal action={'dashboard'} toggle={toggleDashboard} />}
      {showTokenModal && <Modal action={'token'} toggle={toggleToken} />}
    </>
    // </div>
  )
}

export default Header
