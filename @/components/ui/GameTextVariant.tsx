import React from 'react'

interface GameTextVariantType {
  variant: string
  timestamp: string
  text: string
  number: number
  isLastIndex: boolean
}

// const colorVariant = (variant: string) => {
//   switch (variant) {
//     case 'checked_in':
//       return 'text-[#47C77C]'
//     case 'triggered_change':
//       return 'text-[#EC8915]'
//     case 'new_entry':
//       return 'text-blue-200'
//     case 'exit':
//       return 'text-red-800'
//     case 'safe':
//       return 'text-[#2B3984]'
//     case 'killed':
//       return 'text-[#2B3984]'
//     default:
//       return ''
//   }
// }

// const textVariant = (variant: string) => {
//   switch (variant) {
//     case 'checked_in':
//       return (
//         <>
//           just <span className={`${colorVariants[variant]}`}>checked in.</span>
//         </>
//       )
//     case 'triggered_change':
//       return <span className={`${colorVariants[variant]} opacity-90`}>triggered</span>
//     // return (<span className={`text-red-100 opacity-90`}>triggered</span>)
//     case 'new_entry':
//       return <span className={`${colorVariants[variant]} opacity-90`}>is bought</span>
//     case 'exit':
//       return <span className={`${colorVariants[variant]} opacity-90`}>has exited</span>
//     case 'safe':
//       return <span className={`${colorVariants[variant]} opacity-90`}>is safe</span>
//     case 'killed':
//       return <span className={`${colorVariants[variant]} opacity-90`}>is killed</span>
//     default:
//       return <span></span>
//   }
// }

// const colorVariants = {
//   checked_in: 'text-[#47C77C]',
//   triggered_change: 'text-[#EC8915]',
//   new_entry: 'text-[#9049A9]',
//   exit: 'text-[#FC1616]',
//   safe: 'text-[#2B3984]',
//   killed: 'text-[#2B3984]',
// }

const textVariants = {
  checked_in: <span className="text-lime-300">checked in.</span>,
  triggered_change: <span className="text-yellow-300">triggered</span>,
  new_entry: <span className="text-fuchsia-500">is bought</span>,
  exit: <span className="text-orange-500">has exited</span>,
  safe: <span className="text-blue-600">is safe</span>,
  killed: <span className="text-red-600">is killed</span>,
}

type TextVariants = {
  checked_in: Element
  triggered_change: Element
  new_entry: Element
  exit: Element
  safe: Element
  killed: Element
}

const GameTextVariant: React.FC<GameTextVariantType> = ({
  variant,
  timestamp,
  text,
  number,
  isLastIndex,
}) => {
  return (
    <div
      className={`flex justify-between gap-4 w-[100%] items-end py-2
    text-black dark:text-white ${!isLastIndex && 'border-b-[1px] border-zinc-600'}`}
    >
      <div className="w-[250px] leading-tight">
        <p className="text-lg dark:text-white light:text-black text-left">
          <span className="player-last text-lg">{number}</span>{' '}
          {textVariants[variant as keyof TextVariants]} {text}
        </p>
      </div>
      <p className="text-sm text-neutral-600">{timestamp} ago</p>
    </div>
  )
}

export default GameTextVariant
