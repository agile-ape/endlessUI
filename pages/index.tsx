import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Button } from '../@/components/ui/button'
import BeginningScreen from '@/components/BeginningScreen'
import DuskScreen from '@/components/DuskScreen'
import DayScreen from '@/components/DayScreen'
import NightScreen from '@/components/NightScreen'
import { useStoreState } from '../store'
import type { IApp } from '../types/app'

const Home: NextPage = () => {
  const stage = useStoreState((state) => state.stage)

  const screen: Record<IApp['stage'], JSX.Element> = {
    beginning: <BeginningScreen />,
    dusk: <DuskScreen />,
    day: <DayScreen />,
    night: <NightScreen />,
  }

  return screen[stage]
}

export default Home
