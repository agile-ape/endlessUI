import Image from 'next/image';
import CustomConnectButton from '@/components/ui/connect-button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import Menu from './Menu';
import SideMenu from './SideMenu';

function Header() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window != 'undefined') {
      setWindowWidth(window.innerWidth);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 mx-32 my-3">
      <div className="flex xl:justify-start md:justify-end justify-center order-3 xl:order-1">
        <Image
          priority
          src="/logo/game-logo.png"
          height={35}
          width={35}
          alt="ethereum logo"
          className="min-w-35 min-h-35"
        />
      </div>

      <div className="flex xl:justify-center justify-start order-1 xl:order-2">{windowWidth > 1200 ? <Menu /> : <SideMenu />}</div>

      <div className="flex justify-end xl:order-last order-2">
        {/* <CustomConnectButton /> */}
        <ConnectButton
          chainStatus={{
            smallScreen: 'none',
            largeScreen: 'icon',
          }}
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          showBalance={false}
        />
      </div>
    </div>
  );
}

export default Header;
