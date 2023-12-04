import type { FC } from 'react'

import Link from 'next/link'
import { Split, AlertTriangle, AlertCircle } from 'lucide-react'
import { DOCS_URL } from '../../../services/constant'

type PromptType = {
  docLink: string
}

const Prompt: FC<PromptType> = ({ docLink }) => {
  return (
    <div className="w-[100%] flex rounded-lg py-2 px-3 text-xl leading-tight border border-lime-800 dark:border-lime-200 text-lime-800 dark:text-lime-200">
      <AlertCircle size={24} className="align-top mr-2"></AlertCircle>
      <span>
        This action is not available to you right now.{' '}
        <a href={docLink} target="_blank" className="underline">
          Learn more at Quickstart
        </a>
      </span>
    </div>
  )
}

export default Prompt
