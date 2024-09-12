import React from 'react'

interface SquareProps {
  onMouseEnter?: () => void // Add this line
  onMouseLeave?: () => void // Add this line
}

const Square: React.FC<SquareProps> = ({ onMouseEnter, onMouseLeave }) => {
  // { children, onClick }
  {
    return (
      <div
        onMouseEnter={onMouseEnter} // Add this line
        onMouseLeave={onMouseLeave}
      >
        <button
          className="w-8 h-8 bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-b-[#808080] border-r-[#808080] flex items-center justify-center text-black font-bold text-lg select-none"
          // onClick={onClick}
        >
          {/* {children} */}
        </button>
      </div>
    )
  }
}

export default Square
