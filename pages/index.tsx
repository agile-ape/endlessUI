import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import type { IApp } from '../types/app'
import Screen from '@/components/screen/Screen'
import type { MetaProps } from '@/components/Metadata'

type Props = {
  metadata: MetaProps
  phase: IApp['phase']
  theme: 'light' | 'dark'
}

const Home = ({ phase, theme }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <Screen />
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
    deployed: 'dark',
    start: 'dark',
    day: 'light',
    night: 'dark',
    lastmanfound: 'dark',
    drain: 'dark',
    peacefound: 'light',
    gameclosed: 'dark',
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
