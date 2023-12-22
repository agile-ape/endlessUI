import Title from '../ui/Title'
import Round from '../ui/Round'
import Countdown from '../ui/Countdown'
import Indicator from '../ui/Indicator'
import GameTab from '../ui/GameTab'
import UserActions from '../ui/UserActions'
import TicketUI from '../ui/TicketUI'
import TicketList from '../ui/TicketList'
import { useAccount } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import Image from 'next/image'
import { useStoreState } from '../../../store'
import CustomConnectButton from '@/components/ui/connect-button'
import GameFeed from '@/components/ui/GameFeed'
import { usePrivy, useLogin, useLogout, useWallets } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { disconnect } from 'process'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { toast } from '@/components/ui/use-toast'

export default function Screen() {
  const { isConnected, address } = useAccount()
  const { user, connectWallet, ready, authenticated } = usePrivy()
  const { xs } = useWindowSize()

  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User logged out')
      toast({
        variant: 'destructive',
        // title: 'Keyword updated',
        description: <p>You are logged out.</p>,
      })
    },
  })

  const { login } = useLogin({
    onComplete: () => {
      console.log('User logged in')
      toast({
        variant: 'success',
        // title: 'Keyword updated',
        description: <p>You are logged in.</p>,
      })
    },
  })

  return (
    <div className="flex flex-col xl:mx-[100px] pb-8">
      <div className="text-center">
        <Title />
      </div>

      {!authenticated && (
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
            <Button
              onClick={login}
              variant="secondary"
              className="h-10 rounded-xl px-4 py-2 text-md font-whitrabt"
            >
              Connect and Login
            </Button>
          </div>
        </>
      )}

      {/* style a box to hold all the various component renders */}
      {authenticated && xs && (
        <>
          <div className="flex flex-col gap-2 px-5 my-2">
            <GameTab />
            {/* <GameFeed /> */}
          </div>
        </>
      )}

      {authenticated && !xs && (
        <>
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:items-end px-5 pb-2 my-2">
            <Round />
            <Countdown />
            <Indicator />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-4 container-last w-min mx-auto">
              <GameTab />
              <UserActions />
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
