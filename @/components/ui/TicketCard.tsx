import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import SubtractSvg from './SubtractSvg'

interface TicketCardType {
  bgCard: string;
  bgColorSubtract: string
  bgValue: string
  isFinished: boolean
  ticketLastSeen: number
  ticketNumber: number
  ticketValue: number
  ticketBullets: number
  ticketKillCount: number
}

const TicketCard: React.FC<TicketCardType> = ({
  bgCard,
  bgColorSubtract,
  bgValue,
  isFinished,
  ticketLastSeen,
  ticketNumber,
  ticketValue,
  ticketBullets,
  ticketKillCount,
}) => {
  return (
    <div className="flex flex-col gap-3 my-5">
      <div
        className={`p-2 pt-[0.5rem] rounded-2xl ${bgCard} w-[236px] h-[229px]`}
        // style={{ background: 'linear-gradient(140deg, #534CFFB2 0%, #534CFF26 100%)' }}
        style={{ backgroundImage: `url('/pepe/pepeTicket.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
      >
        {/* <Image priority src="/background/subtractTicket.svg" height={220} width={213} alt="diamond eth" 
          className="relative left-[3px] top-[2px] opacity-75" 
          // style={{ fill: '#0B2D03B3' }}
        /> */}
        {/* <Image priority src="/background/subtractTicket.svg" height={220} width={213} alt="subtract background" 
            className="relative left-[3px] top-[2px] opacity-75" 
          /> */}
        <SubtractSvg color={bgColorSubtract}
            className="relative left-[0.5px] top-[2px] opacity-75" 
            // style={{ fill: '#0B2D03B3' }}
          />
        <div
          className="relative -top-[210px] w-[220px] rounded-2xl text-white flex flex-col gap-5 py-[0.9rem] px-[0.5rem]"
          // style={{ background: `url('/background/subtractTicket.svg')` }}
        >
          <p className="text-center text-[30px]">Ticket #003</p>
          <div className={`text-center flex justify-center leading-8 p-3 rounded-xl ${bgValue} shadow-md`}>
            <Image priority src="/logo/diamondEth.svg" height={26} width={17} alt="diamond eth" className="mr-1 mb-1" 
              // style={{ fill: "rgba(11, 45, 3, 0.70)" }}
              style={{ fill: '#0B2D03B3' }}
            />
            <h2 className="text-[48px] ">
              0.057
              <span className='text-[24px]'>ETH</span>
            </h2>
            {/* <p className="text-[1rem]">last seen: 04</p> */}
          </div>
          <div className="flex justify-between px-3">
            <div className="flex gap-2">
              <Image priority src="/icon/sword.svg" height={24} width={24} alt="skull" />
              <p className="text-[24px]">{ticketBullets}</p>
            </div>
            {/* <div className="relative w-16 h-8 bg-blue-500 overflow-hidden">
              <div className="absolute inset-0 h-full w-full bg-blue-500 rounded-full" 
                style={{clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)"}}>
              </div>
            </div> */}
            <div className="flex gap-2">
              <Image priority src="/pepe/pepeDead.svg" height={24} width={24} alt="crosshair" />
              <p className="text-white text-[24px]">{ticketKillCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketCard
