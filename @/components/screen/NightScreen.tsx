import dynamic from 'next/dynamic'
import AllPrice from '../ui/AllPrize'
import Countdown from '../ui/Countdown'
import NextClaim from '../ui/NextClaim'
import Round from '../ui/Round'
import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/check-in'

function NightScreen() {
  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Night </p>
        <Round round={0} stageType={'night'} />
        <Title stageType={'night'} />
      </div>
      <Ticket isCouldRedeemedTicket={true} />
      <Countdown />
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  )
}

export default dynamic(() => Promise.resolve(NightScreen), {
  ssr: false,
})
