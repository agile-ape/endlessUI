import React, { FC } from 'react'
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

interface PriceAmountType {
  type: string;
  amount: string;
}

const typeWording = {
  'total': "Total Prize",
  'current': "Current Prize",
  'redeem': "Redeem Prize",
  'bounty': "Bounty Amount"
}

type TypeWordingVariants = {
  total: Element;
  current: Element;
  redeem: Element;
  bounty: Element;
}

const typeLogo = {
  'total': "diamond",
  'current': "wallet",
  'redeem': "boxPrice",
  'bounty': "bounty"
}

const PriceAmount: FC<PriceAmountType> = ({ amount, type }) => {
  return (
    <div
      className="bg-[#F6F6F6] dark:bg-[#1C1C1C]
      border border-[#EBEBEB] dark:border-[#444242]
      text-center w-[150px] mx-auto rounded-lg p-[12px]"
    >
      <div className="flex items-center gap-2">
        <p className="font-extralight text-[14px]">{typeWording[type as keyof TypeWordingVariants]}</p>

        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <QuestionMarkCircledIcon className="w-[18px] h-[18px]" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                {typeWording[type as keyof TypeWordingVariants]} of this game.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-center gap-2">
        <Image
          priority
          src={`/logo/${typeLogo[type as keyof TypeWordingVariants]}.svg`}
          height={24}
          width={24}
          alt={type}
        />
        <p className="text-[24px]">0.0822ETH</p>
      </div>
    </div>
  )
}

export default PriceAmount