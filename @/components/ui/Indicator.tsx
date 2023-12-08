import Image from 'next/image'
import { useStoreState } from '../../../store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DOCS_URL_phases } from '../../../services/constant'

export default function Indicator({ phase }: { phase: string }) {
  const indicator = `${phase}Indicator.svg`

  return (
    <>
      {(phase === 'deployed' || phase === 'gameclosed') && <></>}

      {!(phase === 'deployed' || phase === 'gameclosed') && (
        <div className="flex justify-center lg:justify-end">
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                <Image
                  priority
                  src={`/indicator/${indicator}`}
                  height={300}
                  width={100}
                  className=""
                  alt={`${indicator}`}
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                  Current game phase
                  <a href={DOCS_URL_phases} target="_blank" className="text-xs underline block">
                    Learn more
                  </a>
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  )
}
