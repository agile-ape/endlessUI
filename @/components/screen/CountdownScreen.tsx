import Round from '../ui/Round'
import Title from '../ui/Title'
import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'
import AllPrice from '../ui/AllPrice'

function CountdownScreen() {
  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Game Has Not Started </p>
        {/* <Round round={0} stageType={'countdown'} /> */}
        <Title stageType={'countdown'} />
      </div>

      <Ticket isCouldBuyTicket={false} />

      <Countdown />
      <AllPrice />
      <TicketList stage="beginning" />
    </div>
  )
}

CountdownScreen.theme = 'light'

export default CountdownScreen
