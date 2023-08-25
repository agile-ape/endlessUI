import AllPrice from '../ui/AllPrice'
import Countdown from '../ui/Countdown'
import NextClaim from '../ui/NextClaim'
import Round from '../ui/Round'
import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/check-in'

export default function NightScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl"> Night </p>
        <Round round={0} />
        <Title stageType={'night'} />
      </div>
      <Ticket isCouldRedeemedTicket={true} />
      <Countdown />
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  )
}
