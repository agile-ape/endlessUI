import Countdown from '../ui/Countdown'
import NextClaim from '../ui/NextClaim'
import Round from '../ui/Round'
import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/check-in'

export default function DayScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl"> Beginnings </p>
        <Round round={0} />
        <Title stageType={'day'} />
      </div>
      <Ticket isCouldRedeemedTicket={true} />
      <Countdown />
      <CheckIn />
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  )
}
