import React, { useState } from 'react'
import Link from 'next/link'
import localFont from 'next/font/local'
import Round from '../ui/Round'
import Countdown from '../ui/Countdown'
import Indicator from '../ui/Indicator'
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
import { LogIn, ChevronUp, ChevronDown, AlertTriangle, AlertCircle } from 'lucide-react'

const headlineFont = localFont({
  src: '../../../public/fonts/headline.ttf',
  display: 'swap',
  // fallback: ['sans-serif'],
})
export default function Logo() {
  // const [buttonText, setButtonText] = useState('last')

  // const handleHover = () => {
  //   setButtonText('man')
  // }

  // const handleLeave = () => {
  //   setButtonText('last')
  // }

  return (
    <>
      {/* {xs && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex flex-col justify-center items-center relative">
              <button
                className="rounded-md
              px-2 pb-1 text-[24px] font-headline
              text-white bg-red-800 capitalized
              "
              >
                {buttonText}
              </button>
              <ChevronDown
                className="absolute mt-1 bottom-0 animate-pulse text-white rounded-full"
                size={14}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="px-8 bg-opacity-100 dark:bg-opacity-100 container-last flex flex-col gap-2 justify-center"
          >
            <Round />
            <Countdown />
            <Indicator />
          </DropdownMenuContent>
        </DropdownMenu>
      )} */}

      {/* <div
        className="sm:hidden rounded-md
            px-2 text-[26px] font-headline
            text-white bg-red-800 capitalized
          "
      >
        last
      </div> */}

      <Link className="cursor-pointer" href="/">
        <div
          // onClick={() => console.log('last')}
          // onMouseOver={handleHover}
          // onMouseLeave={handleLeave}
          className="h-12 rounded-md
              px-2 py-0 text-[34px] font-headline
              text-white bg-red-800 hover:bg-red-700
              transition-colors capitalized
            "
        >
          last
        </div>
      </Link>
    </>
  )
}
