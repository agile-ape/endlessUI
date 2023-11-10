import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import BeginningsScreen from '@/components/screen/BeginningsScreen'
import { useStoreState } from '../store'
import type { IApp } from '../types/app'
import DayScreen from '@/components/screen/DayScreen'
import DuskScreen from '@/components/screen/DuskScreen'
import NightScreen from '@/components/screen/NightScreen'
import CountdownScreen from '@/components/screen/CountdownScreen'
import LastManScreen from '@/components/screen/LastManScreen'
import type { MetaProps } from '@/components/Metadata'

type Props = {
  metadata: MetaProps
  phase: IApp['phase']
  theme: 'light' | 'dark'
}

const Home = ({ phase, theme }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const screen: Record<IApp['phase'], JSX.Element> = {
  //   beginnings: <BeginningsScreen />,
  //   countdown: <CountdownScreen />,
  //   day: <DayScreen />,
  //   dusk: <DuskScreen />,
  //   night: <NightScreen />,
  //   lastmanfound: <LastManScreen />,
  // }

  return <DayScreen />
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  req,
  res,
  locale,
}) => {
  const currentPhase = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/phase`)
  const result = await currentPhase.json()
  const phase: IApp['phase'] = result?.message || 'beginnings'

  const phaseTheme: Record<IApp['phase'], 'light' | 'dark'> = {
    beginnings: 'dark',
    countdown: 'dark',
    day: 'light',
    night: 'dark',
    dusk: 'dark',
    lastmanfound: 'light',
  }

  return {
    props: {
      metadata: {},
      phase,
      theme: phaseTheme[phase],
    },
  }
}

export default Home
