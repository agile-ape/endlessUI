import PrizeAmount from './PrizeAmount'
import Image from 'next/image'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

// grid grid-cols-2 gap-3 opacity-90
//     justify-items-start text-sm

export default function AllPrize() {
  return (
    <div
      className="grid grid-cols-2
      md:flex md:justify-around opacity-90 gap-2 pt-2"
    >
        
      <div
        className="flex flex-col rounded-full
          bg-blue-950/80 px-4 py-2 text-center min-w-[150px]
      "
      >
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-2xl">
                <PrizeAmount amount="0.0822" category="total" logoHeight={24} logoWidth={24} />
              </div>            
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
              <strong>Total Prize Pool</strong> 
                <p>
                What everyone pooled in total
                </p>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>


      <div
        className="flex flex-col rounded-full
        bg-rose-950/80 px-4 py-2 text-center min-w-[150px]
    "
      >
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-2xl">
                <PrizeAmount amount="0.0822ETH" category="redeem" logoHeight={24} logoWidth={24} />
              </div>  
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                <strong>Next ETH Claim</strong>
                <p>
                What the next leaver gets
                </p>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>


      <div
        className="flex flex-col rounded-full
        bg-green-950/80 px-4 py-2 text-center min-w-[150px]
    "
      >
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-2xl">
                <PrizeAmount amount="0.0822ETH" category="win" logoHeight={24} logoWidth={24} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                <strong>Top Prize</strong>
                <p>
                What the last man takes home
                </p>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        className="flex flex-col rounded-full
        bg-purple-950/80
        px-4 py-2 text-center min-w-[150px]
    "
      >
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              {/* <HelpCircle size={16} className="ml-1 stroke-slate-100" /> */}
              <div className="text-2xl">
                <PrizeAmount amount="0.0822ETH" category="bounty" logoHeight={24} logoWidth={24} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                <strong>Bounty</strong>
                <p>
                What the assasin collects
                </p>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
