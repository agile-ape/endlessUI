import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Button } from '../@/components/ui/button'
import BeginningsScreen from '@/components/screen/BeginningsScreen'
import { useStoreState } from '../store'
import type { IApp } from '../types/app'
import DayScreen from '@/components/screen/DayScreen'
import DuskScreen from '@/components/screen/DuskScreen'
import NightScreen from '@/components/screen/NightScreen'
import CountdownScreen from '@/components/screen/CountdownScreen'
import LastManScreen from '@/components/screen/LastManScreen'

const Home: NextPage = () => {
  const stage = useStoreState((state) => state.stage)

  const screen: Record<IApp['stage'], JSX.Element> = {
    beginnings: <BeginningsScreen />,
    countdown: <CountdownScreen />,
    day: <DayScreen />,
    dusk: <DuskScreen />,
    night: <NightScreen />,
    lastmanfound: <LastManScreen />,
  }

  return screen[stage]
}

export const getServerSideProps: GetServerSideProps = async ({ query, req, res, locale }) => {
  return {
    props: {
      metadata: {},
    },
  }
}

export default Home
