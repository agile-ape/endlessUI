import Image from 'next/image'
import CustomConnectButton from '@/components/ui/connect-button'
import Menu from './Menu'
import Logo from './ui/Logo'
import SideMenu from './SideMenu'
import DarkModeSwitcher from './ui/DarkModeSwitcher'

function Header() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-center container mx-auto pt-4">
      <div className="flex justify-start order-1">
        <Logo />
      </div>

      <div className="hidden md:block order-2">
        <Menu />
      </div>

      <div className="flex justify-self-end md:hidden order-4">
        <SideMenu />
      </div>

      <div className="hidden md:flex justify-self-end gap-2 order-3">
        <DarkModeSwitcher />
        <CustomConnectButton />
      </div>
    </div>
  )
}

export default Header
