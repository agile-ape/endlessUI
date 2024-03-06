import Image from 'next/image'
import React, { useRef, useState } from 'react'
import CustomConnectButton from '@/components/ui/connect-button'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Logo from './ui/Logo'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Indicator from './ui/Indicator'
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
import PWADrawer from './ui/PWADrawer'
import CompletionModal from './ui/CompletionModal'
import { cn, formatAddress, formatShortAddress } from '@/lib/utils'
import {
  DOCS_URL,
  TWITTER_URL,
  TELEGRAM_URL,
  BLOG_URL,
  GAMEMASTER_ADDRESS,
} from '../../services/constant'
import { useRouter } from 'next/router'
import Admin from './ui/_Admin'
import HowToPlay from './ui/HowToPlay'

// import { usePrivy, useLogin, useLogout, useWallets, useConnectWallet } from '@privy-io/react-auth'
import { toast } from '../components/ui/use-toast'
import { useWindowSize } from '../../hooks/useWindowSize'
import { User, Menu, Users, Clock, Move } from 'lucide-react'

function Header() {
  return (
    <>
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 gap-2 items-center py-3 px-5">
          <div className="flex justify-start order-1">
            <Logo />
          </div>

          <div className="flex justify-self-end gap-3 order-3">
            <div className="flex items-center space-x-4">
              <HowToPlay />
              <a href={TWITTER_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Follow 🐦
                </Button>
              </a>
              <a href={TELEGRAM_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Telegram 🧑‍🤝‍🧑
                </Button>
              </a>

              <ConnectButton label="Connect" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
