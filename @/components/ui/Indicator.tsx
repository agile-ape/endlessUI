import Image from 'next/image'
import { useStoreState } from '../../../store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DOCS_URL_phases } from '../../../services/constant'

// { phase }: { phase: string }
export default function Indicator() {
  const phase = useStoreState((state) => state.phase)
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
                  className="h-auto"
                  alt={`${indicator}`}
                />
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="hidden sm:block">
                <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                  Current game phase
                  <a href={DOCS_URL_phases} target="_blank" className="text-xs link block">
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
