import React from 'react'
import Image from 'next/image'

const TicketUI = () => {
  return (
    <>
      <div className="flex flex-col gap-3 w-[236px] h-[229px] my-5">
        <div
          className="p-2 pt-[0.5rem] rounded-2xl bg-[#4C69FF] w-[236px] h-[229px]"
          // style={{ background: 'linear-gradient(140deg, #534CFFB2 0%, #534CFF26 100%)' }}
          style={{
            backgroundImage: `url('/pepe/pepeTicket.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div
            className="w-[220px] rounded-2xl text-white flex flex-col gap-5 py-[0.9rem] px-[0.5rem]"
            style={{ background: `url('/background/subtractTicket.svg')` }}
          >
            <p className="text-center text-[30px]">Ticket #003</p>
            <div className="text-center flex justify-center leading-8 p-3 rounded-xl">
              <Image
                priority
                src="/logo/diamondEth.svg"
                height={26}
                width={17}
                alt="diamond eth"
                className="mr-1 mb-1"
              />
              <h2 className="text-[48px] ">
                0.057
                <span className="text-[24px]">ETH</span>
              </h2>
              {/* <p className="text-[1rem]">last seen: 04</p> */}
            </div>
            <div className="flex justify-between px-3">
              <div className="flex gap-2">
                <Image priority src="/icon/sword.svg" height={24} width={24} alt="skull" />
                <p className="text-[24px]">3</p>
              </div>
              {/* <div className="relative w-16 h-8 bg-blue-500 overflow-hidden">
                <div className="absolute inset-0 h-full w-full bg-blue-500 rounded-full" 
                  style={{clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)"}}>
                </div>
              </div> */}
              <div className="flex gap-2">
                <Image priority src="/pepe/pepeDead.svg" height={24} width={24} alt="crosshair" />
                <p className="text-white text-[24px]">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col gap-3">
        <div
          className="p-2 rounded-2xl"
          style={{ background: 'linear-gradient(140deg, #534CFFB2 0%, #534CFF26 100%)' }}
        >
          <div
            className="w-[220px] rounded-2xl text-white flex flex-col gap-8 py-[1rem] px-[0.5rem]"
            style={{ background: 'linear-gradient(140deg, #0D032D 0%, #1E1049 100%)' }}
          >
            <p className="text-center text-[24px]">#03</p>
            <div className="text-center flex flex-col leading-10">
              <h2 className="text-[4rem]">0.057</h2>
              <p className="text-[1rem]">last seen: 04</p>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-1">
                <Image priority src="/icon/skull.svg" height={24} width={24} alt="skull" />
                <Image priority src="/icon/skull.svg" height={24} width={24} alt="skull" />
                <Image priority src="/icon/skull.svg" height={24} width={24} alt="skull" />
              </div>
              <div className="flex gap-1">
                <Image priority src="/icon/crosshair.svg" height={24} width={24} alt="crosshair" />
                <p className="text-white">-</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="flex flex-col gap-3">
        <div
          className="p-2 rounded-2xl bg-[#4C69FF]"
          style={{ backgroundImage: `url('/pepe/pepeTicket.png')`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
        >
          <div
            className="w-[220px] rounded-2xl text-white flex flex-col gap-5 py-[1.4rem] px-[0.5rem] opacity-80"
            style={{ background: 'linear-gradient(140deg, #0D032D 0%, #1E1049 100%)' }}
          >
            <p className="text-center text-[30px]">Ticket #003</p>
            <div className="text-center flex flex-col leading-10 border-4 border-gray-100 border-opacity-25 p-3 rounded-xl">
              <h2 className="text-[48px] flex mx-auto">
                <Image priority src="/logo/diamondEth.svg" height={26} width={17} alt="diamond eth" className="mr-1" />0.057
                <span className='text-[24px]'>ETH</span>
              </h2>
            </div>
            <div className="flex justify-between px-3">
              <div className="flex gap-2">
                <Image priority src="/icon/sword.svg" height={24} width={24} alt="skull" />
                <p className="text-[24px]">3</p>
              </div>
              <div className="flex gap-2">
                <Image priority src="/pepe/pepeDead.svg" height={24} width={24} alt="crosshair" />
                <p className="text-white text-[24px]">3</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default TicketUI
