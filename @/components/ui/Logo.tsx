import localFont from 'next/font/local'

const headlineFont = localFont({
  src: '../../../public/fonts/headline.ttf',
  display: 'swap',
  // fallback: ['sans-serif'],
})
export default function Logo() {
  return (
    <button onClick={() => console.log('last')} className={`logo-last ${headlineFont.className}`}>
      last
    </button>
  )
  // return <div className="logo-last font-headline">last</div>
}
