import type { FC } from 'react'

import Link from 'next/link'
import { Split, AlertTriangle, AlertCircle } from 'lucide-react'
import { DOCS_URL } from '../../../services/constant'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type PromptType = {
  docLink: string
}

const Prompt: FC<PromptType> = ({ docLink }) => {
  return (
    <div className="mt-1 flex">
      {/* <div className="w-[100%] flex rounded-lg py-2 px-3 text-xl leading-tight border border-lime-800 dark:border-lime-200 text-lime-800 dark:text-lime-200">
        <AlertCircle size={24} className="align-top mr-2"></AlertCircle>
        <span>
          This action is not available to you right now.{' '}
          <a href={docLink} target="_blank" className="underline">
            Learn more
          </a>
        </span>
      </div> */}
      <AlertCircle
        size={24}
        className="align-top mr-2 text-gray-500 dark:text-gray-200"
      ></AlertCircle>
      <span className="link h6-last align-top">
        <a href={docLink} target="_blank" className="">
          Not available -- Learn more
        </a>
      </span>
      {/* <span className="hidden sm:inline sm:flex sm:justify-center sm:items-center">
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger className="flex">
              <AlertCircle size={24} className="align-top mr-2"></AlertCircle>
              Not available
              <a href={docLink} target="_blank" className="underline">
                {' '}
                Learn more
              </a>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                This action is not available to you right now.{' '}
                <a href={docLink} target="_blank" className="underline">
                  Learn more
                </a>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
      <span className="sm:hidden flex justify-center items-center">
        <Popover>
          <PopoverTrigger className="flex">
            <AlertCircle size={24} className="align-top mr-2"></AlertCircle>
            Not available
          </PopoverTrigger>
          <PopoverContent side="top" align="center">
            <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
              This action is not available to you right now.{' '}
              <a href={docLink} target="_blank" className="underline">
                Learn more
              </a>
            </p>
          </PopoverContent>
        </Popover>
      </span> */}
    </div>
  )
}

export default Prompt
