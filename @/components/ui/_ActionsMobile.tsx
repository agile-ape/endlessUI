import React, { useRef, useState } from 'react'
import { User, Menu, Users, Clock, Move } from 'lucide-react'
import CheckInNew from './CheckInNew'
import Submit from './Submit'

type ComponentType =
  | 'submit'
  | 'checkIn'
  | 'checkOut'
  | 'splitIt'
  | 'wager'
  | 'attack'
  | 'kickOut'
  | 'buyTicket'
  | 'exitGame'

function ActionsMobile() {
  const [renderComponent, setRenderComponent] = useState<ComponentType | null>(null)

  const selectComponent = (component: ComponentType) => {
    setRenderComponent(component)
  }

  return (
    <>
      <div className="">
        {renderComponent === 'submit' && <Submit />}
        {renderComponent === 'checkIn' && <Submit />}
        {renderComponent === 'checkOut' && <Submit />}
        {renderComponent === 'splitIt' && <Submit />}
        {renderComponent === 'wager' && <Submit />}
        {renderComponent === 'attack' && <Submit />}
        {renderComponent === 'kickOut' && <Submit />}
        {renderComponent === 'buyTicket' && <Submit />}
        {renderComponent === 'exitGame' && <Submit />}
      </div>
      <div className="fixed bottom-14 w-full container-last border-none bg-opacity-100 dark:bg-opacity-100 px-2 pt-1">
        <div className="flex gap-4">
          <button
            className="flex flex-col justify-center items-center"
            onClick={() => selectComponent('submit')}
          >
            <User size={24} />
            <div className="">Submit</div>
          </button>
          <button
            className="flex flex-col justify-center items-center"
            onClick={() => selectComponent('submit')}
          >
            <User size={24} />
            <div className="">Check In</div>
          </button>
        </div>
      </div>
    </>
  )
}

export default ActionsMobile
