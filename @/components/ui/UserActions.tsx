import React, { useEffect } from 'react'
import { Button } from './button'
import { HelpCircle } from 'lucide-react'
import SubmitKeywordModal from './SubmitKeywordModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CheckIn from './CheckIn'
import CheckOut from './CheckOut'
import SplitIt from './SplitIt'
import BuyTicket from './BuyTicket'
import ExitGame from './ExitGame'
import Inspect from './Attack'
import KickOut from './KickOut'
import Wager from './Wager'

import Modal from './Modal'

import SubmitNewKeywordModal from './Submit'
import { SubmitActive } from './Submit'

import CheckInNew from './CheckInNew'
import { CheckInActive } from './CheckInNew'

import CheckOutNew from './CheckOutNew'
import { CheckOutActive } from './CheckOutNew'

import SplitPotNew from './SplitPotNew'
import { SplitPotActive } from './SplitPotNew'

import WagerNew from './WagerNew'
import { WagerActive } from './WagerNew'

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
  // const [showModal, setShowModal] = React.useState<boolean>(false)
  // const toggle = () => setShowModal((prevState) => !prevState)

  const submitActive = SubmitActive()
  const [showSubmitModal, setShowSubmitModal] = React.useState<boolean>(false)
  const toggleSubmit = () => setShowSubmitModal((prevState) => !prevState)

  const checkInActive = CheckInActive()
  const [showCheckInModal, setShowCheckInModal] = React.useState<boolean>(false)
  const toggleCheckIn = () => setShowCheckInModal((prevState) => !prevState)

  const checkOutActive = CheckOutActive()
  const [showCheckOutModal, setShowCheckOutModal] = React.useState<boolean>(false)
  const toggleCheckOut = () => setShowCheckOutModal((prevState) => !prevState)

  const splitActive = SplitPotActive()
  const [showSplitModal, setShowSplitModal] = React.useState<boolean>(false)
  const toggleSplit = () => setShowSplitModal((prevState) => !prevState)

  const { wagerActive, wagerStatus } = WagerActive()
  const [showWagerModal, setShowWagerModal] = React.useState<boolean>(false)
  const toggleWager = () => setShowWagerModal((prevState) => !prevState)

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
        <Button
          variant="submit"
          className="w-full text-xl flex justify-start"
          onClick={toggleSubmit}
        >
          <OnSignal active={submitActive} own={true} />
          Submit Keyword
        </Button>

        <Button
          variant="checkIn"
          className="w-full text-xl flex justify-start"
          onClick={toggleCheckIn}
        >
          <OnSignal active={checkInActive} own={true} />
          Check In
        </Button>

        <Button
          variant="checkOut"
          className="w-full text-xl flex justify-start"
          onClick={toggleCheckOut}
        >
          <OnSignal active={checkOutActive} own={true} />
          Check Out
        </Button>

        <Button
          variant="splitPot"
          className="w-full text-xl flex justify-start"
          onClick={toggleSplit}
        >
          <OnSignal active={splitActive} own={true} />
          Split Pot
        </Button>
      </div>

      <div
        className="w-[240px] rounded-xl p-3 pt-5 pb-5
        container-last
        flex flex-col gap-2 mb-5 relative"
      >
        <div className="text-sm container-last bg-opacity-100 dark:bg-opacity-100 rounded-full w-max mx-auto px-3 absolute inset-x-0 -top-3 h-6">
          All
        </div>

        <Button variant="wager" className="w-full text-xl flex justify-start" onClick={toggleWager}>
          <OnSignal active={wagerActive} own={true} />
          Ending?
        </Button>
      </div>

      {showSubmitModal && <Modal action={'submit'} toggle={toggleSubmit} />}
      {showCheckInModal && <Modal action={'checkIn'} toggle={toggleCheckIn} />}
      {showCheckOutModal && <Modal action={'checkOut'} toggle={toggleCheckOut} />}
      {showSplitModal && <Modal action={'splitIt'} toggle={toggleSplit} />}
      {showWagerModal && <Modal action={'wager'} toggle={toggleWager} />}
    </div>
  )
}

export default UserActions
