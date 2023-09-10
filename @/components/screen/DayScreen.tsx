import Countdown from '../ui/Countdown'
import GameTab from '../ui/GameTab'
import NextClaim from '../ui/NextClaim'
import Round from '../ui/Round'
// import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/CheckIn'

export default function DayScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-black"> Day </p>
        <Round round={0} phaseType={'day'} />
        <Title stageType={'day'} />
      </div>
      <GameTab isCouldBuyTicket={true} />
      <Countdown countdownTime={0} timeFlag={0} />
      {/* <CheckIn /> */}
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  )
}
