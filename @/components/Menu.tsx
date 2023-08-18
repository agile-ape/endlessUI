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
} from '@/components/ui/navigation-menu';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import DarkModeSwitcher from './ui/DarkModeSwitcher';

export default function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="relative">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-xl text-sm shadow-md">
            How To Play
          </NavigationMenuTrigger>
          <NavigationMenuContent className="lg:w-[600px] p-2 rounded-xl text-sm shadow-md">
            Party rock Let's go! Party rock is in the house tonight Everybody just have a good time
            And we gon' make you lose your mind Everybody just have a good time (clap!) Party rock
            is in the house tonight Everybody just have a good time (I can feel it baby!) And we
            gon' make you lose your mind We just wanna see you... shake that!
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={`rounded-xl text-base shadow-md ${navigationMenuTriggerStyle()}`}
            href="https://github.com"
          >
            Learn More <ExternalLinkIcon className="ml-1"></ExternalLinkIcon>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={`rounded-xl text-base shadow-md ${navigationMenuTriggerStyle()}`}
            href="https://github.com"
          >
            Follow Us <ExternalLinkIcon className="ml-1"></ExternalLinkIcon>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            className={`rounded-xl text-base shadow-md ${navigationMenuTriggerStyle()}`}
            href="https://github.com"
          >
            Huddle Up <ExternalLinkIcon className="ml-1"></ExternalLinkIcon>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <DarkModeSwitcher />
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
}
