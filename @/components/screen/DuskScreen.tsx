import AllPrice from '../ui/AllPrice'
import Round from '../ui/Round'
import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/check-in'

export default function DuskScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7 min-h-screen">
      <div className="text-center">
        <p className="text-xl"> Dusk </p>
        <Round round={0} />
        <Title stageType={'dusk'} />
      </div>

      <Ticket isCouldBuyTicket={false} />
      <AllPrice />
      <TicketList stage="dusk" />
    </div>
  )
}
