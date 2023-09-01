import { Button } from './button'
import { Loader2 } from 'lucide-react'

function ButtonLoading() {
  return (
    <Button size="lg" variant="transparent" className="text-xl" disabled>
      <Loader2 className="mr-1 animate-spin" />
      Loading...
    </Button>
  )
}

export default ButtonLoading
