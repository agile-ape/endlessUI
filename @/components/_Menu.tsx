import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { ExternalLink } from 'lucide-react'
import HowToPlay from './ui/_HowToPlay'
import GameHeader from './ui/GameHeader'
import Link from 'next/link'
import { Button } from './ui/button'
import CustomConnectButton from '@/components/ui/connect-button'

import DarkModeSwitcher from './ui/DarkModeSwitcher'

export default function Menu() {
  return (
    <div className="flex flex-row text-xl items-center">
      <Link className="text-xl hover:text-neutral-500 mx-4" href="/">
        Game
      </Link>
      <Link className="text-xl hover:text-neutral-500 mx-4" href="/howtoplay">
        Guide
      </Link>
      {/* <Link className="text-xl hover:text-neutral-500 mx-4" href="/whitelist">
        Whitelist
      </Link> */}
      {/* <GameHeader /> */}
      {/* <HowToPlay /> */}
    </div>

    // <NavigationMenu data-orientation="vertical">
    //   <NavigationMenuList>
    //     <NavigationMenuItem>
    //       < HowToPlay />
    //       {/* <NavigationMenuTrigger>How To Play</NavigationMenuTrigger> */}
    //       <NavigationMenuContent className="lg:w-[434px] p-2 rounded-xl text-sm shadow-md">
    //         <ol>
    //           <li>
    //             1. Buy your ticket during <span>Beginning / Countdown</span>{' '}
    //           </li>
    //           <li>
    //             2. Submit the{' '}
    //             <a href="https://github.com" target="_blank">
    //               keyword of the day
    //             </a>{' '}
    //             during <span className="day-last">Day</span>
    //           </li>
    //           <li>
    //             3. Check and kill others that didn't submit the right keyword in the{' '}
    //             <span className="night-last">Night</span>
    //           </li>
    //           <li>4. Value of dead ticket goes to ticket below - Dead #4 --{'>'} #3</li>
    //           <li>5. The longer you last, the more you earn from the prize pool</li>
    //           <li>
    //             6. You can leave the game anytime during the <span>Day</span>
    //           </li>
    //         </ol>
    //       </NavigationMenuContent>
    //     </NavigationMenuItem>

    //     <NavigationMenuItem>
    //       <NavigationMenuLink
    //         className={`${navigationMenuTriggerStyle()}`}
    //         href="https://github.com"
    //         target="_blank"
    //       >
    //         Learn More <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
    //       </NavigationMenuLink>
    //     </NavigationMenuItem>

    //     <NavigationMenuItem>
    //       <NavigationMenuLink
    //         className={`${navigationMenuTriggerStyle()}`}
    //         href="https://github.com"
    //         target="_blank"
    //       >
    //         Follow Us <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
    //       </NavigationMenuLink>
    //     </NavigationMenuItem>

    //     <NavigationMenuItem>
    //       <NavigationMenuLink
    //         className={`${navigationMenuTriggerStyle()}`}
    //         href="https://github.com"
    //         target="_blank"
    //       >
    //         Huddle Up <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
    //       </NavigationMenuLink>
    //     </NavigationMenuItem>
    //   </NavigationMenuList>
    // </NavigationMenu>
  )
}
