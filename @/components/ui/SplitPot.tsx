import { Switch } from "@/components/ui/switch"
import { HelpCircle } from 'lucide-react'
// import { Button } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStoreActions, useStoreState } from '../../../store'



export default function SplitPot() {

    const suddenDeathRound = useStoreState((state) => state.suddenDeathRound);
    const round = useStoreState((state) => state.round);

    return(
        <div
            className="w-[240px] rounded-xl
            bg-pink-600 flex flex-col mx-auto"
        >
            <summary
                  className=" mb-1 flex justify-between flex-wrap items-center
                  focus-visible:outline-none focus-visible:ring
                  rounded group-open:rounded-b-none group-open:z-[1] relative
                  px-3 py-1"
            >
                <div className="flex gap-2 grow">
                    <div className="text-2xl capitalize text-white pl-1">Split Pot?</div>
                    <TooltipProvider delayDuration={10}>
                        <Tooltip>
                        <TooltipTrigger>
                            <HelpCircle size={24} className="stroke-slate-100" />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                            <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">
                            Once we reach sudden death rounds, players can toggle to split pot 
                            - i.e. divide the remaining prize pool evenly among everyone still in the game.
                            Pot will be split if the threshold is crossed. If not, the game continues.
                            </p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                
                < Switch 
                    disabled={round < suddenDeathRound}
                />
            </summary>


        </div>
    )
}