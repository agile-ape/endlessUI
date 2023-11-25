import React, { useState } from 'react'

import localFont from 'next/font/local'

const headlineFont = localFont({
  src: '../../../public/fonts/headline.ttf',
  display: 'swap',
  // fallback: ['sans-serif'],
})
export default function Logo() {
  const [buttonText, setButtonText] = useState('last')

  const handleHover = () => {
    setButtonText('man')
  }

  const handleLeave = () => {
    setButtonText('last')
  }

  return (
    <button
      onClick={() => console.log('last')}
      onMouseOver={handleHover}
      onMouseLeave={handleLeave}
      className="h-12 w-16 rounded-md 
      px-2 py-0 text-[34px] font-headline
      text-white bg-red-800 
      transition-colors
      hover:bg-zinc-200 hover:text-blue-950 capitalized"
    >
      {buttonText}
    </button>
  )
}
