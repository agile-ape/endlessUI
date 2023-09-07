import localFont from 'next/font/local'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

const headlineFont = localFont({
  src: '../../../public/fonts/headline.ttf',
  display: 'swap',
  // fallback: ['sans-serif'],
})
export default function Logo() {
  return <div className={`logo-last ${headlineFont.className}`}>last</div>
}
