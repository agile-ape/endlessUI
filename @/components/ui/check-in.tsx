import React, { useState } from 'react'
import OtpInput from 'react-otp-input';
import Image from 'next/image';
import { Button } from "./button";

const CheckIn: React.FC = () => {
  const [otpInput, setOtpInput] = useState<string>()

  return (
    <div className="w-[327px] border-[3px] border-[#084E0B] rounded-xl bg-[#209902] p-[1rem] flex flex-col gap-[1rem] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="uppercase text-[2rem] text-white">Check In</h1>
        <Image
          priority
          src="/icon/arrow-down.svg"
          height={24}
          width={24}
          alt="ethereum logo"
        />
      </div>
      <div className="uppercase bg-[#54B060] text-white rounded-xl p-[24px] text-center flex flex-col gap-4">
        <p className="">Enter keyword for this round</p>
        <div className="">
          <OtpInput
            value={otpInput}
            onChange={setOtpInput}
            numInputs={4}
            inputStyle={{ width: '80%', height: '70px', color: "black", borderRadius: '8px', margin: '0 auto', fontSize: '48px' }}
            shouldAutoFocus={true}
            placeholder='-'
          />
        </div>
        <Button>Submit</Button>
      </div>
    </div>
  )
}

export default CheckIn
