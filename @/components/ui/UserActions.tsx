import React from 'react'
import { Button } from './button'
import { HelpCircle } from 'lucide-react'
import SafehouseAction from './_SafehouseAction'
import SubmitKeywordModal from './SubmitKeywordModal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CheckIn from './CheckIn'
import CheckOut from './CheckOut'
import SplitIt from './SplitIt'
import ExitGame from './ExitGame'
import Inspect from './Attack'
import KickOut from './KickOut'
import ChangePhase from './_ChangePhase'
import { Send, Home } from 'lucide-react'

const UserActions = () => {
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const toggle = () => setShowModal((prevState) => !prevState)
  return (
    <div
      className="w-[240px] rounded-xl p-3 pt-5 pb-5
    container-last
    flex flex-col gap-3 mb-5"
    >
      {/* <div className="flex gap-2">
        <p className="text-2xl capitalize pl-1 ml-2">User Actions</p>
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle size={24} className="stroke-slate-900 dark:stroke-slate-100" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="px-3 py-1 max-w-[240px] text-sm cursor-default"></p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div> */}

      {/* <SubmitKeyword /> */}
      <Button variant="submit" className="w-full text-2xl" onClick={toggle}>
        Submit Keyword
      </Button>

      <CheckIn />
      <SplitIt />

      {/*
      <div className="flex flex-col">
       <div className="text-center text-xl text-zinc-600 dark:text-zinc-800 font-thin">
          Safehouse
        </div> 
        {/* <CheckOut />
      </div>

      <div className="flex flex-col">
      </div>
      {/* <ExitGame />
        <Inspect />
        <KickOut />
        <ChangePhase />*/}

      {/* <Button variant="enter" className="w-full" >Top Up $LAST</Button> */}
      {/* <Button variant="submit" className="bg-green-700" onClick={toggle}>Submit Keyword</Button> */}
      {/* <SplitPotAction /> */}
      {/* </div> */}
      {showModal && <SubmitKeywordModal toggle={toggle} />}
    </div>
  )
}

export default UserActions
