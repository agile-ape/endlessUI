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
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="text-3xl font-headline uppercase beginnings-last"> Countdown </p>
        <Round round={0} phaseType={'countdown'} />
        <Countdown timeFlag={timeFlag} countdownTime={countdownTime} />
        {/* <br></br> */}
        <Title stageType={'countdown'} />
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mx-8 mb-8">
        <div>
          <div
            className="flex flex-col gap-3 rounded-xl px-3 py-4
            lg:bg-slate-300 lg:bg-opacity-50
            dark:lg:bg-slate-500 dark:lg:bg-opacity-50"
          >
            <GameTab isCouldBuyTicket={true} />
            <PrizeInfo display="total" />
          </div>
        </div>

          <div className="grow">
            <TicketList stage="beginning" />
          </div>
        
      </div>
    </div>
  )
}

CountdownScreen.theme = 'light'

export default dynamic(() => Promise.resolve(CountdownScreen), {
  ssr: false,
})
