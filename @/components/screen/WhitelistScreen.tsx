import Round from '../ui/Round'
import Title from '../ui/Title'
import Whitelist from '../ui/Whitelist'
// import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
// import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'

// check if user is connected. if not - show connect button.
// if connect, check if user is already on whitelist. if yes - show image and 'Good luck'
// if no, show button to sign up
export default function WhitelistScreen() {
  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl"> Whitelist </p>
        <Round round={0} />
        <Title stageType={'whitelist'} />
      </div>

      <Whitelist />
    </div>
  )
}
