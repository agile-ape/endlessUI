import Title from '../ui/Title'
import Round from '../ui/Round'
import Countdown from '../ui/Countdown'
import Indicator from '../ui/Indicator'
import GameTab from '../ui/GameTab'
import TicketList from '../ui/TicketList'
import { useAccount } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import Image from 'next/image'
import { useStoreState } from '../../../store'

export default function Screen() {
  const { isConnected } = useAccount()

  return (
    <div className="flex flex-col xl:mx-[100px] pb-8">
      <div className="text-center">
        <Title />
      </div>

      {/* top container */}
      {isConnected && (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:items-end px-5 pb-2 my-2">
          <Round />
          <Countdown />
          <Indicator />
        </div>
      )}

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
