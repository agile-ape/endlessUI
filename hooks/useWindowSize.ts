import { useEffect, useState } from 'react'

export function useWindowSize() {
  const [size, setSize] = useState([0, 0])

  function updateSize() {
    setSize([window.innerWidth, window.innerHeight])
  }

  useEffect(() => {
    updateSize()

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return {
    sm: size[0] < 768,
    md: size[0] >= 768,
    lg: size[0] >= 1024,
    xl: size[0] >= 1280,
    '2xl': size[0] >= 1536,
  }
}
