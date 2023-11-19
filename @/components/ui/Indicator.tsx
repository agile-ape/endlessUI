import Image from 'next/image'
import { useStoreState } from '../../../store'

export default function Indicator() {
  const phase = useStoreState((state) => state.phase)
  const indicator = `${phase}Indicator.svg`

  return (
    <div className="flex justify-center lg:justify-end">
      <Image
        priority
        src={`/indicator/${indicator}`}
        height={300}
        width={100}
        className=""
        alt={`${indicator}`}
      />
    </div>
  )
}
