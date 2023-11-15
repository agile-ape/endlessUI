import Link from 'next/link'
import { Split, AlertTriangle, AlertCircle } from 'lucide-react'

function Prompt() {
  return (
    <div className="w-[100%] flex rounded-lg py-2 px-3 text-xl leading-tight border border-lime-800 dark:border-lime-200 text-lime-800 dark:text-lime-200">
      <AlertCircle size={24} className="align-top mr-2"></AlertCircle>
      <span>
        Learn more at{' '}
        <Link className="underline" href="/quickstart">
          Quickstart
        </Link>
      </span>
    </div>
  )
}

export default Prompt
