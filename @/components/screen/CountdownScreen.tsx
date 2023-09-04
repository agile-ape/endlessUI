import Round from '../ui/Round'
import Title from '../ui/Title'
// import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'
import AllPrize from '../ui/AllPrize'
import PrizeInfo from '../ui/PrizeInfo'
import dynamic from 'next/dynamic'
import GameTab from '../ui/GameTab'
import { useAccount, useContractReads } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'

function CountdownScreen() {
  const { isConnected } = useAccount()

  const { data } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'timeFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'countdownTime',
      },
    ],
    enabled: isConnected,
  })

  let timeFlag = 0
  let countdownTime = 0

  if (data && data?.length > 0) {
    timeFlag = Number(data[0]?.result)
    countdownTime = Number(data[1]?.result) || 0

    console.log('timeFlag', timeFlag)
    console.log('countdownTime', countdownTime)
  }

  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Game Has Not Started </p>
        {/* <Round round={0} stageType={'countdown'} /> */}
        <Title stageType={'countdown'} />
      </div>

      <GameTab isCouldBuyTicket={true} />

      <Countdown timeFlag={timeFlag} countdownTime={countdownTime} />
      <PrizeInfo display="total" />
      <TicketList stage="beginning" />
    </div>
  )
}

CountdownScreen.theme = 'light'

export default dynamic(() => Promise.resolve(CountdownScreen), {
  ssr: false,
})
