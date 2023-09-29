// import AllPrice from '../ui/AllPrice'
import Countdown from '../ui/Countdown'
import NextClaim from '../ui/NextClaim'
import Round from '../ui/Round'
// import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/CheckIn'

export default function LastManScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Last Man Found </p>
        <Round />
        <Title stageType={'night'} />
      </div>
      {/* <Ticket isCouldRedeemedTicket={true} /> */}
      <Countdown countdownTime={0} timeFlag={0} />
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  )
}
