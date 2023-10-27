import React from 'react'
import { Button } from './button'
import { HelpCircle } from 'lucide-react'

import SubmitKeyword from './SubmitKeyword'
import SplitPotAction from './SplitPotAction'
import SafehouseAction from './SafehouseAction'
import SubmitKeywordModal from './SubmitKeywordModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CheckIn from './CheckIn'
import CheckOut from './CheckOut'
import SplitIt from './SplitIt'
import ExitGame from './ExitGame'
import Inspect from './Inspect'
import KickOut from './KickOut'
import ChangePhase from './ChangePhase'
import { Send } from 'lucide-react'

const UserActions = () => {
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const toggle = () => setShowModal((prevState) => !prevState)
  return (
    <div className="w-[240px] rounded-xl p-2 pb-5 border-[2px] border-black dark:border-white flex flex-col gap-2 mb-5">
      <div className="flex gap-2">
        <p className="text-2xl capitalize pl-1 ml-2">User Actions</p>
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle size={24} className="stroke-slate-900 dark:stroke-slate-100" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default">{/* Not sure yet */}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* <SubmitKeyword /> */}
      <Button variant="submit" className="w-full text-2xl" onClick={toggle}>
        Submit <Send size={16} className="text-sm ml-1"></Send>
      </Button>
      <div className="mt-4 flex flex-col gap-2">
        <CheckIn />
        <CheckOut />
      </div>

      <div className="font-thin">Stage 2/3</div>

      <SplitIt />

      {/* <ExitGame />
        <Inspect />
        <KickOut />
        <ChangePhase />*/}

      {/* <SafehouseAction /> */}

      {/* <Button variant="enter" className="w-full" >Top Up $LAST</Button> */}
      {/* <Button variant="submit" className="bg-green-700" onClick={toggle}>Submit Keyword</Button> */}
      {/* <SplitPotAction /> */}
      {/* </div> */}
      {showModal && <SubmitKeywordModal toggle={toggle} />}
    </div>
  )
}

export default UserActions
