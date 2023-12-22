import Image from 'next/image'
import React, { useRef, useState } from 'react'
import CustomConnectButton from '@/components/ui/connect-button'

import Logo from './ui/Logo'
import SideMenu from './SideMenu'

import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Token from './ui/Token'
import Profile from './ui/Dashboard'
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

function Header() {
  const { isConnected, address } = useAccount()
  const [hoveredLink, setHoveredLink] = useState<null | number>(null)
  const [hoveredHeader, setHoveredHeader] = useState<null | boolean>(false)
  const router = useRouter()
  const { ready, authenticated, user, createWallet } = usePrivy()

  const { wallets } = useWallets()
  const wallet = wallets.find((wallet) => wallet.address === address)

  const handleLinkHover = (index: number) => {
    setHoveredLink(index)
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

  // const handleHeaderHover = (index: boolean) => {
  //   setHoveredHeader(index)
  // }

  const isActive = (href: string) => {
    return router.pathname === href
  }

  return (
    <div className="grid grid-cols-2 gap-2 items-center py-3 px-5">
      <div className="flex justify-start order-1">
        <Link className="cursor-pointer" href="/">
          <Logo />
        </Link>
      </div>

      {/* <div className="hidden xl:block order-2 flex justify-self-center">
        <Menu />
      </div> */}

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
              <Profile />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
