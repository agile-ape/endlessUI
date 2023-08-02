import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Button } from '../@/components/ui/button';
import BeginningScreen from '@/components/BeginningScreen';

const Home: NextPage = () => {
  return <BeginningScreen />;
};

export default Home;
