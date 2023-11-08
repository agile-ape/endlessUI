import { Menu } from 'lucide-react'
import { ExternalLink } from 'lucide-react'
import CustomConnectButton from '@/components/ui/connect-button'

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
import HowToPlay from './ui/_HowToPlay'
import GameHeader from './ui/GameHeader'
import { Button } from './ui/button'
import Link from 'next/link'

import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

export default function SideMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="connect-last px-2 py-2">
        <Menu size={20} strokeWidth={3}></Menu>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-opacity-100 dark:bg-opacity-100 container-last flex flex-col justify-center"
      >
        {/* <DropdownMenuItem className="cursor-pointer">
          <Link className="text-xl hover:text-neutral-700 mx-4" href="/">
            Game
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link className="text-xl hover:text-neutral-700 mx-4" href="/howtoplay">
            Guide
          </Link>
        </DropdownMenuItem> */}
        {/* <br /> */}
        {/* <DropdownMenuSubTrigger>How to play</DropdownMenuSubTrigger> */}
        {/* <DropdownMenuPortal>
            <DropdownMenuSubContent
              hideWhenDetached={false}
              sideOffset={5}
              className="w-[50px] sm:w-[100px] p-2 rounded-xl text-sm shadow-md"
            >
              <ol>
              <li>1. Buy your ticket during <span>Beginning / Countdown</span> </li>
              <li>2. Submit the <a href="https://github.com" target="_blank">keyword of the day</a> during <span>Day</span></li>
              <li>3. Check and kill others that didn't submit the right keyword in the <span>Night</span></li>
              <li>4. Value of dead ticket goes to ticket below - Dead #4 --{'>'} #3</li>
              <li>5. The longer you last, the more you earn from the prize pool</li>
              <li>6. You can leave the game anytime during the <span>Day</span></li>
            </ol>
            </DropdownMenuSubContent>
          </DropdownMenuPortal> */}

        <DropdownMenuItem className="cursor-pointer">
          <Link
            className="hover:text-neutral-700 px-2 text-[#52525B] text-base flex items-center"
            href="/howtoplay"
          >
            Quickstart <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <a href="https://twitter.com/lastman0x" target="_blank">
            <Button variant="link" size="md">
              Follow <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <a href="https://twitter.com/fachryadhitya" target="_blank">
            <Button variant="link" size="md">
              Chat <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <a href="https://twitter.com/fachryadhitya" target="_blank">
            <Button variant="link" size="md">
              Learn <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem>
          {/* <Button variant="destructive">$LAST</Button> */}
          <a href="https://app.uniswap.org/" className="flex text-xl items-center">
            <p className="mr-1">$LAST:</p>
            <p className="mr-1">123</p>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <CustomConnectButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
