import Image from 'next/image'
import CustomConnectButton from '@/components/ui/connect-button'
import Menu from './_Menu'
import Logo from './ui/Logo'
import SideMenu from './SideMenu'
import DarkModeSwitcher from './ui/_DarkModeSwitcher'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Token from './ui/Token'
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

function Header() {
  const { isConnected } = useAccount()

  const router = useRouter()

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
        <div className="hidden xl:flex items-center">
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
            <Button variant="link" className="px-2 text-lg" size="sm">
              Quickstart <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <a href={TWITTER_URL} target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Follow <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <a href={TELEGRAM_URL} target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Community <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <a href={BLOG_URL} target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Blog <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <div className="ml-2">
            <Admin />
          </div>

          {/* <a href="https://twitter.com/fachryadhitya" target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Learn <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a> */}
        </div>

        {isConnected ? <Token /> : null}

        <div className="hidden xl:flex">
          <CustomConnectButton />
        </div>
      </div>
    </div>
  )
}

export default Header
