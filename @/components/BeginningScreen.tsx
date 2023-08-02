import Image from 'next/image';
import CustomConnectButton from './ui/connect-button';

export default function BeginningScreen() {
  return (
    <div className="max-w-lg mx-auto mt-[26px]">
      <div className="text-center">
        <p className="text-lg">Round 01</p>
        <p className="text-lg">Beginnings</p>
        <h1 className="uppercase mt-4 text-xl">are you the last man standing?</h1>
      </div>

      <div className="mx-auto flex flex-col gap-5 mt-20">
        <div className="flex justify-center">
          <CustomConnectButton />
        </div>
        
        <div className="text-center">
          <div>
            <p className="text-[20px]">Time Left: ?</p>
          </div>
          <h2 className="text-[40px]">04:10</h2>
        </div>
        <div className="bg-[#F6F6F6] border border-[#EBEBEB] text-center w-[220px] mx-auto rounded-lg">
          <p className="font-extralight">Next Claim</p>
          <div className="flex justify-center gap-3">
            <p className="text-[36px]">0.500</p>
            <Image
              priority
              src="/logo/cryptocurrency-color_eth.svg"
              height={24}
              width={24}
              alt="ethereum logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
