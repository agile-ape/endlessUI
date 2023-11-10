export default function Indicator() {
  // const phase = useStoreState((state) => state.phase)
  const phase = 'day'

  return (
    <div className="text-4xl flex justify-center lg:justify-end font-headline uppercase day-last">
      {' '}
      {phase}{' '}
    </div>
  )
}
