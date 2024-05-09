import { SOON_LINK } from '../../../services/constant'

export default function Banner() {
  const screenWidth = window.screen.width
  console.log('Screen width:', screenWidth)

  const wordWidth = 320

  const repeatCount = Math.round(screenWidth / wordWidth)

  return (
    <a href={SOON_LINK} target="_blank" className="font-digit">
      <div
        className="h-12 text-white \
       text-lg flex justify-center items-center \
        border border-white border-dashed rounded-md
       bg-transparent"
      >
        {
          // Assuming repeatCount is a variable indicating the number of times to repeat "WEN TOKEN?"
          // If so, you can use a loop to repeat the content
          Array.from({ length: repeatCount }).map((_, index) => (
            <span key={index} className="px-4">
              WEN TOKEN?
            </span>
          ))
        }
      </div>
    </a>
  )
}
