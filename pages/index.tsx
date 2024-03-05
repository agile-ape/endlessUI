import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import type { IApp } from '../types/app'
import Screen from '@/components/screen/Screen'
import type { MetaProps } from '@/components/Metadata'

type Props = {
  metadata: MetaProps
}

const Home = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <Screen />
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
