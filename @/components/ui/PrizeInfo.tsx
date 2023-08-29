import React from 'react'
import type { FC } from 'react'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import AllPrize from './AllPrize'
import PrizeAmount from './PrizeAmount'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'

interface PrizeInfoType {
  display: string
}

const titleWording = {
  total: 'Total Prize Pool', // beginnings, countdown
  redeem: 'Next Claim', // day
  win: 'LastMan Wins', // snow
  bounty: 'Assasin Collects', // night
}

type TitleWordingVariants = {
  total: string
  redeem: string
  win: string
  bounty: string
}

const PrizeInfo: FC<PrizeInfoType> = ({ display }) => {
  return (
    <div
      className="text-center bg-[#F6F6F6] dark:bg-[#1C1C1C]
    border border-[#EBEBEB] dark:border-[#444242]
    flex flex-col items-center w-[220px] mx-auto rounded-lg p-2"
    >
      <div className="flex justify-center items-center gap-2">
        <p className="text-[20px]"> {titleWording[display as keyof TitleWordingVariants]} </p>

        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <QuestionMarkCircledIcon className="w-[20px] h-[20px]" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <AllPrize />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <h2 className="text-[32px] flex">
        <PrizeAmount amount="1.128" category={display} logoHeight={24} />
        <Image
          priority
          src={`/icon/ether.svg`}
          style={{ marginLeft: '1px' }}
          height={14}
          width={14}
          alt="ether"
        />
      </h2>
    </div>
  )
}

export default PrizeInfo
