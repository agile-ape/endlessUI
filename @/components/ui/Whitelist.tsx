import Image from 'next/image'
import { Button } from './button'

export default function Whitelist() {
  return (
    <div className="grid grid-rows-2 gap-4 place-content-center">
      <Image
        priority
        src="/pepe/closed-eyes.svg"
        className="place-self-center"
        height={300}
        width={300}
        alt="closed-eyes-pepe"
      />
      <Button> Join whitelist </Button>
    </div>
  )
}
