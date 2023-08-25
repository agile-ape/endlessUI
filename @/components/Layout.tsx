import Header from './Header'
import { VT323 } from 'next/font/google'
import type { IApp } from 'types/app'
import { useStoreState } from '../../store'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from 'next-themes'

const font = VT323({
  weight: ['400'],
  subsets: ['latin-ext'],
})

const typeStage: Record<IApp['stage'], string> = {
  whitelist: 'City',
  beginnings: 'City',
  countdown: 'City',
  day: 'Desert',
  dusk: 'Dusk',
  night: 'Night',
  lastmanfound: 'Snow',
}

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const stage = useStoreState((state) => state.stage)

  return (
    <main
      className={`${font.className} bg-cover bg-center bg-no-repeat bg-fixed min-h-screen`}
      style={{
        backgroundImage: `url(/background/${typeStage[stage]}.svg)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Header />
      {children}
    </main>
  )
}

export default Layout
