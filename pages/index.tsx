import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import type { IApp } from '../types/app'
import DesktopScreen from '@/components/screen/DesktopScreen'
import type { MetaProps } from '@/components/Metadata'

type Props = {
  metadata: MetaProps
}

const Home = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <DesktopScreen />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  req,
  res,
  locale,
}) => {
  const host = req.headers.host?.includes('localhost')
    ? `http://${req.headers.host}`
    : `https://${req.headers.host}`

  return {
    props: {
      metadata: {},
    },
  }
}

export default Home
