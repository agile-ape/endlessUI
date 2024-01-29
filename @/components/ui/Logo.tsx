import React, { useState } from 'react'
import type { MouseEventHandler, FC } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import localFont from 'next/font/local'
import { cn } from '@/lib/utils'
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
  const [handleHover, setHandleHover] = useState<boolean>(false)

  const handleOnMouseEnter: MouseEventHandler = () => {
    setHandleHover(true)
  }

  const handleOnMouseLeave: MouseEventHandler = () => {
    setHandleHover(false)
  }

  return (
    <>
      <Link
        className="cursor-pointer"
        href="/"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <div
          // onClick={() => console.log('last')}
          // onMouseOver={handleHover}
          // onMouseLeave={handleLeave}
          className="h-12 rounded-md
              px-2 py-0 text-[34px] font-headline
              text-black \
              drop-shadow-glow-lg-yellow-300
              bg-[#FCFC03] hover:bg-blue-700
              transition-colors capitalized relative z-10
            "
        >
          last
          <div className={cn(handleHover ? '-right-10' : 'hidden', 'absolute top-0 z-4')}>
            <Image
              priority
              src="/faces/stareSq.png"
              className=""
              height={20}
              width={40}
              alt="pepe-stare"
            />
          </div>
        </div>
      </Link>
    </>
  )
}
