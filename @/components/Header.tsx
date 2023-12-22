import Image from 'next/image'
import React, { useRef, useState } from 'react'
import CustomConnectButton from '@/components/ui/connect-button'

import Logo from './ui/Logo'
import SideMenu from './SideMenu'

import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Token from './ui/Token'
import Dashboard from './ui/Dashboard'
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
import { DOCS_URL, TWITTER_URL, TELEGRAM_URL, BLOG_URL } from '../../services/constant'
import { useRouter } from 'next/router'
import Admin from './ui/Admin'
import { usePrivy, useLogin, useLogout, useWallets, useConnectWallet } from '@privy-io/react-auth'
import { toast } from '../components/ui/use-toast'
import { useWindowSize } from '../../hooks/useWindowSize'
import { User, Menu, Users, Clock, Move } from 'lucide-react'

function Header() {
  const { isConnected, address } = useAccount()
  const [hoveredLink, setHoveredLink] = useState<null | number>(null)
  const [hoveredHeader, setHoveredHeader] = useState<null | boolean>(false)
  const router = useRouter()
  const { ready, authenticated, user, createWallet } = usePrivy()
  const { xs } = useWindowSize()

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
    <div className="sm:grid sm:grid-cols-2 gap-2 items-center py-3">
      <div
        className="flex flex-col items-center justify-center order-1  
      sm:flew-row sm:flex-row sm:justify-start"
      >
        <Logo />
      </div>

      {xs && (
        <div className="fixed bottom-0 w-full container-last bg-opacity-100 dark:bg-opacity-100 px-2 pt-1">
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
      )}

      {!xs && (
        <div className="flex justify-self-end gap-3 order-3">
          <div className="flex justify-self-end xl:hidden order-4">
            <SideMenu />
          </div>
          <div className={`hidden xl:flex items-center space-x-4`}>
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
            <div className="ml-2">
              <Admin />
            </div>
            {authenticated && (
              <>
                <Token />
                <Dashboard />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
