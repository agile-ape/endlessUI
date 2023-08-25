import Image from 'next/image'
import CustomConnectButton from './ui/connect-button'
import CheckIn from './ui/CheckIn'
import Round from './ui/Round'
import CheckInBox from './ui/CheckIn'
import Countdown from './ui/Countdown'
import NextClaim from './ui/NextClaim'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from "./ui/button";
import Ticket from './ui/Ticket'
import TicketList from './ui/TicketList'

const Title = () => {
  return (
    <div className="text-white">
      <h1 className="text-[40px] uppercase">It's a new day.</h1>
      <h1 className="text-[40px] uppercase">bright and early.</h1>
      <p className="text-[40px] uppercase">remember to check in.<br />😊❤️😊❤️</p>
    </div>
  )
}

export default function NightScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <Round
        stageRound={'Round 01'}
        fontTitleSize="text-xl"
        title={<Title />}
        stageType={'beginning'}
      />
      <Ticket isCouldRedeemedTicket={true} />
      <Countdown />
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  );
}
