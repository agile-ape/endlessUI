import Image from 'next/image'
import CustomConnectButton from '@/components/ui/connect-button'
import Menu from './Menu'
import Logo from './ui/Logo'
import SideMenu from './SideMenu'
import DarkModeSwitcher from './ui/DarkModeSwitcher'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'

function Header() {
  const { isConnected } = useAccount()
  return (
    <div className="grid grid-cols-2 xl:grid-cols-2 gap-2 items-center py-3 px-5">
      <div className="flex justify-start order-1">
        <Logo />
      </div>

      {/* <div className="hidden xl:block order-2 flex justify-self-center">
        <Menu />
      </div> */}

      <div className="flex justify-self-end xl:hidden order-4">
        <SideMenu />
      </div>

      <div className="hidden xl:flex justify-self-end gap-3 order-3">
        <div className="flex items-center">
          <Link
            className="hover:text-neutral-700 px-2 text-[#52525B] text-lg flex items-center"
            href="/howtoplay"
          >
            Quickstart <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
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

        {isConnected ? (
          <a
            href="https://app.uniswap.org/"
            target="_blank"
            rel="noreferrer"
            className="flex mx-2 text-xl items-center"
          >
            <p className="mr-1">$LAST:</p>
            <p className="mr-1">123</p>
          </a>
        ) : null}

        <CustomConnectButton />
      </div>
    </div>
  )
}

export default Header
