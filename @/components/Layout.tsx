import Header from './Header'
import { VT323 } from 'next/font/google'
import type { IApp } from 'types/app'
import { useStoreState } from '../../store'

const font = VT323({
  weight: ['400'],
  subsets: ['latin-ext'],
})

const typeStage: Record<IApp['stage'], string> = {
  beginning: 'City',
  day: 'Desert',
  dusk: 'Dusk',
  night: 'Night',
}

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const stage = useStoreState((state) => state.stage)
  return (
    <main
      className={`${font.className} dark:bg-[#2D2D2D]`}
      style={{
        backgroundImage: `url(/background/${typeStage[stage]}.svg)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <Header />
      {children}
    </main>
  )
}

export default Layout
