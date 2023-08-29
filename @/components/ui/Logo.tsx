import Image from 'next/image'

function Logo() {
  return (
    <Image
      src={`/logo/game-logo.png`}
      width={35}
      height={35}
      alt="Last Man Standing Logo"
      className="max-w-full"
    />
  )
}

export default Logo
