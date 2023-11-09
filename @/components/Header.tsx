import Image from 'next/image'
import CustomConnectButton from '@/components/ui/connect-button'
import Menu from './_Menu'
import Logo from './ui/Logo'
import SideMenu from './SideMenu'
import DarkModeSwitcher from './ui/DarkModeSwitcher'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
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
function Header() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-2 gap-2 items-center py-3 px-5">
      <div className="flex justify-start order-1">
        <Link className="cursor-pointer" href="/">
          <Logo />
        </Link>
      </div>

      {/* <div className="hidden xl:block order-2 flex justify-self-center">
        <Menu />
      </div> */}

      <div className="flex justify-self-end xl:hidden order-4">
        <SideMenu />
      </div>

      <div className="hidden xl:flex justify-self-end gap-3 order-3">
        <div className="flex items-center">
          {/* custom styling */}
          <Link
            className="px-2
            text-xl text-zinc-700 dark:text-zinc-200
            hover:text-neutral-900 
            dark:hover:text-neutral-200 dark:hover:text-neutral-200 flex items-center"
            href="/howtoplay"
          >
            Quickstart
          </Link>
          <a href="https://twitter.com/lastman0x" target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Follow <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <a href="https://twitter.com/fachryadhitya" target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Chat <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <a href="https://twitter.com/fachryadhitya" target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Learn <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="token" className="h-10 rounded-xl px-4 py-2 text-md font-whitrabt">
              LAST 200
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-opacity-100 dark:bg-opacity-100 container-last flex flex-col justify-center"
          >
            <a
              href="https://app.uniswap.org/"
              target="_blank"
              rel="noreferrer"
              className="flex mx-2 text-xl items-center"
            >
              <p className="mr-1">$LAST:</p>
              <p className="mr-1">123</p>
              <Image
                priority
                src="/logo/token.svg"
                height={32}
                width={32}
                alt="game logo"
                className="shrink-0 inline mr-2"
              />
            </a>
            {/* <Button variant="destructive">$LAST</Button> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <CustomConnectButton />
      </div>
    </div>
  )
}

export default Header
