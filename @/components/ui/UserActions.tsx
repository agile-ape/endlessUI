import React from 'react'
import { Button } from './button'
import { HelpCircle } from 'lucide-react'
import SafehouseAction from './_SafehouseAction'
import SubmitKeywordModal from './SubmitKeywordModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CheckIn from './CheckIn'
import CheckOut from './CheckOut'
import SplitIt from './SplitIt'
import ExitGame from './ExitGame'
import Inspect from './Attack'
import KickOut from './KickOut'
import ChangePhase from './_ChangePhase'
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
import { defaultContractObj, DOCS_URL_exit } from '../../../services/constant'
import { statusPayload } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'

const UserActions = () => {
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const toggle = () => setShowModal((prevState) => !prevState)
  const phase = useStoreState((state) => state.phase)

  // Address read
  const { address, isConnected } = useAccount()

  const { data: playerTicket } = useContractRead({
    ...defaultContractObj,
    functionName: 'playerTicket',
    args: [address as `0x${string}`],
    cacheTime: 3_000,
  })

  let ticketStatus = Number(playerTicket?.[3] || BigInt(0))
  let ticketIsInPlay = Boolean(playerTicket?.[5] || 0)

  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'
  // const ticketStatusString = 'safe'

  // Active condition
  const submitActive = phase === 'day' && ticketStatusString !== 'safe' && ticketIsInPlay === true

  return (
    <div
      className="w-[240px] rounded-xl p-3 pt-5 pb-5
    container-last
    flex flex-col gap-3 mb-5"
    >
      <Button variant="submit" className="w-full text-2xl flex justify-start" onClick={toggle}>
        <OnSignal active={submitActive} own={true} />
        Submit Keyword
      </Button>

      <CheckIn playerTicket={playerTicket} />
      <SplitIt playerTicket={playerTicket} />

      {showModal && (
        <SubmitKeywordModal toggle={toggle} active={submitActive} playerTicket={playerTicket} />
      )}
    </div>
  )
}

export default UserActions
