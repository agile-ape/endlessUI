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
  src: '../../../public/fonts/typo.otf',
  display: 'swap',
  // fallback: ['sans-serif'],
})

export default function Logo() {
  // const [handleHover, setHandleHover] = useState<boolean>(false)
  // const handleOnMouseEnter: MouseEventHandler = () => {
  //   setHandleHover(true)
  // }
  // const handleOnMouseLeave: MouseEventHandler = () => {
  //   setHandleHover(false)
  // }

  const [isAlarmOn, setAlarm] = useState<boolean>(false)

  const toggleAlarm = () => {
    setAlarm(!isAlarmOn)
  }

  const refreshPage = () => {
    location.reload()
  }

  return (
    <>
      {/* <div className="relative p-1 m-1 bg-[#39402e] rounded-md"> */}
      <button
        onClick={refreshPage}
        className="rounded-md px-2 py-0 text-[32px] h-12 bg-[#404833] shadow-sm text-[#FCFDC7] \
          capitalized font-digit cursor-default"
      >
        last
      </button>
      {/* <div
          className={cn(
            isAlarmOn ? '-top-1' : '-top-2',
            'absolute bg-[#FCFDC7] w-6 h-3 p-1 rounded-sm',
          )}
        ></div> */}
      {/* </div> */}

      {/* <div
        className={`${
          handleHover ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000 ease-in-out absolute h-12 w-16 rounded-md px-2 py-0 punk-last`}
      >
        <Image priority src="/7959.png" className="" height={20} width={40} alt="punk7959" />
      </div> */}

      {/* <div className={cn(handleHover ? '' : 'hidden', ' punk-last absolute top-0 z-4')}>
            <Image
              priority
              src="/7959.png"
              className="duration-1000"
              height={20}
              width={40}
              alt="punk7959"
            />
          </div> */}
    </>
  )
}
