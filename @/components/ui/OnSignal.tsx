import React from 'react'

interface OnSignalProps {
  active: boolean
  own: boolean
}

const OnSignal: React.FC<OnSignalProps> = ({ active, own }) => {
  return (
    // bg-[#ff0000] bg-red-900
    <div
      className={`rounded-full shadow-md border-gray-500 
      ${active ? 'bg-[#5eff00]' : 'bg-green-900'}

      ${
        own
          ? 'h-[0.5rem] w-[0.5rem] mx-2 border-[0.05rem]'
          : 'h-[0.3rem] w-[0.3rem] mx-1 border-[0.03rem]'
      } 
      `}
    ></div>
  )
}

export default OnSignal
