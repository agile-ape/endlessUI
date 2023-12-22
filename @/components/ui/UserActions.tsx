import React, { useEffect } from 'react'
import { Button } from './button'
import { HelpCircle } from 'lucide-react'
import SubmitKeywordModal from './SubmitKeywordModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CheckIn from './CheckIn'
import CheckOut from './CheckOut'
import SplitIt from './SplitIt'
import ExitGame from './ExitGame'
import Inspect from './Attack'
import KickOut from './KickOut'
import Wager from './Wager'

import { Send, Home } from 'lucide-react'
import OnSignal from './OnSignal'
import Image from 'next/image'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import { defaultContractObj, DOCS_URL_exit, WEBSOCKET_ENDPOINT } from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import { io } from 'socket.io-client'

const UserActions = () => {
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const toggle = () => setShowModal((prevState) => !prevState)
  const phase = useStoreState((state) => state.phase)
  const ownedTicket = useStoreState((state) => state.ownedTicket)

  // Address read
  // const { address, isConnected } = useAccount()

  // const { data: playerTicket, refetch } = useContractRead({
  //   ...defaultContractObj,
  //   functionName: 'playerTicket',
  //   args: [address as `0x${string}`],
  //   cacheTime: 3_000,
  // })

  // let ticketStatus = Number(playerTicket?.[3] || BigInt(0))
  // let ticketIsInPlay = Boolean(playerTicket?.[5] || 0)

  const ticketStatus = ownedTicket?.status || 0
  const ticketIsInPlay = ownedTicket?.isInPlay || false

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'
  // const ticketStatusString = 'safe'

  // Active condition
  const submitActive = phase === 'day' && ticketStatusString !== 'safe' && ticketIsInPlay === true

  return (
    <div>
      <div
        className="w-[240px] rounded-xl p-3 pt-5 pb-5
    container-last
    flex flex-col gap-2 mb-5 relative"
      >
        <div className="text-sm container-last bg-opacity-100 dark:bg-opacity-100 rounded-full w-max mx-auto px-3 absolute inset-x-0 -top-3 h-6">
          Only players
        </div>
        <Button variant="submit" className="w-full text-2xl flex justify-start" onClick={toggle}>
          <OnSignal active={submitActive} own={true} />
          Submit Keyword
        </Button>

        <CheckIn />
        <CheckOut />
        <SplitIt />
      </div>

      <div
        className="w-[240px] rounded-xl p-3 pt-5 pb-5
    container-last
    flex flex-col gap-2 mb-5 relative"
      >
        <div className="text-sm container-last bg-opacity-100 dark:bg-opacity-100 rounded-full w-max mx-auto px-3 absolute inset-x-0 -top-3 h-6">
          All
        </div>
        <Wager />
      </div>

      {showModal && <SubmitKeywordModal toggle={toggle} active={submitActive} playerTicket={''} />}
    </div>
  )
}

export default UserActions
