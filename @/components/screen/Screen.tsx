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
import TokenNew from '../ui/TokenNew'
import PhaseChangeNew from '../ui/PhaseChangeNew'

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
import { fetcher, transformPlayerTicket, statusPayload } from '@/lib/utils'
import { disconnect } from 'process'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { toast } from '@/components/ui/use-toast'
import { useTheme } from 'next-themes'
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
  Send,
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
  | 'changePhase'
type CategoryType = 'start' | 'day' | 'night' | 'players'
import type { Ticket } from 'types/app'
import { socket } from '@/lib/socket'

type MobileActionType = {
  label: string
  lightIcon: string
  darkIcon: string
  mobileAction: ActionType
  category: CategoryType
}

const arrayMobileAction: MobileActionType[] = [
  {
    label: 'Submit',
    lightIcon: 'submitLight.svg',
    darkIcon: 'submitNight.svg',
    mobileAction: 'submit',
    category: 'day',
  },
  {
    label: 'Exit',
    lightIcon: 'exitLight.svg',
    darkIcon: 'exitNight.svg',
    mobileAction: 'exitGame',
    category: 'day',
  },
  {
    label: 'Checkin',
    lightIcon: 'checkInLight.svg',
    darkIcon: 'checkInNight.svg',
    mobileAction: 'checkIn',
    category: 'day',
  },
  {
    label: 'Checkout',
    lightIcon: 'checkOutLight.svg',
    darkIcon: 'checkOutNight.svg',
    mobileAction: 'checkOut',
    category: 'day',
  },
  {
    label: 'Split',
    lightIcon: 'splitLight.svg',
    darkIcon: 'splitNight.svg',
    mobileAction: 'splitIt',
    category: 'day',
  },
  {
    label: 'Attack',
    lightIcon: 'attackLight.svg',
    darkIcon: 'attackNight.svg',
    mobileAction: 'attack',
    category: 'night',
  },
  {
    label: 'Kick Out',
    lightIcon: 'kickLight.svg',
    darkIcon: 'kickNight.svg',
    mobileAction: 'kickOut',
    category: 'night',
  },
  {
    label: 'Buy',
    lightIcon: 'buyLight.svg',
    darkIcon: 'buyNight.svg',
    mobileAction: 'buyTicket',
    category: 'start',
  },
  {
    label: 'Send',
    lightIcon: 'sendLight.svg',
    darkIcon: 'sendNight.svg',
    mobileAction: 'token',
    category: 'players',
  },
  {
    label: 'Phase',
    lightIcon: 'phaseLight.svg',
    darkIcon: 'phaseNight.svg',
    mobileAction: 'changePhase',
    category: 'players',
  },
  {
    label: 'Wager',
    lightIcon: 'betLight.svg',
    darkIcon: 'betNight.svg',
    mobileAction: 'wager',
    category: 'players',
  },
]

const actionColor: Record<string, string> = {
  start: 'text-purple-500 dark:text-purple-300',
  day: 'text-green-600 dark:text-green-300',
  night: 'text-amber-500 dark:text-amber-300',
  players: 'text-blue-600 dark:text-blue-300',
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
  const [expanded, setExpanded] = useState(false)

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
    contractAddress: LAST_MAN_STANDING_ADDRESS,
  }

  const id = ticket?.id || 0

  return (
    <div className="flex flex-col xl:mx-[100px] pb-8">
      {!authenticated && (
        <div className="mx-auto">
          {xs && (
            <div className="flex justify-center mx-auto py-3">
              <Logo />
            </div>
          )}
          <div className="text-center font-whitrabt">Welcome to Lastman</div>
          <div className="text-center body-last">
            <p className="">Lastman is an onchain game on [Base]</p>
            <p className="">Play, outlast and earn ETH</p>
            <p className="">How long can you last?</p>
          </div>
          <div className="flex place-content-center">
            <div className="relative">
              <Image
                priority
                src="/pepe/sun.svg"
                className="transition-all ease-linear place-self-center animate-pulse"
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

          <div className="flex flex-col gap-4 my-5 justify-center items-center z-10">
            <div className="w-[70%] bg-indigo-300 dark:bg-indigo-300 rounded-xl ">
              <Button
                onClick={enter}
                variant="main"
                className={`${
                  isPressed ? '-translate-y-0' : '-translate-y-1'
                } h-10 w-[100%] hover:-translate-y-2 active:-translate-y-1 border-none rounded-xl px-4 py-2 text-md font-whitrabt`}
              >
                Enter Game
              </Button>
            </div>
            {!xs && (
              <>
                {/* <Button
                  onClick={enter}
                  variant="secondary"
                  className={`${
                    isPressed ? '-translate-y-0' : '-translate-y-1'
                  } h-10 w-[80%] hover:-translate-y-2 hover:brightness-200 active:-translate-y-1 active: duration-75 rounded-xl px-4 py-2 text-md font-whitrabt`}
                >
                  Play on mobile
                </Button> */}

                {/* <Popover>
                  <PopoverTrigger className="flex w-[80%]">
                    <Button
                      variant="secondary"
                      className={`${
                        isPressed ? '-translate-y-0' : '-translate-y-1'
                      } h-10 w-[100%] hover:-translate-y-2 hover:brightness-200 active:-translate-y-1 active: duration-75 rounded-xl px-4 py-2 text-md font-whitrabt`}
                    >
                      Play on mobile
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" align="center">
                    <p className="px-3 py-1.5 text-xl cursor-default">
                      Visit lastman.xyz on mobile to install the app
                    </p>
                  </PopoverContent>
                </Popover> */}

                <div className="flex flex-col justify-center items-center w-[80%] rounded-xl px-4 py-2 container-last">
                  <p className="h1-last">Play on mobile</p>
                  <p className="body-last">Visit lastman.xyz on mobile to install the app.</p>
                </div>
              </>
            )}

            {xs && (
              <div className="flex flex-col justify-center items-center w-[80%] rounded-xl px-4 py-2 container-last">
                <p className="h1-last">Add to Home Screen</p>
                <p className="body-last">To install app, add this website to your home screen.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* style a box to hold all the various component renders */}
      {authenticated && xs && (
        <>
          <div className="flex flex-col">
            <div className="sticky top-0 container-last border-none bg-opacity-50 dark:bg-opacity-50 flex flex-col border-b pb-1 border-zinc-400 dark:border-zinc-200">
              <div className="flex justify-between mx-5 pt-3">
                {/* <div className="grid grid-cols-3 mx-5 py-3"> */}
                <div className="float-left">
                  <Logo />
                </div>
                <div className="float-right">
                  <Indicator />
                </div>
              </div>

              <div className="mt-2 text-center">
                <Title />
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
              {/* <div className="text-center">
                <Title />
              </div> */}
              {menuComponent === 'you' && (
                <>
                  <div className="h1-last text-center">You</div>
                  <TicketUI
                    ownTicket={true}
                    ticketNumber={id}
                    ticket={ticket}
                    // ticketLookInput={'beforePurchase'}
                  />
                  <div className="flex justify-center items-center ">
                    {id === 0 && (phase === 'deployed' || phase === 'start') && (
                      <Button
                        variant="enter"
                        className="rounded-full px-10 py-1 leading-10 h-12 mt-4 mb-2 text-2xl"
                        onClick={() => buyTicketAction()}
                      >
                        Buy Ticket
                      </Button>
                    )}
                    {id !== 0 && (
                      <Button
                        variant="exit"
                        className="rounded-full px-10 py-1 leading-10 h-12 mt-4 mb-2 text-2xl"
                        onClick={() => exitGameAction()}
                      >
                        {ticketStatusString !== 'exited' && <div>Exit and claim ETH</div>}
                        {ticketStatusString === 'exited' && <div>You have exited</div>}
                      </Button>
                    )}
                    {id === 0 && !(phase === 'deployed' || phase === 'start') && (
                      <Button
                        variant="wager"
                        className="rounded-full px-10 py-1 leading-10 h-12 my-4 text-2xl"
                        onClick={() => wagerAction()}
                      >
                        Ending?
                      </Button>
                    )}
                  </div>

                  <DashboardNew />
                </>
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
                <>
                  <div className="h1-last text-center">Links</div>

                  <div className="h1-last flex flex-col px-5 mt-4">
                    <a href={DOCS_URL} target="_blank">
                      <div className="flex flex-col mb-4">
                        <p className="h2-last flex items-center text-indigo-700 dark:text-indigo-300">
                          How To Play{' '}
                          <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Learn more about game play</p>
                      </div>
                    </a>
                    <a href={TWITTER_URL} target="_blank">
                      <div className="flex flex-col mb-4">
                        <p className="h2-last flex items-center text-indigo-700 dark:text-indigo-300">
                          Follow <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Follow us for updates (and memes)</p>
                      </div>
                    </a>
                    <a href={TELEGRAM_URL} target="_blank">
                      <div className="flex flex-col mb-4">
                        <p className="h2-last flex items-center text-indigo-700 dark:text-indigo-300">
                          Community <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Join the community</p>
                      </div>
                    </a>
                    <a href={BLOG_URL} target="_blank">
                      <div className="flex flex-col mb-4">
                        <p className="h2-last flex items-center text-indigo-700 dark:text-indigo-300">
                          Blog <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>{' '}
                        </p>
                        <p className="body-last">Read about our latest progress</p>
                      </div>
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
              {actionView === 'changePhase' && <PhaseChangeNew />}
            </div>
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
            <div className="fixed bottom-10 w-full bg-slate-100 dark:bg-slate-600 border-none bg-opacity-100 dark:bg-opacity-100">
              <Carousel className="w-full max-w-xs mx-auto">
                <CarouselContent className="">
                  {arrayMobileAction.map((action, index) => (
                    <CarouselItem key={index} className="basis-1/4 justify-items-center">
                      {/* <div className="p-1 mx-auto"> */}
                      <div className="flex justify-center mx-auto">
                        <button
                          className={cn(
                            actionColor[action.category],
                            actionView === action.mobileAction
                              ? 'border-2 bg-slate-200 dark:bg-slate-800 border-indigo-700 bg-opacity-100 dark:bg-opacity-100 shadow-lg text-lg'
                              : '',
                            'w-16 h-16 flex flex-col justify-center items-center rounded-lg',
                          )}
                          onClick={() => selectAction(arrayMobileAction[index].mobileAction)}
                        >
                          <Image
                            priority
                            src={
                              forcedTheme === 'light'
                                ? `/icon/${action.lightIcon}`
                                : `/icon/${action.darkIcon}`
                            }
                            className="place-self-center rounded-xl"
                            height={30}
                            width={actionView === action.mobileAction ? 35 : 30}
                            alt="attack-player"
                          />

                          <div className="whitespace-nowrap">{action.label}</div>
                        </button>
                      </div>
                      {/* </div> */}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="h-6 w-6 -left-[20px]" />
                <CarouselNext className="h-6 w-6 -right-[20px]" />
              </Carousel>
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

            <div className="grow rounded-xl py-2 sm:container-last">
              <TicketList />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
