import Image from 'next/image';
import CustomConnectButton from './ui/connect-button';
import CheckIn from './ui/check-in';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// import * as Popover from '@radix-ui/react-popover';
import { DarkModeSwitcher } from './ui/DarkModeSwitcher';

import Ticket from './ui/Ticket';
import TicketList from './ui/TicketList';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function BeginningScreen() {

  return (
    <div className="max-w-lg mx-auto my-[26px] pb-[1rem]">
      <div className="flex justify-end">
        <DarkModeSwitcher />
      </div>
      <div className="text-center">
        <p className="text-lg">Round 01</p>
        <p className="text-lg">Beginnings</p>
        <h1 className="uppercase mt-4 text-xl">are you the last man standing?</h1>
      </div>

      <div className="mx-auto flex flex-col gap-7 mt-20">
        <div className="flex justify-center">
          <CustomConnectButton />
        </div>
        <Ticket />
        <div className="text-center">
          <div className="flex justify-center items-center">
            <p className="text-[20px]">Time Left:</p>
            {/* <Popover.Root>
              <Popover.Trigger asChild><QuestionMarkCircledIcon className="w-[18px] h-[18px]"/></Popover.Trigger>
              <Popover.Content className="PopoverContent" sideOffset={5}><p><strong>Time left for this phase.</strong> Once timer hits zero, anyone can trigger the phase change.</p></Popover.Content>
            </Popover.Root> */}

            <Popover>
              <PopoverTrigger><QuestionMarkCircledIcon className="w-[18px] h-[18px]"/></PopoverTrigger>
              <PopoverContent asChild className="PopoverContent" sideOffset={5}><p><strong>Time left for this phase.</strong> Once timer hits zero, anyone can trigger the phase change.</p></PopoverContent>
            </Popover>
            
          </div>
          <h2 className="text-[40px]">04:10</h2>
        </div>
        <CheckIn />
        <div className="bg-[#F6F6F6] dark:bg-[#1C1C1C] border border-[#EBEBEB] dark:border-[#444242] text-center w-[220px] mx-auto rounded-lg p-2">
          <div className="flex justify-center items-center gap-1">
            <p className="font-extralight">Next Claim</p>
            {/* <Popover>
              <PopoverTrigger><QuestionMarkCircledIcon className="w-[18px] h-[18px]"/></PopoverTrigger>
              <PopoverContent><p><strong>Lorem Ipsum.</strong> dolor sit jamet.</p></PopoverContent>
            </Popover> */}
          </div>
          
          <div className="flex justify-center gap-2">
            <p className="text-[36px]">0.500</p>
            <Image
              priority
              src="/logo/cryptocurrency-color_eth.svg"
              height={24}
              width={24}
              alt="ethereum logo"
            />
          </div>
        </div>
        <TicketList />
      </div>
    </div>
  );
}
