import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TriangleRightIcon } from '@radix-ui/react-icons';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
// import { useTheme } from 'next-themes';

function CheckInBox() {
  // const [open, setOpen] = React.useState(true);
  const [otpInput, setOtpInput] = useState<string>();
  // const { theme } = useTheme();

  return (
    <details
      className="
      group w-[327px] border-[1px] border-[#084E0B] rounded-xl
      cursor-pointer
      bg-[#209902] flex flex-col mx-auto"
      open
    >
      <summary
        className="mb-1 flex justify-between flex-wrap items-center
        focus-visible:outline-none focus-visible:ring
        rounded group-open:rounded-b-none group-open:z-[1] relative
        px-4 py-3"
      >
        <div className="flex gap-2">
          <div className="text-2xl capitalize text-white">Check in</div>

          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger>
                <QuestionMarkCircledIcon className="w-[20px] h-[20px] text-white" />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
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
          rounded-xl py-[16px] px-[24px]
          bg-[#54B060]
          capitalize text-center text-white
          flex flex-col gap-4"
      >
        <p className="text-xl">Enter keyword</p>

        <OtpInput
          value={otpInput}
          onChange={setOtpInput}
          numInputs={4}
          inputStyle={{
            width: '80%',
            height: '60px',
            // color: theme === 'light' ? 'black' : 'white',
            borderRadius: '12px',
            margin: '0 auto',
            fontSize: '36px',
          }}
          placeholder="****"
          className="dark:text-white text-black"
        />

        <Button className="text-lg dark:text-white dark:bg-grey-200">Submit</Button>
      </div>
    </details>
  );
}

export default CheckInBox;
