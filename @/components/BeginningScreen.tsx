import Image from 'next/image';
import CustomConnectButton from './ui/connect-button';
import CheckIn from './ui/CheckIn';
import Round from './ui/Round';
import CheckInBox from './ui/CheckIn';
import Countdown from './ui/Countdown';
import NextClaim from './ui/NextClaim';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import * as Popover from '@radix-ui/react-popover';
import { DarkModeSwitcher } from './ui/DarkModeSwitcher';

import Ticket from './ui/Ticket';
import TicketList from './ui/TicketList';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function BeginningScreen() {
  return (
    <div className="mx-auto max-w-lg my-[26px] flex flex-col gap-7 mt-7">
      <div className="flex justify-end">
        <DarkModeSwitcher />
      </div>

      <Round />

      <Ticket />

      <Countdown />

      <CheckIn />

      <NextClaim />

      <TicketList />
    </div>
  );
}
