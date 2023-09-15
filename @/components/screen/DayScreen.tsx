import Countdown from '../ui/Countdown'
import GameTab from '../ui/GameTab'
import NextClaim from '../ui/NextClaim'
import Round from '../ui/Round'
// import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/CheckIn'
import { useAccount, useContractReads } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'

export default function DayScreen() {
  const { isConnected } = useAccount()

  const { data } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'timeFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'dayTime',
      },
    ],
    enabled: isConnected,
  })

  let timeFlag = 0
  let countdownTime = 0

  if (data && data?.length > 0) {
    timeFlag = Number(data[0]?.result)
    countdownTime = Number(data[1]?.result) || 0

    console.log('countdownTime', countdownTime)
  }

  return (
    <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-black"> Day </p>
        <Round round={0} phaseType={'day'} />
        <Title stageType={'day'} />
      </div>
      <GameTab isCouldBuyTicket={true} />
      <Countdown countdownTime={countdownTime} timeFlag={timeFlag} />
      {/* <CheckIn /> */}
      <NextClaim />
      <TicketList stage="beginning" />
    </div>
  )
}
