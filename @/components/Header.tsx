import Image from 'next/image'
import CustomConnectButton from '@/components/ui/connect-button'
import Menu from './Menu'
import Logo from './ui/Logo'
import SideMenu from './SideMenu'
import DarkModeSwitcher from './ui/DarkModeSwitcher'
import { Button } from './ui/button'

function Header() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 items-center py-3 px-5">
      <div className="flex justify-start order-1">
        <Logo />
      </div>

      <div className="hidden lg:block order-2 flex justify-self-center">
        <Menu />
      </div>

      <div className="flex justify-self-end lg:hidden order-4">
        <SideMenu />
      </div>

      <div className="hidden lg:flex justify-self-end gap-2 order-3">
        {/* <DarkModeSwitcher /> */}
        <Button variant="destructive">$LAST</Button>
        <CustomConnectButton />
      </div>
    </div>
  )
}

export default Header
