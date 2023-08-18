import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export default function NextClaim() {
  return (
    <div
      className="bg-[#F6F6F6] dark:bg-[#1C1C1C]
      border border-[#EBEBEB] dark:border-[#444242]
      text-center w-[220px] mx-auto rounded-lg p-2"
    >
      <div className="flex justify-center items-center gap-2">
        <p className="font-extralight text-base">Next Claim</p>

        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <QuestionMarkCircledIcon className="w-[20px] h-[20px]" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                How much ETH you will receive if you claim and withdraw now. Value increases as
                players exit the game.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-center gap-2">
        <p className="text-[36px]">0.500</p>
        <Image
          priority
          src="/logo/cryptocurrency-color_eth.svg"
          height={24}
          width={24}
          alt="ethereum logo"
        />
      </div>
    </div>
  );
}
