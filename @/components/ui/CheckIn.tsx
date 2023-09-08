import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { TriangleRightIcon } from '@radix-ui/react-icons'
import { TriangleDownIcon } from '@radix-ui/react-icons'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { HelpCircle } from 'lucide-react'
import type { IApp } from 'types/app'

import type { FC } from 'react'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

import React, { useState } from 'react'
import OtpInput from 'react-otp-input'
// import { useTheme } from 'next-themes';

type Props = {
  onSubmit: (input: string) => Promise<void>
}

function CheckInBox({ onSubmit }: Props) {
  // const [open, setOpen] = React.useState(true);
  const [otpInput, setOtpInput] = useState<string>()
  // const [isOpen, setIsOpen] = useState(!disabled)
  // const { theme } = useTheme();
  // outer box - #209902]
  // innter box - [#54B060]
  return (
    <details
      className="
      group w-[220px] rounded-xl
      cursor-pointer
      bg-green-700 flex flex-col mx-auto"
      open
    >
      <summary
        className="mb-1 flex justify-between flex-wrap items-center
        focus-visible:outline-none focus-visible:ring
        rounded group-open:rounded-b-none group-open:z-[1] relative
        px-3 py-1"
      >
        <div className="flex gap-2">
          <div className="text-2xl capitalize text-white">Check in</div>

          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                {/* <QuestionMarkCircledIcon className="w-[20px] h-[20px] text-white" /> */}
                <HelpCircle size={24} className="stroke-slate-100" />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                  Enter the 4-letter keyword of the day to stay in the game. Keyword can be found on{' '}
                  <Link href="https://twitter.com/home">
                    <a className="text-blue-500 underline"> Twitter/X</a>{' '}
                  </Link>
                  or on{' '}
                  <Link href="https://twitter.com/home">
                    {' '}
                    <a className="text-blue-500 underline">Telegram</a>{' '}
                  </Link>{' '}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className="border-8 border-transparent border-l-white ml-2 group-open:ml-5 group-open:mb-1
            group-open:rotate-90 transition-transform origin-left
            "
        ></div>
      </summary>

      <div
        className="
          m-4 mt-0
          rounded-xl py-3 px-3
          bg-green-600
          capitalize text-center text-white
          flex flex-col gap-5"
      >
        <p className="text-xl">Enter keyword</p>

        <OtpInput
          value={otpInput}
          onChange={setOtpInput}
          numInputs={4}
          inputStyle={{
            width: '90%',
            height: '50px',
            // color: theme === 'light' ? 'black' : 'white',
            borderRadius: '12px',
            margin: '0 auto',
            fontSize: '36px',
          }}
          placeholder="****"
          className="dark:text-white text-black"
        />

        <Button
          variant="submit"
          size="lg"
          onClick={async () => {
            if (otpInput) {
              await onSubmit(otpInput)
              setOtpInput('')
            }
          }}
        >
          Submit
        </Button>
      </div>
    </details>
  )
}

export default CheckInBox
