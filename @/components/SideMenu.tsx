import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import CustomConnectButton from '@/components/ui/connect-button'
import { ExternalLinkIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

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

import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

export default function SideMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-xl text-base p-2 shadow-md
        bg-gradient-to-r from-sky-300 to-indigo-500
        hover:bg-red hover:text-indigo-900
        focus:bg-red focus:text-indigo-900
        "
      >
        <HamburgerMenuIcon className="h-4 w-4"></HamburgerMenuIcon>
        {/* <Image
          priority
          className="stroke-3 fill-slate-300"
          src="/icon/hamburger.svg"
          height={18}
          width={18}
          alt="hamburger-icon"
        /> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>How to play</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              hideWhenDetached={false}
              sideOffset={5}
              className="sm:w-[100px] p-2 rounded-xl text-sm shadow-md"
            >
              Party rock Let's go! Party rock is in the house tonight Everybody just have a good
              time And we gon' make you lose your mind Everybody just have a good time (clap!) Party
              rock is in the house tonight Everybody just have a good time (I can feel it baby!) And
              we gon' make you lose your mind We just wanna see you... shake that!
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem className="cursor-pointer">
          Learn more
          <ExternalLinkIcon className="ml-1"></ExternalLinkIcon>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Follow Us <ExternalLinkIcon className="ml-1"></ExternalLinkIcon>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Huddle Up <ExternalLinkIcon className="ml-1"></ExternalLinkIcon>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CustomConnectButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
