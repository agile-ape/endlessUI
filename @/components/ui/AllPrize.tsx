import PrizeAmount from './PrizeAmount'
import Image from 'next/image'
import Link from 'next/link'

export default function AllPrize() {
  return (
    <div
      className="mx-4 my-2
      grid grid-cols-2 gap-3
    border-zinc-300 opacity-90
    justify-items-start text-sm
    "
    >
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col rounded-xl
          bg-[#F6F6F6] dark:bg-[#1C1C1C]
          border border-[#EBEBEB] dark:border-[#444242] p-2 text-center max-w-[150px]
      "
      >
        <p className="font-semibold mr-1 mb-1">What everyone pooled in total</p>
        <div className="flex justify-center text-2xl border border-gray-950 bg-gray-950 rounded-lg">
          <PrizeAmount amount="0.0822ETH" category="total" logoHeight={14} logoWidth={14} />
          <Image
            priority
            src={`/icon/ether.svg`}
            style={{ margin: '2px' }}
            height={8}
            width={8}
            alt="ether"
          />
        </div>
      </a>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col rounded-xl
          bg-[#F6F6F6] dark:bg-[#1C1C1C]
          border border-[#EBEBEB] dark:border-[#444242] p-2 text-center max-w-[150px]"
      >
        <p className="font-semibold mr-1 mb-1">What the next leaver gets</p>
        <div className="flex justify-center text-2xl border border-gray-950 bg-gray-950 rounded-lg">
          <PrizeAmount amount="0.0822ETH" category="redeem" logoHeight={14} logoWidth={14} />
          <Image
            priority
            src={`/icon/ether.svg`}
            style={{ margin: '2px' }}
            height={8}
            width={8}
            alt="ether"
          />
        </div>
      </a>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col rounded-xl
          bg-[#F6F6F6] dark:bg-[#1C1C1C]
          border border-[#EBEBEB] dark:border-[#444242] p-2 text-center max-w-[150px]
          "
      >
        <p className="font-semibold mr-1 mb-1">What the last man takes home</p>
        <div className="flex justify-center text-2xl border border-gray-950 bg-gray-950 rounded-lg">
          <PrizeAmount amount="0.0822ETH" category="win" logoHeight={14} logoWidth={14} />
          <Image
            priority
            src={`/icon/ether.svg`}
            style={{ margin: '2px' }}
            height={8}
            width={8}
            alt="ether"
          />
        </div>
      </a>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col rounded-xl
          bg-[#F6F6F6] dark:bg-[#1C1C1C]
          border border-[#EBEBEB] dark:border-[#444242] p-2 text-center max-w-[150px]"
      >
        <p className="font-semibold mr-1 mb-1">What the assasin collects:</p>
        <div className="flex justify-center text-2xl border border-gray-950 bg-gray-950 rounded-lg">
          <PrizeAmount amount="0.0822ETH" category="bounty" logoHeight={14} logoWidth={14} />
          <Image
            priority
            src={`/icon/ether.svg`}
            style={{ margin: '2px' }}
            height={8}
            width={8}
            alt="ether"
          />
        </div>
      </a>
    </div>
  )
}
