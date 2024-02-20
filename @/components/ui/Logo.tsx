import React, { useState } from 'react'
import type { MouseEventHandler, FC } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import localFont from 'next/font/local'
import { cn } from '@/lib/utils'

type LogoType = {
  isMenu?: boolean
}
const Logo: FC<LogoType> = ({ isMenu }) => {
  const [alarmState, setAlarmState] = useState<string>('default')

  const handleOnMouseEnter: MouseEventHandler = () => {
    setAlarmState('ready')
  }
  const handleOnMouseLeave: MouseEventHandler = () => {
    setAlarmState('default')
  }

  const handleOnMouseDown: MouseEventHandler = () => {
    setAlarmState('go')
    location.reload()
  }

  return (
    <>
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onMouseDown={handleOnMouseDown}
        // onClick={handleOnMouseDown}
        className="relative h-12 w-24 sm:h-10 sm:w-20 cursor-pointer m-2"
      >
        {/* display */}
        <div
          className={cn(
            'rounded-md \
            py-4 sm:py-0 \
        text-[36px] sm:text-[28px] \
        bg-[#404833] shadow-sm text-[#FCFDC7] \
        capitalized font-digit \
        border border-[#11140C] text-center',
            alarmState === 'ready'
              ? ''
              : alarmState === 'go'
                ? 'border-[#FCFC03] text-[#FCFC03]'
                : '',
            isMenu ? 'py-0' : '',
          )}
        >
          {alarmState === 'default' ? 'last' : alarmState === 'ready' ? 'blast' : 'off'}
        </div>

        {/* button + stem */}
        <div
          className={cn(
            'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full \
            flex flex-col justify-center items-center',
            alarmState === 'ready' ? '' : alarmState === 'go' ? '' : '',
          )}
        >
          {/* button */}
          <div
            className={cn(
              'bg-[#404833] z-[5] border border-[#11140C] w-6 h-2 rounded-[0.125rem]',
              alarmState === 'ready' ? '' : alarmState === 'go' ? 'border-[#FCFC03]' : '',
            )}
          ></div>
          {/* stem */}
          <div
            className={cn(
              'bg-[#404833] z-[10] border border-[#11140C] border-t-0 border-b-0 w-2 h-[2px]',
              alarmState === 'ready'
                ? 'h-[6px]'
                : alarmState === 'go'
                  ? 'h-[0px] border-[#FCFC03]'
                  : '',
            )}
          ></div>
        </div>
      </div>
    </>
  )
}

export default Logo
