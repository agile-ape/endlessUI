import { Menu } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import CustomConnectButton from '@/components/ui/connect-button'
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
import { Button } from './ui/button'
import Link from 'next/link'
import { DOCS_URL, TWITTER_URL, TELEGRAM_URL, BLOG_URL } from '../../services/constant'

import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

export default function SideMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-2 rounded-xl border border-blue-950">
        <Menu size={20} strokeWidth={3}></Menu>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-opacity-100 dark:bg-opacity-100 container-last flex flex-col justify-center"
      >
        <DropdownMenuItem className="cursor-pointer">
          <a href={DOCS_URL} target="_blank">
            <Button variant="link" size="md">
              Docs
              {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
            </Button>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <a href={TWITTER_URL} target="_blank">
            <Button variant="link" size="md">
              Follow
              {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
            </Button>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <a href={TELEGRAM_URL} target="_blank">
            <Button variant="link" size="md">
              Community
              {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
            </Button>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <a href={BLOG_URL} target="_blank">
            <Button variant="link" size="md">
              Blog
              {/* <ExternalLink size={16} className="text-sm ml-1"></ExternalLink> */}
            </Button>
          </a>
        </DropdownMenuItem>

        <div className="flex flex-col gap-2 p-2">
          <Token />
          <Profile />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
