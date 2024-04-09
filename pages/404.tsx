import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../@/components/ui/button'

function NotFound() {
  return (
    <div className="flex flex-col mx-auto gap-4 justify-center items-center mt-[50px] text-white text-2xl">
      <p className="text-sm mx-3 leading-tight sm:text-lg sm:leading-8 text-lime-700 dark:text-lime-300 rounded-xl capitalize">
        Hmm. Page not found...
      </p>

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
        <div>Let us take you back</div>
        {/* </Button> */}
      </Link>
    </div>
  )
}

export default NotFound
