import React, { useEffect } from 'react'
import { Button } from './button'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import Modal from './Modal'

import Admin from './_Admin'
import AdminNew from './AdminNew'

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

import OnSignal from './_OnSignal'
import Image from 'next/image'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import {
  defaultContractObj,
  DOCS_URL_exit,
  WEBSOCKET_ENDPOINT,
  GAMEMASTER_ADDRESS,
  ADMIN_ADDRESSES,
} from '../../../services/constant'
import { cn, statusPayload } from '@/lib/utils'
import { useStoreActions, useStoreState } from '../../../store'
import { io } from 'socket.io-client'
import {
  User,
  Menu,
  MenuSquare,
  Link2,
  Unlink2,
  Rss,
  Users,
  Clock,
  Monitor,
  Target,
  Info,
  Move,
  ChevronDown,
  ChevronUp,
  Send,
  Split,
  LogIn,
  LogOut,
  Dices,
  Gift,
  Ticket,
  Sword,
  Sparkle,
  RefreshCw,
  Axe,
} from 'lucide-react'

// const bgColorPhase: Record<string, string> = {
//   start: 'text-black border border-white bg-blue-100 hover:bg-blue-200',
//   day: 'text-white border border-white bg-green-600 hover:bg-green-700',
//   night: 'text-black border border-white bg-amber-500 hover:bg-amber-400',
//   lastmanfound: 'bg-neutral-900 hover:bg-neutral-800',
//   peacefound: 'bg-blue-800 hover:bg-blue-900',
//   drain: 'bg-red-400 hover:bg-red-500',
// }

const UserActions = () => {
  // const [showModal, setShowModal] = React.useState<boolean>(false)
  // const toggle = () => setShowModal((prevState) => !prevState)
  const { isConnected, address } = useAccount()

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

  const [showTokenModal, setShowTokenModal] = React.useState<boolean>(false)
  const toggleToken = () => setShowTokenModal((prevState) => !prevState)

  const [showAdminModal, setShowAdminModal] = React.useState<boolean>(false)
  const toggleAdmin = () => setShowAdminModal((prevState) => !prevState)

  return (
    <div>
      <div
        className="w-[240px] rounded-xl px-2 pt-4 pb-2
    container-last
    flex flex-col gap-2 mb-5 relative"
      >
        <div className="text-sm container-last bg-opacity-100  dark:bg-opacity-100 rounded-full w-max mx-auto px-3 absolute inset-x-0 -top-3 h-6">
          Players
        </div>

        <Button
          variant="submit"
          className="w-full text-xl flex justify-start"
          onClick={toggleSubmit}
        >
          <OnSignal active={submitActive} own={true} />
          {/* <Send size={20} className="text-green-50 mr-1" /> */}
          <span className="text-base mr-1">✅</span>Submit
        </Button>

        <Button
          variant="splitPot"
          className="w-full text-xl flex justify-start"
          onClick={toggleSplit}
        >
          <OnSignal active={splitActive} own={true} />
          {/* <Split size={20} className="text-amber-950 mr-1" /> */}
          <span className="text-base mr-1">🍻</span>Split
        </Button>
      </div>
      <div
        className="w-[240px] rounded-xl px-2 pt-4 pb-2
        container-last
        flex flex-col gap-2 mb-5 relative"
      >
        <div className="text-sm container-last bg-opacity-100 dark:bg-opacity-100 rounded-full w-max mx-auto px-3 absolute inset-x-0 -top-3 h-6">
          Safehouse
        </div>

        <Button
          variant="checkIn"
          // variant="attack"
          className="w-full text-xl flex justify-start"
          onClick={toggleCheckIn}
        >
          <OnSignal active={checkInActive} own={true} />
          {/* <LogIn size={20} className="text-blue-50 mr-1" /> */}
          <span className="text-base mr-1">🛏</span>
          Check In
        </Button>

        <Button
          variant="checkOut"
          // variant="kickOut"
          className="w-full text-xl flex justify-start"
          onClick={toggleCheckOut}
        >
          <OnSignal active={checkOutActive} own={true} />
          {/* <LogOut size={20} className="text-blue-950 mr-1" /> */}
          <span className="text-base mr-1">🧳</span>
          Check Out
        </Button>
      </div>

      <div
        className="w-[240px] rounded-xl px-2 pt-4 pb-2
        container-last
        flex flex-col gap-2 mb-5 relative"
      >
        <div className="text-sm container-last bg-opacity-100 dark:bg-opacity-100 rounded-full w-max mx-auto px-3 absolute inset-x-0 -top-3 h-6">
          All
        </div>

        <Button
          variant="wager"
          className="rounded-full w-full text-xl flex justify-start"
          onClick={toggleWager}
        >
          <OnSignal active={wagerActive} own={true} />
          {/* <Dices size={20} className="mr-1" /> */}
          <span className="text-base mr-1">🎲</span>
          Bet
        </Button>
      </div>

      {ADMIN_ADDRESSES.includes(String(address)) ? (
        <div
          className="w-[240px] rounded-xl px-2 pt-4 pb-2
        container-last
        flex flex-col gap-2 mb-5 relative"
        >
          <div className="text-sm container-last bg-opacity-100 dark:bg-opacity-100 rounded-full w-max mx-auto px-3 absolute inset-x-0 -top-3 h-6">
            Admin
          </div>

          <Button
            variant="admin"
            className="rounded-full w-full text-xl flex justify-start"
            onClick={toggleToken}
          >
            {/* <Gift size={20} className="text-pink-50 mr-1" /> */}
            <span className="text-base mr-1">🎁</span>
            Send
          </Button>

          <Button
            variant="admin"
            className="rounded-full w-full text-xl flex justify-start"
            onClick={toggleAdmin}
          >
            {/* <Sparkle size={20} className="text-pink-50 mr-1" /> */}
            <span className="text-base mr-1">🔑</span>
            Stats
          </Button>
        </div>
      ) : (
        ''
      )}

      {showSubmitModal && <Modal action={'submit'} toggle={toggleSubmit} />}
      {showCheckInModal && <Modal action={'checkIn'} toggle={toggleCheckIn} />}
      {showCheckOutModal && <Modal action={'checkOut'} toggle={toggleCheckOut} />}
      {showSplitModal && <Modal action={'splitIt'} toggle={toggleSplit} />}
      {showWagerModal && <Modal action={'wager'} toggle={toggleWager} />}
      {showTokenModal && <Modal action={'token'} toggle={toggleToken} />}
      {showAdminModal && <Modal action={'admin'} toggle={toggleAdmin} />}
    </div>
  )
}

export default UserActions
