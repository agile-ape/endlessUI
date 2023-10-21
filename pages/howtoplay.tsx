import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../@/components/ui/button'

function HowToPlay() {
  return (
    <div className="flex flex-col gap-4 place-content-center mt-[50px]">
      <Image
        priority
        src="/pepe/pepe-lost.svg"
        className="place-self-center"
        height={250}
        width={250}
        alt="pepe-in-thoughts"
      />
      <div className="items-center justify-center mx-auto text-[4rem] text-center">
        <div className="font-headline">404</div>
        <div className="text-2xl ">Are you lost sire? Come on back to the party</div>

        <Link href="/whitelist">
          <Button variant="default" size="md">
            Back to Home{' '}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default HowToPlay
