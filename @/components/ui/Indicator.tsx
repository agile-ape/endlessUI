import Image from 'next/image'

export default function Indicator() {
  // const phase = useStoreState((state) => state.phase)
  const phase = 'start'

  const indicator = `${phase}Indicator.svg`

  return (
    <div className="flex justify-center lg:justify-end">
      <Image
        priority
        src={`/indicator/${indicator}`}
        height={300}
        width={100}
        // fill={true}
        // sizes="max-width:150px"
        className=""
        // layout="fixed"
        alt={`${indicator}`}
      />
    </div>
    // <div className="text-4xl flex justify-center lg:justify-end font-headline uppercase day-last">
    //   {' '}
    //   {phase}{' '}
    // </div>
  )
}
