import Countdown from '../ui/Countdown'
import Image from 'next/image'

import GameTab from '../ui/GameTab'
import Round from '../ui/Round'
// import Ticket from '../ui/Ticket'
import TicketList from '../ui/TicketList'
import Title from '../ui/Title'
import { useAccount, useContractReads } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import Indicator from '../ui/Indicator'
import { useStoreState } from '../../../store'

export default function Screen() {
  const { isConnected } = useAccount()
  const phase = useStoreState((state) => state.phase)

  // const { data } = useContractReads({
  //   contracts: [
  //     {
  //       ...defaultContractObj,
  //       functionName: 'timeFlag',
  //     },
  //     {
  //       ...defaultContractObj,
  //       functionName: 'dayTime',
  //     },
  //   ],
  //   enabled: isConnected,
  // })

  // let timeFlag = 0
  // let countdownTime = 0

  // if (data && data?.length > 0) {
  //   timeFlag = Number(data[0]?.result)
  //   countdownTime = Number(data[1]?.result) || 0

  //   console.log('countdownTime', countdownTime)
  // }

  return (
    <div className="flex flex-col xl:mx-[100px] pb-8">
      <div className="text-center">
        <Title stageType={'day'} />
      </div>

      {/* top container */}
      <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:items-end px-5 pb-2 my-2">
        <Round phase={phase} />
        <Countdown phase={phase} />
        <Indicator phase={phase} />
      </div>

      {/* bottom container */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-4 container-last w-min mx-auto">
          <GameTab />
        </div>

        <div className="grow rounded-xl py-2 container-last">
          <TicketList />
        </div>
      </div>
    </div>
  )
}
