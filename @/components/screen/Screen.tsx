import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import Logo from '../ui/Logo'
import Title from '../ui/Title'
import Round from '../ui/Round'
import Countdown from '../ui/Countdown'
import Indicator from '../ui/Indicator'
import GameTab from '../ui/GameTab'
import UserActions from '../ui/UserActions'
import Submit from '../ui/Submit'
import AttackNew from '../ui/AttackNew'
import KickOutNew from '../ui/KickOutNew'
import CheckInNew from '../ui/CheckInNew'
import CheckOutNew from '../ui/CheckOutNew'
import SplitPotNew from '../ui/SplitPotNew'
import WagerNew from '../ui/WagerNew'
import BuyTicketNew from '../ui/BuyTicketNew'

import DashboardNew from '../ui/DashboardNew'
import ExitGameNew from '../ui/ExitGameNew'
import ActionsMobile from '../ui/ActionsMobile'
import KeyTrackers from '../ui/KeyTrackers'

import TicketUI from '../ui/TicketUI'
import TicketList from '../ui/TicketList'
import { useAccount } from 'wagmi'
import Image from 'next/image'
import { useStoreState } from '../../../store'
import CustomConnectButton from '@/components/ui/connect-button'
import GameFeed from '@/components/ui/GameFeed'
import { usePrivy, useLogin, useLogout, useWallets } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { disconnect } from 'process'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { toast } from '@/components/ui/use-toast'
import {
  LAST_MAN_STANDING_ADDRESS,
  DOCS_URL,
  TWITTER_URL,
  TELEGRAM_URL,
  BLOG_URL,
} from '../../../services/constant'
import {
  User,
  Menu,
  MenuSquare,
  Link2,
  Unlink2,
  Rss,
  Users,
  Clock,
  Move,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
type ComponentType = 'you' | 'list' | 'actions' | 'events' | 'menu'
type ActionType =
  | 'submit'
  | 'checkIn'
  | 'checkOut'
  | 'splitIt'
  | 'wager'
  | 'attack'
  | 'kickOut'
  | 'buyTicket'
  | 'exitGame'
import type { Ticket } from 'types/app'

export default function Screen() {
  const { isConnected, address } = useAccount()
  const { user, connectWallet, ready, authenticated } = usePrivy()
  const { xs } = useWindowSize()

  // Menu
  const [menuComponent, setMenuComponent] = useState<ComponentType | null>('you')
  const selectMenuComponent = (component: ComponentType) => {
    clearAction()
    setMenuComponent(component)
  }
  const clearMenuComponent = () => {
    setMenuComponent(null)
  }

  // Carousel
  const [isCarouselVisible, setCarouselVisibility] = useState(false)
  const toggleCarousel = () => {
    setCarouselVisibility(!isCarouselVisible)
  }

  // Actions
  const [actionView, setActionView] = useState<ActionType | null>(null)

  const selectAction = (action: ActionType) => {
    clearMenuComponent()
    setActionView(action)
  }

  const clearAction = () => {
    setActionView(null)
  }

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

  const ownedTicket = useStoreState((state) => state.ownedTicket)

  let ticket: Ticket | undefined = ownedTicket || {
    id: 0,
    user: address as `0x${string}`,
    sign: '',
    status: 0,
    lastSeen: 0,
    isInPlay: false,
    vote: false,
    value: 0,
    purchasePrice: 0,
    potClaim: 0,
    redeemValue: 0,
    attacks: 0,
    attackCount: 0,
    killCount: 0,
    killedBy: 0,
    safehouseNights: 0,
    checkOutRound: 0,
    buddy: 0,
    buddyCount: 0,
    rank: 0,
    contractAddress: LAST_MAN_STANDING_ADDRESS,
  }

  const id = ticket?.id || 0

  return (
    <div className="flex flex-col xl:mx-[100px] pb-8">
      {!authenticated && (
        <>
          {xs && (
            <div className="flex mx-auto py-3">
              <Logo />
            </div>
          )}
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
          <div className="flex flex-col">
            <div className="sticky top-0 container-last border-none bg-opacity-50 dark:bg-opacity-50 flex flex-col border-b pb-1 border-zinc-400 dark:border-zinc-200 ">
              <div className="flex justify-between mx-5 pt-3">
                {/* <div className="grid grid-cols-3 mx-5 py-3"> */}
                <div className="float-left">
                  <Logo />
                </div>
                <div className="float-right">
                  <Indicator />
                </div>
              </div>

              <details open>
                <summary className="text-center text-zinc-700 dark:text-zinc-200 tracking-wider">
                  Game{' '}
                </summary>
                <div className="flex flex-col mb-1">
                  <Round />
                  <div className="flex items-center justify-center">
                    <KeyTrackers />
                  </div>
                  <Countdown />
                </div>
              </details>
            </div>

            {/* <Accordion type="single">
                <AccordionItem value="item-1" className="flex justify-center">
                  <AccordionTrigger>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Countdown />
                    <div className="text-center">
                      <Title />
                    </div>
                    <Round />
                    <Countdown />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> */}

            {/* <div className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ChevronDown
                      className="absolute mt-1 bottom-0 animate-pulse text-white rounded-full"
                      size={14}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="px-8 bg-opacity-100 dark:bg-opacity-100 container-last flex flex-col gap-2 justify-center"
                  >
                    <div className="text-center">
                      <Title />
                    </div>
                    <Round />
                    <Countdown />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}

            {/* Items below to change */}
            {/* <GameTab /> */}
            {/* <GameFeed /> */}
            {/* <TicketList /> */}
            {/* <Submit /> */}
            <div className="mt-2">
              <div className="text-center">
                <Title />
              </div>
              {menuComponent === 'you' && (
                <div>
                  <div className="h1-last text-center">You</div>
                  <TicketUI
                    ownTicket={true}
                    ticketNumber={id}
                    ticket={ticket}
                    // ticketLookInput={'beforePurchase'}
                  />
                  <DashboardNew />
                </div>
              )}

              {menuComponent === 'events' && (
                <div>
                  <div className="h1-last text-center">Game Feed</div>
                  <GameFeed />
                </div>
              )}

              {menuComponent === 'list' && (
                <div>
                  <div className="h1-last text-center">Players</div>
                  <TicketList />
                </div>
              )}
              {menuComponent === 'menu' && (
                <div>
                  <div className="h1-last text-center">Links</div>
                  <Submit />
                </div>
              )}

              {actionView === 'submit' && <Submit />}
              {actionView === 'checkIn' && <CheckInNew />}
              {actionView === 'checkOut' && <CheckOutNew />}
              {actionView === 'splitIt' && <SplitPotNew />}
              {actionView === 'wager' && <WagerNew />}
              {actionView === 'attack' && <AttackNew id={''} />}
              {actionView === 'kickOut' && <KickOutNew id={''} />}
              {actionView === 'buyTicket' && <BuyTicketNew />}
              {actionView === 'exitGame' && <ExitGameNew />}
            </div>

            {/* <div className="flex flex-col px-5">
              <a href={DOCS_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Docs
                </Button>
              </a>
              <a href={TWITTER_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Follow
                </Button>
              </a>
              <a href={TELEGRAM_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Community
                </Button>
              </a>
              <a href={BLOG_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Blog
                </Button>
              </a>
            </div> */}
          </div>

          <div
            className={cn(
              isCarouselVisible ? '' : 'border-transparent',
              'fixed bottom-0 w-full h-10 container-last border-l-0 border-r-0 border-b-0 bg-opacity-100 dark:bg-opacity-100',
            )}
          >
            <div className="relative">
              <div className="grid grid-cols-5">
                <button
                  className="flex flex-col rounded-none justify-center items-center py-2"
                  onClick={() => selectMenuComponent('you')}
                >
                  {menuComponent === 'you' && <User size={24} strokeWidth={3} />}
                  {menuComponent !== 'you' && <User size={24} />}

                  {/* <div className="">You</div> */}
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectMenuComponent('list')}
                >
                  {menuComponent === 'list' && <Users size={24} strokeWidth={3} />}
                  {menuComponent !== 'list' && <Users size={24} />}

                  {/* <div className="">List</div> */}
                </button>
                <div></div>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectMenuComponent('events')}
                >
                  {menuComponent === 'events' && <Rss size={24} strokeWidth={3} />}
                  {menuComponent !== 'events' && <Rss size={24} />}
                  {/* <div className="">Events</div> */}
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectMenuComponent('menu')}
                >
                  {menuComponent === 'menu' && <Menu size={24} strokeWidth={3} />}
                  {menuComponent !== 'menu' && <Menu size={24} />}

                  {/* <div className="">Menu</div> */}
                </button>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button
                className={cn(
                  isCarouselVisible ? 'bg-slate-100 dark:bg-slate-600' : 'border-none',
                  'flex flex-col justify-center items-center rounded-full p-2 container-last bg-opacity-100 dark:bg-opacity-100',
                )}
                onClick={toggleCarousel}
              >
                {isCarouselVisible ? (
                  <Move size={40} strokeWidth={1.5} />
                ) : (
                  <Move size={36} strokeWidth={1} />
                )}
                {/* <div className="">Actions</div> */}
              </button>
            </div>
          </div>

          {isCarouselVisible && (
            <div className="fixed bottom-10 w-full bg-slate-100 dark:bg-slate-600 container-last border-none bg-opacity-100 dark:bg-opacity-100 px-2 pt-1">
              <div className="flex gap-4">
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('submit')}
                >
                  <User size={24} />
                  <div className="">Submit</div>
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('checkIn')}
                >
                  <User size={24} />
                  <div className="">Check In</div>
                </button>
                {/* <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('checkOut')}
                >
                  <User size={24} />
                  <div className="">Check Out</div>
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('splitIt')}
                >
                  <User size={24} />
                  <div className="">Split</div>
                </button> */}
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('wager')}
                >
                  <User size={24} />
                  <div className="">Wager</div>
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('buyTicket')}
                >
                  <User size={24} />
                  <div className="">Buy</div>
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('exitGame')}
                >
                  <User size={24} />
                  <div className="">Exit</div>
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('attack')}
                >
                  <User size={24} />
                  <div className="">Attack</div>
                </button>
                <button
                  className="flex flex-col justify-center items-center"
                  onClick={() => selectAction('kickOut')}
                >
                  <User size={24} />
                  <div className="">Kick Out</div>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {authenticated && !xs && (
        <>
          <div className="text-center">
            <Title />
          </div>
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:items-end px-5 pb-2 my-2">
            <Round />
            <Countdown />
            <Indicator />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-4 container-last w-min mx-auto">
              <GameTab />
            </div>

            <div className="">
              <TicketList />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
