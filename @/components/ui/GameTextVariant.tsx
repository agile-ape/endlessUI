import React from 'react'

interface GameTextVariantType {
  variant: string;
  timestamp: string;
  text: string;
  number: number;
  isLastIndex: boolean;
}

const colorVariant = (variant: string) => {
  switch (variant) {
    case 'checked_in':
      return 'text-[#47C77C]'
    case 'triggered_change':
      return 'text-[#EC8915]';
    case 'new_entry':
      return 'text-[#9049A9]';
    case 'exit':
      return 'text-[#FC1616]';
    case 'safe':
      return 'text-[#2B3984]';
    case 'killed':
      return 'text-[#2B3984]';
    default:
      return '';
  }
}

const textVariant = (variant: string) => {
  switch (variant) {
    case 'checked_in':
      return (<>just <span className={`${colorVariant(variant)}`}>checked in.</span></>)
    case 'triggered_change':
      return (<span className={`${colorVariant(variant)} opacity-90`}>triggered</span>)
      // return (<span className={`text-red-100 opacity-90`}>triggered</span>)
    case 'new_entry':
      return (<span className={`${colorVariant(variant)} opacity-90`}>is bought</span>);
    case 'exit':
      return (<span className={`${colorVariant(variant)} opacity-90`}>has exited</span>);
    case 'safe':
      return (<span className={`${colorVariant(variant)} opacity-90`}>is safe</span>);
    case 'killed':
      return (<span className={`${colorVariant(variant)} opacity-90`}>is killed</span>);
    default:
      return <span></span>;
  }
}

const GameTextVariant: React.FC<GameTextVariantType> = ({ variant, timestamp, text, number, isLastIndex }) => {
  return (
    <div className={`flex justify-between gap-2 w-[100%] items-center text-black dark:text-white px-3 ${!isLastIndex && "border-b-[1px]"} py-2`}>
      <div className="flex gap-2 items-center">
        <div 
          className="text-[18px]"
          // style={{
          //   fontWeight: "900",
          //   backgroundImage: 'linear-gradient(180deg, #F00000 0%, rgba(252, 231, 45, 0.84) 16.15%, rgba(115, 239, 17, 0.58) 41.67%, rgba(13, 243, 133, 0.37) 63.02%, rgba(20, 137, 245, 0.25) 75%, rgba(79, 2, 243, 0.00) 82.29%)',
          //   // backgroundImage: '-webkit-linear-gradient(180deg, #F00000 0%, rgba(252, 231, 45, 0.84) 16.15%, rgba(115, 239, 17, 0.58) 41.67%, rgba(13, 243, 133, 0.37) 63.02%, rgba(20, 137, 245, 0.25) 75%, rgba(79, 2, 243, 0.00) 82.29%)',
          //   // WebkitBackgroundClip: 'text',
          //   // WebkitTextFillColor: 'transparent',

          //   // WebkitBackgroundClip: 'text',
          //   WebkitBackgroundClip: 'text',
          //   WebkitTextFillColor: 'transparent',

          // }}
        >{number}</div>
        <div className="md:w-[250px] w-[195px]">
          <p className="text-[14px] dark:text-white light:text-black">{textVariant(variant)} {text}</p>
        </div>
      </div>
      <p className="text-[12px] text-[#999]">{timestamp} ago</p>
    </div>
  )
}

export default GameTextVariant;