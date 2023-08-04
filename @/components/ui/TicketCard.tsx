import React from 'react'
import Image from 'next/image'

interface TicketCardType {
  linearGradientCard: string;
  borderColor: string;
  isFinished: boolean;
  ticketLastSeen: number;
  ticketNumber: number;
  ticketValue: number;
  ticketBullets: number;
  ticketKillCount: number
}

const TicketCard: React.FC<TicketCardType> = ({ 
  linearGradientCard, borderColor, isFinished, ticketLastSeen, ticketNumber, ticketValue, ticketBullets, ticketKillCount
}) => {
  return (
    <div className="">
      <div className="p-[2px] rounded-lg w-[139.5px]" style={{background: borderColor}}>
        <div
          className=" rounded-lg text-white flex flex-col gap-4 py-[1rem] px-[0.5rem]" 
          style={{background: linearGradientCard}}
        >
          <p className="text-center text-[24px]">#0{ticketNumber}</p>
          <div className="text-center flex flex-col mb-3">
            <div className={`flex justify-center ${isFinished && "flex-row-reverse"} items-center gap-1`}>
              <h2 className="text-[32px]">{ticketValue}</h2>
              <Image 
                priority
                src={`/logo/${isFinished ? "medal" : "cryptocurrency-color_eth"}.svg`}
                height={24}
                width={24}
                alt="skull"
              />
            </div>
            <p className="text-[1rem]">last seen: 0{ticketLastSeen}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <Image 
                priority
                src="/icon/bullet.svg"
                height={24}
                width={24}
                alt="skull"
              />
              <p className="text-white">{ticketBullets}</p>
            </div>
            <div className="flex gap-1">
              <Image 
                priority
                src="/icon/crosshair.svg"
                height={24}
                width={24}
                alt="crosshair"
              />
              <p className="text-white">{ticketKillCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketCard
