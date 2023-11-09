import localFont from 'next/font/local'

const headlineFont = localFont({
  src: '../../../public/fonts/headline.ttf',
  display: 'swap',
  // fallback: ['sans-serif'],
})
export default function Logo() {
  return (
    <button
      onClick={() => console.log('last')}
      className="h-12 rounded-md
      px-2 py-0 text-[34px] font-headline
      text-white bg-red-800 
      transition-colors
      hover:bg-zinc-200 hover:text-blue-950 capitalized"
    >
      last
    </button>
  )
}
