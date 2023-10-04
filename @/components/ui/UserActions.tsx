import React from 'react'
import { Button } from './button'
import SubmitKeyword from './SubmitKeyword'
import SplitPotAction from './SplitPotAction'
import SafehouseAction from './SafehouseAction'
const UserActions = () => {
  return (
    <div className="w-[240px] rounded-xl bg-gray-400 p-2 pb-5 border-[2px] border-white flex flex-col gap-2 my-5">
      <p className="text-2xl text-black ml-2">User Actions</p>
      <div className="w-[90%] mx-auto flex flex-col gap-2">
        <Button variant="enter" className="w-full" >Top Up $LAST</Button>
        <SubmitKeyword />
        <SafehouseAction />
        <SplitPotAction />
      </div>
    </div>
  )
}

export default UserActions
