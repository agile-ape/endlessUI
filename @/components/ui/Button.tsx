import React from 'react'

interface ButtonProps {
  onClick: () => void
  label: string
}

const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
  return (
    <div className="relative">
      <div className="bg-gray-800 rounded-2xl absolute inset-0"></div>
      <div className="relative">
        <button
          className="inline-block rounded-2xl bg-[#5d5b7e] font-['VT323',monospace]
        uppercase text-2xl text-black px-6 py-2
        transition-transform duration-150
        hover:-translate-y-[0.5rem] active:-translate-y-[0.25rem]
        "
          onClick={onClick}
        >
          {label}
        </button>
      </div>
    </div>
  )
}

export default Button
