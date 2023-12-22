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
import CustomConnectButton from '@/components/ui/connect-button'
import { useWindowSize } from '../../../hooks/useWindowSize'

export default function Screen() {
  const { isConnected } = useAccount()
  const { sm } = useWindowSize()

  return (
    <div className="flex flex-col xl:mx-[100px] pb-8">
      <div className="text-center">
        <Title />
        {/* only add on mobile */}
        {sm && <h1>hello world</h1>}
      </div>

      {!isConnected && (
        <>
          <div className="flex my-4 place-content-center">
            <div className="relative">
              <Image
                priority
                src="/pepe/sun.svg"
                className="place-self-center animate-pulse"
                height={300}
                width={300}
                alt="sneak-a-peek-pepe"
              />

              <div className="absolute top-[50px]">
                <Image
                  priority
                  src="/pepe/pepe-robe.svg"
                  className="place-self-center"
                  height={300}
                  width={300}
                  alt="sneak-a-peek-pepe"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-4 justify-center items-center z-10">
            <CustomConnectButton />
          </div>
        </>
      )}

      {isConnected && (
        <>
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:items-end px-5 pb-2 my-2">
            <Round />
            <Countdown />
            <Indicator />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-4 container-last w-min mx-auto">
              <GameTab />
            </div>

            <div className="grow rounded-xl py-2 container-last">
              <TicketList />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
