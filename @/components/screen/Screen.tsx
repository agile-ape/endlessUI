import React, { useRef, useState, useEffect } from 'react'
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
import TokenNew from '../ui/TokenNew'
import PhaseChangeNew from '../ui/PhaseChangeNew'
import AdminNew from '../ui/AdminNew'
import PWADrawer from '../ui/PWADrawer'

import BuyTicketNew from '../ui/BuyTicketNew'

import DashboardNew from '../ui/DashboardNew'
import ExitGameNew from '../ui/ExitGameNew'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ExternalLink } from 'lucide-react'
import {
  scrollToTop,
  scrollToBottom,
  fetcher,
  transformPlayerTicket,
  statusPayload,
} from '@/lib/utils'
import { disconnect } from 'process'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

import { useTheme } from 'next-themes'
import {
  GAME_ADDRESS,
  GAMEMASTER_ADDRESS,
  DOCS_URL,
  TWITTER_URL,
  TELEGRAM_URL,
  BLOG_URL,
  ADMIN_ADDRESSES,
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
  DoorOpen,
  Ticket as Ticket2,
  Sword,
  Sparkle,
  Hexagon,
  RefreshCw,
  ChevronsRight,
  Axe,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

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
  | 'token'
  | 'admin'
  | 'phaseChange'
type CategoryType =
  | 'submit'
  | 'checkIn'
  | 'checkOut'
  | 'splitIt'
  | 'wager'
  | 'attack'
  | 'kickOut'
  | 'buyTicket'
  | 'exitGame'
  | 'token'
  | 'admin'
  | 'phaseChange'
import type { Ticket } from 'types/app'
import { socket } from '@/lib/socket'
import is from 'date-fns/esm/locale/is/index.js'

type MobileActionType = {
  label: string
  // lightIcon: string
  // darkIcon: string
  mobileAction: ActionType
  category: CategoryType
}

const arrayMobileAction: MobileActionType[] = [
  {
    label: 'Submit',
    // lightIcon: 'submitLight.svg',
    // darkIcon: 'submitNight.svg',
    mobileAction: 'submit',
    category: 'submit',
  },
  {
    label: 'Split',
    // lightIcon: 'splitLight.svg',
    // darkIcon: 'splitNight.svg',
    mobileAction: 'splitIt',
    category: 'splitIt',
  },
  {
    label: 'Checkin',
    // lightIcon: 'checkInLight.svg',
    // darkIcon: 'checkInNight.svg',
    mobileAction: 'checkIn',
    category: 'checkIn',
  },
  {
    label: 'Checkout',
    // lightIcon: 'checkOutLight.svg',
    // darkIcon: 'checkOutNight.svg',
    mobileAction: 'checkOut',
    category: 'checkOut',
  },
  {
    label: 'Attack',
    // lightIcon: 'attackLight.svg',
    // darkIcon: 'attackNight.svg',
    mobileAction: 'attack',
    category: 'attack',
  },
  {
    label: 'Kick Out',
    // lightIcon: 'kickLight.svg',
    // darkIcon: 'kickNight.svg',
    mobileAction: 'kickOut',
    category: 'kickOut',
  },
  {
    label: 'ENTER',
    // lightIcon: 'buyLight.svg',
    // darkIcon: 'buyNight.svg',
    mobileAction: 'buyTicket',
    category: 'buyTicket',
  },
  {
    label: 'EXIT',
    // lightIcon: 'exitLight.svg',
    // darkIcon: 'exitNight.svg',
    mobileAction: 'exitGame',
    category: 'exitGame',
  },
  {
    label: 'Phase',
    // lightIcon: 'phaseLight.svg',
    // darkIcon: 'phaseNight.svg',
    mobileAction: 'phaseChange',
    category: 'phaseChange',
  },
  {
    label: 'Wager',
    // lightIcon: 'betLight.svg',
    // darkIcon: 'betNight.svg',
    mobileAction: 'wager',
    category: 'wager',
  },
  {
    label: 'Send',
    // lightIcon: 'sendLight.svg',
    // darkIcon: 'sendNight.svg',
    mobileAction: 'token',
    category: 'token',
  },
  {
    label: 'Admin',
    // lightIcon: 'betLight.svg',
    // darkIcon: 'betNight.svg',
    mobileAction: 'admin',
    category: 'admin',
  },
]

const actionColor: Record<string, string> = {
  // submit: 'text-green-600 dark:text-green-300 mr-1',
  submit: 'text-green-300 mr-1',
  // splitIt: 'text-amber-400 dark:text-amber-100 mr-1',
  // splitIt: 'text-green-600 dark:text-green-300 mr-1',
  splitIt: 'text-green-300 mr-1',

  // checkIn: 'text-blue-600 dark:text-blue-300 mr-1',
  checkIn: 'text-blue-300 mr-1',
  // checkOut: 'text-blue-400 dark:text-blue-100 mr-1',
  // checkOut: 'text-blue-600 dark:text-blue-300 mr-1',
  checkOut: 'text-blue-300 mr-1',

  // buyTicket: 'text-lime-700 dark:text-lime-400 mr-1',
  buyTicket: 'text-lime-400 mr-1',
  // exitGame: 'text-red-600 dark:text-red-300 mr-1',
  // exitGame: 'text-lime-700 dark:text-lime-400 mr-1',
  exitGame: 'text-lime-400 mr-1',
  // attack: 'text-orange-600 dark:text-orange-300 mr-1',
  attack: 'text-orange-300 mr-1',
  // kickOut: 'text-orange-600 dark:text-orange-300 mr-1',
  kickOut: 'text-orange-300 mr-1',
  // wager: 'text-stone-700 dark:text-stone-400 mr-1',
  wager: 'text-stone-400 mr-1',
  // phaseChange: 'text-purple-700 dark:text-purple-400 mr-1',
  phaseChange: 'text-primary-last mr-1',
  // token: 'text-pink-700 dark:text-pink-400 mr-1',
  token: 'text-pink-400 mr-1',
  // admin: 'text-pink-700 dark:text-pink-400 mr-1',
  admin: 'text-pink-400 mr-1',
}

const iconMapping: { [key: string]: JSX.Element } = {
  // submit: <Send className="text-green-600 dark:text-green-300 mr-1" />,
  submit: <Send className="text-green-300 mr-1" />,
  // splitIt: <Split className="text-amber-400 dark:text-amber-100 mr-1" />,
  // splitIt: <Split className="text-green-600 dark:text-green-300 mr-1" />,
  splitIt: <Split className="text-green-300 mr-1" />,
  // checkIn: <LogIn className="text-blue-600 dark:text-blue-300 mr-1" />,
  checkIn: <LogIn className="text-blue-300 mr-1" />,
  // checkOut: <LogOut className="text-blue-400 dark:text-blue-100 mr-1" />,
  // checkOut: <LogOut className="text-blue-600 dark:text-blue-300 mr-1" />,
  checkOut: <LogOut className="text-blue-300 mr-1" />,

  // buyTicket: <Ticket2 className="text-lime-700 dark:text-lime-400 mr-1" />,
  buyTicket: <Ticket2 className="text-lime-400 mr-1" />,
  // exitGame: <DoorOpen className="text-red-600 dark:text-red-300 mr-1" />,
  // exitGame: <DoorOpen className="text-lime-700 dark:text-lime-400 mr-1" />,
  exitGame: <DoorOpen className="text-lime-400 mr-1" />,

  // attack: <Sword className="text-orange-600 dark:text-orange-300 mr-1" />,
  attack: <Sword className="text-orange-300 mr-1" />,
  // kickOut: <Axe className="text-orange-600 dark:text-orange-300 mr-1" />,
  kickOut: <Axe className="text-orange-300 mr-1" />,
  // wager: <Dices className="text-stone-700 dark:text-stone-400 mr-1" />,
  wager: <Dices className="text-stone-400 mr-1" />,
  // phaseChange: <RefreshCw className="text-purple-700 dark:text-purple-400 mr-1" />,
  phaseChange: <ChevronsRight className="text-primary-last mr-1" />,
  // token: <Gift className="text-pink-700 dark:text-pink-400 mr-1" />,
  token: <Gift className="text-pink-400 mr-1" />,
  // admin: <Sparkle className="text-pink-700 dark:text-pink-400 mr-1" />,
  admin: <Sparkle className="text-pink-400 mr-1" />,
  // dashboard: <Send className="text-green-50 mr-1" />,
}

export default function Screen() {
  const phase = useStoreState((state) => state.phase)

  const { isConnected, address } = useAccount()
  const { user, connectWallet, ready, authenticated } = usePrivy()
  const { xs } = useWindowSize()

  const { forcedTheme } = useTheme()

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

  // Login / Logout
  // const [expanded, setExpanded] = useState<boolean>(() => {
  //   const expanded = localStorage.getItem('expanded')
  //   const result = expanded ? JSON.parse(expanded) : false
  //   return result
  // })

  const [expanded, setExpanded] = useState<boolean>(false)

  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User logged out')
      toast({
        variant: 'destructive',
        // title: 'Keyword updated',
        description: <p>You are logged out. Thanks for visiting.</p>,
      })
    },
  })

  const { login } = useLogin({
    onComplete: () => {
      console.log('User logged in')

      setTimeout(() => {
        socket.connect()
      }, 2000)

      setExpanded(true)
      // localStorage.setItem('expanded', 'true')

      toast({
        variant: 'success',
        // title: 'Keyword updated',
        description: <p>You are logged in.</p>,
      })
    },
  })

  // Custom
  const [isPressed, setIsPressed] = useState(false)

  const buyTicketAction = () => {
    setCarouselVisibility(true)
    selectMenuComponent('actions')
    selectAction('buyTicket')
  }

  const exitGameAction = () => {
    setCarouselVisibility(true)
    selectMenuComponent('actions')
    selectAction('exitGame')
  }

  const wagerAction = () => {
    setCarouselVisibility(true)
    selectMenuComponent('actions')
    selectAction('wager')
  }

  function enter() {
    setIsPressed(true)
    setTimeout(() => {
      setIsPressed(false)
    }, 10)
    login()
  }

  function guest() {
    setExpanded(true)
    // localStorage.setItem('expanded', 'true')
  }

  function pwa() {}

  const [isToggled, setIsToggled] = useState(false)

  const toggleInfo = () => {
    setIsToggled(!isToggled)
  }

  const ownedTicket = useStoreState((state) => state.ownedTicket)
  let ticketStatus = ownedTicket?.status || 0
  const ticketStatusString = statusPayload[ticketStatus] || 'unknown'

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
    contractAddress: GAME_ADDRESS,
  }

  const id = ticket?.id || 0

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(delay)
  }, [])

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setCarouselVisibility(false))

  return (
    <div className="flex flex-col xl:mx-[100px] pb-8">
      {expanded ? (
        isLoading ? (
          <div className="flex flex-col items-center justify-center h-screen space-x-4">
            <Image
              priority
              src="/faces/dance.webp"
              className=""
              height={300}
              width={200}
              alt="dancing-pepe"
            />
            <p className="text-xl digit-last">Connecting to the ether...</p>
          </div>
        ) : xs ? (
          // If on phone
          <div>
            <div className="flex flex-col">
              <button
                onClick={scrollToTop}
                className="sticky top-0 header-last flex flex-col py-2 items-center z-[1]"
              >
                <div className="font-digit text-3xl text-center">
                  {actionView === 'submit' && <p>Submit</p>}
                  {actionView === 'exitGame' && <p>Exit Arena</p>}
                  {actionView === 'checkIn' && <p>Check In</p>}
                  {actionView === 'checkOut' && <p>Check Out</p>}
                  {actionView === 'splitIt' && <p>Split Pot</p>}
                  {actionView === 'attack' && <p>Attack</p>}
                  {actionView === 'kickOut' && <p>Kick Out</p>}
                  {actionView === 'buyTicket' && <p>Enter Arena</p>}
                  {actionView === 'wager' && <p>Place Bet</p>}
                  {actionView === 'phaseChange' && <p>Change Phase</p>}
                  {actionView === 'token' && <p>Send Token</p>}
                  {actionView === 'admin' && <p>Gamemaster</p>}
                  {menuComponent === 'you' && <p>Profile</p>}
                  {menuComponent === 'events' && <p>Feed</p>}
                  {menuComponent === 'list' && <p>Arena</p>}
                  {menuComponent === 'menu' && <p>Links</p>}
                </div>
              </button>

              {/* Viewport */}
              <div className="mt-4 mb-36">
                {menuComponent === 'you' && (
                  <>
                    <div className="mt-2 mb-4 text-center">
                      <Title />
                    </div>
                    <div className="flex justify-center items-center ">
                      {authenticated ? (
                        <div className="flex flex-col justify-center items-center">
                          <TicketUI ticketSize={1} ticketNumber={id} ticket={ticket} />
                          {id === 0 ? (
                            phase === 'deployed' || phase === 'start' ? (
                              <Button
                                variant="enter"
                                className="px-10 py-1 leading-10 h-12 my-4 text-2xl"
                                onClick={() => buyTicketAction()}
                              >
                                ENTER
                              </Button>
                            ) : (
                              <Button
                                variant="wager"
                                className="rounded-full px-10 py-1 leading-10 h-12 my-4 text-2xl"
                                onClick={() => wagerAction()}
                              >
                                Bet Ending
                              </Button>
                            )
                          ) : (
                            <Button
                              variant="exit"
                              className="rounded-full px-10 py-1 leading-10 h-12 my-4 text-2xl"
                              onClick={() => exitGameAction()}
                            >
                              {ticketStatusString !== 'exited' && <div>Exit and claim ETH</div>}
                              {ticketStatusString === 'exited' && <div>You have exited</div>}
                            </Button>
                          )}
                        </div>
                      ) : (
                        // <Button
                        //   variant="enter"
                        //   className="rounded-full px-10 py-1 leading-10 h-12 my-4 text-2xl"
                        //   onClick={() => login()}
                        // >
                        //   Log In
                        // </Button>
                        <div className="flex flex-col">
                          <div className="mb-4">
                            <div className="flex flex-col gap-2 items-center justify-center">
                              {/* <div className="text-xl">Login to join the fun</div> */}
                              <div className="digit-last text-center px-10 py-1 leading-10 h-12 text-2xl">
                                Not logged in
                              </div>
                              <Image
                                priority
                                src={`/faces/eatchips.svg`}
                                height={110}
                                width={150}
                                className={`h-auto mt-0 mb-0`}
                                // layout="fixed"
                                alt={`guest pepe`}
                              />
                              <div className="text-center text-lg underline">
                                <a href={TWITTER_URL} target="_blank">
                                  Follow for updates
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <DashboardNew />
                  </>
                )}

                {menuComponent === 'list' && (
                  <div className="mt-2">
                    <TicketList />
                  </div>
                )}

                {menuComponent === 'events' && (
                  <div className="mt-2 text-xl">
                    <GameFeed />
                  </div>
                )}

                {menuComponent === 'menu' && (
                  <>
                    <div className="h1-last flex flex-col px-5 mt-4">
                      <a
                        href={DOCS_URL}
                        target="_blank"
                        className="flex flex-col mb-4 border py-2 px-4 shadow-xl rounded-xl"
                      >
                        <p className="h2-last flex items-center text-[#404833] dark:text-[#FCFDC7]">
                          How To Play{' '}
                          <ExternalLink size={18} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Learn more about game play</p>
                      </a>
                      <a
                        href={TWITTER_URL}
                        target="_blank"
                        className="flex flex-col mb-4 border py-2 px-4 shadow-xl rounded-xl"
                      >
                        <p className="h2-last flex items-center text-[#404833] dark:text-[#FCFDC7]">
                          Follow <ExternalLink size={18} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Follow us for updates (mostly memes)</p>
                      </a>
                      <a
                        href={TELEGRAM_URL}
                        target="_blank"
                        className="flex flex-col mb-4 border py-2 px-4 shadow-xl rounded-xl"
                      >
                        <p className="h2-last flex items-center text-[#404833] dark:text-[#FCFDC7]">
                          Community <ExternalLink size={18} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Join the community</p>
                      </a>
                      <a
                        href={BLOG_URL}
                        target="_blank"
                        className="flex flex-col mb-4 border py-2 px-4 shadow-xl rounded-xl"
                      >
                        <p className="h2-last flex items-center text-[#404833] dark:text-[#FCFDC7]">
                          Blog <ExternalLink size={18} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Read about our latest progress</p>
                      </a>
                    </div>
                  </>
                )}

                {actionView === 'submit' && <Submit />}
                {actionView === 'checkIn' && <CheckInNew />}
                {actionView === 'checkOut' && <CheckOutNew />}
                {actionView === 'splitIt' && <SplitPotNew />}
                {actionView === 'wager' && <WagerNew />}
                {actionView === 'attack' && <AttackNew />}
                {actionView === 'kickOut' && <KickOutNew />}
                {actionView === 'buyTicket' && <BuyTicketNew />}
                {actionView === 'exitGame' && <ExitGameNew />}
                {actionView === 'token' && <TokenNew />}
                {actionView === 'phaseChange' && <PhaseChangeNew />}
                {actionView === 'admin' && <AdminNew />}
              </div>
            </div>

            {/* Menu */}
            <div
              className={cn(
                isCarouselVisible ? 'border-t-2 border-[#FCFC03]' : 'border-t-2 border-transparent',
                'fixed bottom-0 w-full h-20 header-last',
              )}
            >
              <div className="relative">
                <div className="grid grid-cols-5">
                  <button
                    className="flex flex-col rounded-none justify-center items-center py-2"
                    onClick={() => selectMenuComponent('you')}
                  >
                    {menuComponent === 'you' && <User size={36} strokeWidth={3} />}
                    {menuComponent !== 'you' && <User size={36} />}
                  </button>
                  <button
                    className="flex flex-col justify-center items-center"
                    onClick={() => selectMenuComponent('list')}
                  >
                    {menuComponent === 'list' && <Hexagon size={36} strokeWidth={3} />}
                    {menuComponent !== 'list' && <Hexagon size={36} />}
                  </button>
                  <div></div>
                  <button
                    className="flex flex-col justify-center items-center"
                    onClick={() => selectMenuComponent('events')}
                  >
                    {menuComponent === 'events' && <Rss size={36} strokeWidth={3} />}
                    {menuComponent !== 'events' && <Rss size={36} />}
                  </button>
                  <button
                    className="flex flex-col justify-center items-center"
                    onClick={() => selectMenuComponent('menu')}
                  >
                    {menuComponent === 'menu' && <Menu size={36} strokeWidth={3} />}
                    {menuComponent !== 'menu' && <Menu size={36} />}
                  </button>
                </div>
              </div>
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-[#75835D] rounded-full">
                  <button
                    className={cn(
                      isCarouselVisible
                        ? 'bg-[#11140C] border-2 border-[#FCFC03] text-[#FCFC03] -translate-y-0'
                        : 'border border-[#75835D] -translate-y-1',
                      'flex flex-col justify-center items-center rounded-full p-2 header-last',
                    )}
                    onClick={toggleCarousel}
                  >
                    {isCarouselVisible ? (
                      // <Move size={44} strokeWidth={1.6} />
                      <Move size={40} strokeWidth={1.5} />
                    ) : (
                      <Move size={40} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {isCarouselVisible && (
              <div
                className="fixed bottom-20 w-full bg-gradient-to-l from-[#11140C] to-[#404833] \
              "
              >
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent className="">
                    {arrayMobileAction.map(
                      (action, index) =>
                        index < (ADMIN_ADDRESSES.includes(String(address)) ? 12 : 10) && (
                          <CarouselItem key={index} className="basis-1/4 justify-items-center">
                            <div className="flex items-center justify-center mx-auto">
                              <button
                                className={cn(
                                  actionColor[action.category],
                                  actionView === action.mobileAction
                                    ? 'py-1 border-2 bg-[#11140C] border-[#FCFC03] bg-opacity-100 dark:bg-opacity-100 shadow-lg text-xl'
                                    : 'py-2 text-lg',
                                  'px-3 flex flex-col justify-center items-center rounded-lg',
                                )}
                                onClick={() => selectAction(arrayMobileAction[index].mobileAction)}
                              >
                                {/* <Image
                                    priority
                                    src={
                                      forcedTheme === 'light'
                                        ? `/icon/${action.lightIcon}`
                                        : `/icon/${action.darkIcon}`
                                    }
                                    className="place-self-center rounded-xl"
                                    height={34}
                                    width={actionView === action.mobileAction ? 36 : 34}
                                    alt="player-action"
                                  /> */}
                                {React.cloneElement(iconMapping[action.mobileAction], {
                                  size: actionView === action.mobileAction ? 40 : 36,
                                })}

                                <div className="whitespace-nowrap">{action.label}</div>
                              </button>
                            </div>
                          </CarouselItem>
                        ),
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="h-6 w-6 -left-[20px]" />
                  <CarouselNext className="h-6 w-6 -right-[20px]" />
                </Carousel>
              </div>
            )}

            <div>
              <Popover data-state={isToggled ? 'open' : 'closed'}>
                <PopoverTrigger
                  className={cn(
                    isCarouselVisible ? 'bottom-44 left-1 fixed' : 'bottom-24 left-3 fixed',
                    '',
                  )}
                >
                  <button className="p-2 rounded-full header-last" onClick={() => toggleInfo()}>
                    <Monitor size={isToggled ? 32 : 28}></Monitor>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="end"
                  className="header-last bg-[#9BA885] dark:bg-[#404833] border-2 border-[#FCFC03] dark:border-[#FCFC03]"
                >
                  <div className="flex flex-col gap-2 py-2 px-0">
                    <Indicator />
                    <Round />
                    <div className="flex items-center justify-center">
                      <KeyTrackers />
                    </div>
                    <Countdown />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          // If on desktop
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

              <div className="grow rounded-xl py-2 sm:container-last">
                <TicketList />
              </div>
            </div>
          </>
        )
      ) : (
        <div className="mx-auto">
          <div className="sm:hidden flex justify-center mx-auto py-3">
            <Logo />
          </div>
          <div className="text-center text-4xl font-digit text-[#404833] dark:text-[#FCFC03]">
            Welcome to Lastman
          </div>
          <div className="flex flex-col gap-1 my-2 text-center body-last">
            <p className="">Lastman is battle royale on Blast</p>
            <p className="">Play, yield and outlast</p>
            <p className="">How long can you last?</p>
          </div>
          <div className="relative flex justify-center items-center">
            <Image
              priority
              src="/pepe/portal-welcome.svg"
              className=""
              height={300}
              width={200}
              alt="sneak-a-peek-pepe"
            />
            <div className="absolute bottom-[20px] flex flex-col">
              <Image
                priority
                src="/pepe/sun-welcome.svg"
                className="relative transition-all ease-linear place-self-center animate-pulse"
                height={200}
                width={150}
                alt="sneak-a-peek-pepe"
              />

              <Image
                priority
                src="/pepe/pepe-robe-welcome.svg"
                className="absolute -bottom-[20px]"
                height={300}
                width={200}
                alt="sneak-a-peek-pepe"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 my-5 justify-center items-center z-10">
            <Button
              onClick={enter}
              variant="primary"
              className={`h-12 w-[100%] rounded-xl px-6 py-2 text-2xl font-digit`}
            >
              Log In
            </Button>

            <Button
              onClick={guest}
              variant="primary"
              className={`h-12 w-[100%] rounded-xl px-6 py-2 text-2xl font-digit`}
            >
              Explore
            </Button>

            <Button
              variant="secondary"
              className={`h-12 w-[100%] rounded-xl px-6 py-2 text-2xl font-digit`}
            >
              <PWADrawer />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
