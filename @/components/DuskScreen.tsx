import Image from 'next/image'
import CustomConnectButton from './ui/connect-button'
import CheckIn from './ui/CheckIn'
import Round from './ui/Round'
import AllPrice from './ui/AllPrice'
import CheckInBox from './ui/CheckIn'
import Countdown from './ui/Countdown'
import NextClaim from './ui/NextClaim'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
// import * as Popover from '@radix-ui/react-popover';

import Ticket from './ui/Ticket'
import TicketList from './ui/TicketList'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import DarkModeSwitcher from './ui/DarkModeSwitcher'

export default function DuskScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <Round 
        fontTitleSize="text-4xl"
        stageRound={'Stage 1 Round 2'} 
        stageType={'dusk'} 
        title1={`it's dusk. i smell`} 
        title2={`blood in the air`} 
        title3={'😊❤️😊❤️'} 
        title4={undefined} 
      />
      <Ticket isCouldBuyTicket={false} />
      <AllPrice />
      <TicketList stage="dusk" />
    </div>
  )
}
