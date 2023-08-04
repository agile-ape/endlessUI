import React from 'react'
import TicketCard from './TicketCard'

const TicketList = () => {
  return (
    <div>
      <details className="w-[350px] mx-auto border-[4px] border-[#EBEBEB] bg-[#F6F6F6] shadow rounded-2xl group text-black">
        <summary className="list-none flex flex-wrap items-center cursor-pointer
        focus-visible:outline-none focus-visible:ring 
        rounded group-open:rounded-b-none group-open:z-[1] relative 
        ">
          <div className="flex justify-between items-center sm:w-[95%] w-[90%] sm:text-base text-sm">
            <h3 className="text-[2rem] p-4">TICKET LIST</h3>
          </div>
          <div className="flex w-5 items-center justify-center">
            <div className="border-8 border-transparent border-l-black ml-2 group-open:ml-5 group-open:mb-1
            group-open:rotate-90 transition-transform origin-left
            "></div>
          </div>
        </summary>
        <div className="p-4 grid grid-cols-2 gap-x-1 gap-y-6 items-center place-items-center">
          <div className="w-[139.5px]">
            <div className="uppercase px-4 py-1 rounded-xl bg-[#0D032D] text-white text-center w-[70%] mx-auto text-[12px] relative top-4 border-[1px] border-[#534CFFB2]">Your Ticket</div>
            <TicketCard />
          </div>
          <div className="mt-[27px]">
            <TicketCard />
          </div>
          <div className="mt-[27px]">
            <TicketCard />
          </div>
          <div className="mt-[27px]">
            <TicketCard />
          </div>
        </div>
      </details>
    </div>
  )
}

export default TicketList