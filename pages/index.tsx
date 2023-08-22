import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Button } from '../@/components/ui/button';
import BeginningScreen from '@/components/BeginningScreen';
import DuskScreen from '@/components/DuskScreen';

const Home: NextPage = () => {
  // return <BeginningScreen />;
  return <DuskScreen />;
};

export default Home;
