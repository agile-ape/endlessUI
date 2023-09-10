import { Menu } from "lucide-react"
import { ExternalLink } from "lucide-react"
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
import HowToPlay from './ui/HowToPlay'
import { Button } from './ui/button'

import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

export default function SideMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="connect-last px-2 py-2">
        <Menu size={20} strokeWidth={3}></Menu>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-blue-950 flex flex-col justify-center">
        
        <DropdownMenuSub>
          <HowToPlay />
        </DropdownMenuSub>

        
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
          <a href="https://twitter.com/lastman0x" target="_blank">
          <Button variant="link" size="md">Follow Us <ExternalLink size={16} className="text-sm ml-1"></ExternalLink></Button>
          </a> 
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <CustomConnectButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
