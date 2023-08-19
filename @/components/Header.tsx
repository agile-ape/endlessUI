import Image from 'next/image'
import CustomConnectButton from '@/components/ui/connect-button'
import { useState, useEffect } from 'react'
import Menu from './Menu'
import SideMenu from './SideMenu'
import DarkModeSwitcher from './ui/DarkModeSwitcher'

function Header() {
  return (
    <div className="flex items-center justify-between container mx-auto  pt-4">
      <div className="shrink-0">
        <Image
          src={`/logo/game-logo.png`}
          width={35}
          height={35}
          alt="Last Man Standing Logo"
          className="max-w-full"
        />
      </div>

      <div className="hidden md:block">
        <Menu />
      </div>

      <div className="md:hidden order-10">
        <SideMenu />
      </div>

      <div className="flex items-center gap-2">
        <DarkModeSwitcher />
        <CustomConnectButton />
      </div>
    </div>
  )
}

export default Header
