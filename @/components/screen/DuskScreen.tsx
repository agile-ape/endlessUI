import dynamic from 'next/dynamic'
import AllPrice from '../ui/AllPrize'
import Round from '../ui/Round'
// import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/CheckInBox'
import GameTab from '../ui/GameTab'
import PrizeInfo from '../ui/PrizeInfo'
import Countdown from '../ui/Countdown'

function DuskScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Dusk </p>
        <Round />
        <Title stageType={'dusk'} />
      </div>

      <GameTab />
      {/* <AllPrice /> */}
      <Countdown countdownTime={0} timeFlag={0} />

      <PrizeInfo display="total" />
      <TicketList stage="dusk" />
    </div>
  )
}

export default dynamic(() => Promise.resolve(DuskScreen), {
  ssr: false,
})
