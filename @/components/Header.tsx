import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CaretDownIcon, TriangleDownIcon } from '@radix-ui/react-icons';

function Header() {
  return (
    <nav className="max-w-lg mx-auto pt-4 flex justify-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-[#585858] py-1 px-4 rounded text-white inline-flex items-center gap-3 uppercase">
          How To Play
          <TriangleDownIcon className="w-[20px] h-[20px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="bg-[#585858] py-1 px-4 rounded text-white inline-flex items-center gap-3 uppercase">
          Links
          <TriangleDownIcon className="w-[20px] h-[20px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export default Header;
