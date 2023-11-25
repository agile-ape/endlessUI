import Link from 'next/link'
import { Split, AlertTriangle, AlertCircle } from 'lucide-react'
import { DOCS_URL } from '../../../services/constant'

function Prompt() {
  return (
    <div className="w-[100%] flex rounded-lg py-2 px-3 text-xl leading-tight border border-lime-800 dark:border-lime-200 text-lime-800 dark:text-lime-200">
      <AlertCircle size={24} className="align-top mr-2"></AlertCircle>
      <span>
        This action is not available right now. Learn more at{' '}
        <a href={DOCS_URL} target="_blank" className="underline">
          Quickstart
        </a>
      </span>
    </div>
  )
}

export default Prompt
