import React from 'react'

interface EntryProps {
  label: string
  value?: number
  textColor?: string
}

const Entry: React.FC<EntryProps> = ({ label, value, textColor }) => {
  return (
    <div className="flex gap-2 items-center justify-center">
      {/* <div className="bg-[#b0b0b0] text-[#808080] px-2 py-1 rounded-sm shadow-[-1px_-1px_1px_rgba(255,255,255,0.5),1px_1px_1px_rgba(0,0,0,0.3)]"> */}

      <div className="font-['VT323',monospace] w-[60px] text-xl text-[#808080] text-left">
        {label}
      </div>
      <div
        className={`text-${textColor} bg-black w-[90px] p-1 border-2 border-[#808080] font-digit font-bold text-2xl text-right rounded-sm  border-t-4 border-l-4 border-[#ffffff] border-r-4 border-b-4 border-r-[#808080] border-b-[#808080]`}
      >
        {value}
      </div>
    </div>

    // <div className="flex justify-between items-center border border-gray-500 rounded-full px-2">
    //   <div className="font-['VT323',monospace] text-xl text-left w-3/5 pr-2">{label}</div>
    //   <div className="font-['VT323',monospace] text-xl text-right w-2/5">{value}</div>
    // </div>
  )
}

export default Entry
