import Countdown from '../ui/Countdown'
import GameTab from '../ui/GameTab'
import NextClaim from '../ui/NextClaim'
import Round from '../ui/Round'
// import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import CheckIn from '../ui/CheckInBox'
import { useAccount, useContractReads } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import AllPrize from '../ui/AllPrize'
import UserActions from '../ui/UserActions'

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
    // <div className="container mx-auto py-[26px] flex flex-col gap-7 mt-7">
    //   <div className="text-center">
    //     <p className="text-xl text-black"> Day </p>
    //     <Round />
    //     <Title stageType={'day'} />
    //     <AllPrize />
    //   </div>
    //   <GameTab />
    //   <UserActions />
    //   <Countdown countdownTime={countdownTime} timeFlag={timeFlag} />
    //   {/* <CheckIn /> */}
    //   <NextClaim />
    //   <TicketList stage="beginning" />
    // </div>

    <div className="flex flex-col gap-5">
    <div className="text-center">
      <Round />
      <p className="text-3xl font-headline uppercase day-last my-2"> Day </p>
      <Countdown timeFlag={timeFlag} countdownTime={countdownTime} />
      
      {/* <Title stageType={'countdown'} /> */}
      <div className="flex justify-center items-center text-sm container-last">
        <AllPrize />
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-8 xl:mx-[150px] mb-8">
      <div>
        <div
          className="flex flex-col items-center gap-3 rounded-xl px-4 py-2
          container-last"
        >
          <GameTab />
          <UserActions />
        </div>
      </div>

      <div 
        className="grow rounded-xl py-2
        container-last"
      >
        <TicketList stage="beginning" />
      </div>
    </div>
    </div>
  )
}
