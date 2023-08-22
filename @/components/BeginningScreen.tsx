import Image from 'next/image'
import CustomConnectButton from './ui/connect-button'
import CheckIn from './ui/CheckIn'
import Round from './ui/Round'
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

const Title = () => {
  return (
    <div>
      <h1 className="text-[40px]">It's a new day!</h1>
      <p className="text-[25px]">I Smell Blood in the air. 😊❤️😊❤️</p>
    </div>
  )
}

export default function BeginningScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <Round
        stageRound={'Round 01'}
        fontTitleSize="text-xl"
        title={<Title />}
        stageType={'beginning'}
      />
      <Ticket isCouldBuyTicket={true} />
      <Countdown />
      <CheckIn />
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  )
}
