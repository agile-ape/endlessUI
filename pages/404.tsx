import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../@/components/ui/button'

function NotFound() {
  return (
    <div className="flex flex-col mx-auto gap-4 justify-center items-center mt-[50px] text-white text-2xl">
      <div className="">Hmm. Page not found...</div>
      <Image
        priority
        src="/pepe/backtoparty.png"
        className=""
        height={300}
        width={300}
        alt="pepe-in-thoughts"
      />

      <div>Are you lost sire?</div>
      <Link href="/" className="underline">
        {/* <Button variant="default" size="md"> */}
        <div>Let us take you back to the party</div>
        {/* </Button> */}
      </Link>
    </div>
  )
}

export default NotFound
