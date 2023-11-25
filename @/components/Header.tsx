import Image from 'next/image'
import CustomConnectButton from '@/components/ui/connect-button'
import Menu from './_Menu'
import Logo from './ui/Logo'
import SideMenu from './SideMenu'
import DarkModeSwitcher from './ui/_DarkModeSwitcher'
import { Button } from './ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Token from './ui/Token'
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
import { useAccount } from 'wagmi'
import CompletionModal from './ui/CompletionModal'
import { cn } from '@/lib/utils'
import { DOCS_URL, TWITTER_URL, TELEGRAM_URL } from '../../services/constant'
import { useRouter } from 'next/router'

function Header() {
  const { isConnected } = useAccount()

  const router = useRouter()

  const isActive = (href: string) => {
    return router.pathname === href
  }

  return (
    <div className="grid grid-cols-2 gap-2 items-center py-3 px-5">
      <div className="flex justify-start order-1">
        <Link className="cursor-pointer" href="/">
          <Logo />
        </Link>
      </div>

      {/* <div className="hidden xl:block order-2 flex justify-self-center">
        <Menu />
      </div> */}

      <div className="flex justify-self-end gap-3 order-3">
        <div className="flex justify-self-end xl:hidden order-4">
          <SideMenu />
        </div>
        <div className="hidden xl:flex items-center">
          {/* custom styling */}
          {/* border border-white/40 rounded-md */}
          {/* <Link
            className={cn(
              `px-2 text-xl text-zinc-700 dark:text-zinc-200 hover:underline hover:text-neutral-900 dark:hover:text-zinc-50 py-1 px-3 mx-2 flex items-center`,
              isActive('/quickstart') && 'underline', //example of active class link
            )}
            href="/quickstart"
          >
            Quickstart
          </Link> */}
          <a href={DOCS_URL} target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Quickstart <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <a href={TWITTER_URL} target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Follow <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          <a href={TELEGRAM_URL} target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Community <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a>
          {/* <a href="https://twitter.com/fachryadhitya" target="_blank">
            <Button variant="link" className="px-2 text-lg" size="sm">
              Learn <ExternalLink size={16} className="text-sm ml-1"></ExternalLink>
            </Button>
          </a> */}
        </div>

        {isConnected ? (
          //       <DropdownMenu>
          //         <DropdownMenuTrigger>
          //           {/* <Button
          //             // variant="token"
          //             style={{
          //               backgroundImage: `url('/ticket/rainbow.svg')`, // different for true
          //               backgroundRepeat: 'no-repeat',
          //               backgroundSize: 'cover',
          //             }}
          //             className="h-10 rounded-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-whitrabt"
          //           > */}
          //           <div className="flex justify-center items-center border border-transparent rounded-full px-2 sm:px-3 py-0 sm:py-1 text-xs sm:text-sm hover:border-zinc-300">
          //             <Image
          //               priority
          //               src="/logo/token.svg"
          //               height={18}
          //               width={24}
          //               alt="$last token"
          //               className="shrink-0 inline mr-2"
          //             />
          //             <span className="font-whitrabt">200</span>
          //           </div>
          //           {/* </Button> */}
          //           {/* <div
          //   className={`flex flex-col mx-auto relative justify-center border border-blue-950 ${size} ${edge}`}
          //   style={{
          //     backgroundImage: `url('/ticket/${bgImage}.svg')`, // different for true
          //     backgroundRepeat: 'no-repeat',
          //     backgroundSize: 'cover',
          //   }}
          //   onMouseEnter={handleOnMouseEnter}
          //   onMouseLeave={handleOnMouseLeave}
          // > */}
          //         </DropdownMenuTrigger>
          //         {/* <DropdownMenuContent
          //           align="end"
          //           className="bg-opacity-100 dark:bg-opacity-100 container-last flex flex-col justify-center"
          //         >
          //           <a
          //             href="https://app.uniswap.org/"
          //             target="_blank"
          //             rel="noreferrer"
          //             className="flex mx-2 text-xl items-center"
          //           >
          //             <p className="mr-1">$LAST:</p>
          //             <p className="mr-1">123</p>
          //             <Image
          //               priority
          //               src="/logo/token.svg"
          //               height={32}
          //               width={32}
          //               alt="game logo"
          //               className="shrink-0 inline mr-2"
          //             />
          //           </a>
          //           <Button variant="destructive">$LAST</Button>
          //         </DropdownMenuContent> */}
          //         <DropdownMenuContent
          //           align="end"
          //           className="bg-opacity-100 dark:bg-opacity-100 border border-black dark:border-white container-last rounded-xl flex flex-col justify-center w-[12rem] p-4"
          //         >
          //           <a
          //             href="https://app.uniswap.org/"
          //             target="_blank"
          //             rel="noreferrer"
          //             className="w-full mb-4"
          //           >
          //             <Button variant="buy" className="w-full bg-blue-950">
          //               Buy from Uniswap
          //             </Button>
          //           </a>

          //           {/* <hr /> */}
          //           <div className="text-blue-200">
          //             <div className="text-left pb-0 mb-0">Transfer tokens </div>
          //             <div className="rounded-lg p-2 border bg-blue-950">
          //               <div className="flex justify-between my-1">
          //                 <p>Player</p>
          //                 <div className="flex gap-1 items-center">
          //                   <p>#</p>
          //                   <input
          //                     type="text"
          //                     name=""
          //                     id=""
          //                     className="w-[2rem] rounded-md border border-blue-200 px-1 text-center"
          //                   />
          //                 </div>
          //               </div>
          //               <div className="flex justify-between">
          //                 <p>Tokens</p>
          //                 <input
          //                   type="text"
          //                   name=""
          //                   id=""
          //                   className="w-[2rem] rounded-md border border-blue-200 px-1 text-center"
          //                 />
          //               </div>
          //               <Button variant="transfer" className="w-full h-8 px-4 mt-2 py-2">
          //                 Transfer
          //               </Button>
          //             </div>
          //           </div>
          //         </DropdownMenuContent>
          //       </DropdownMenu>

          <Token />
        ) : null}
        <div className="hidden xl:flex">
          <CustomConnectButton />
        </div>
      </div>
    </div>
  )
}

export default Header
