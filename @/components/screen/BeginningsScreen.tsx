import Round from '../ui/Round'
import Title from '../ui/Title'
import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'

function BeginningsScreen() {
  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl"> Beginnings </p>
        <Round round={0} />
        <Title stageType={'beginnings'} />
      </div>

      <Ticket isCouldBuyTicket={true} />

      <Countdown />
      <TicketList stage="beginning" />
    </div>
  )
}

BeginningsScreen.theme = 'light'

export default BeginningsScreen
