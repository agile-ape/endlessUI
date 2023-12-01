import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { Button } from './button'
import { useAccount, useContractEvent, useContractReads } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'

export default function Admin() {
  const { isConnected } = useAccount()

  const { data } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'round',
      },
      {
        ...defaultContractObj,
        functionName: 'phase',
      },
      {
        ...defaultContractObj,
        functionName: 'nextTicketPrice',
      },
      {
        ...defaultContractObj,
        functionName: 'timeFlag',
      },
      {
        ...defaultContractObj,
        functionName: 'countdownTime',
      },
    ],
    enabled: isConnected,
  })

  const timeFlag = Number(data[3]?.result || 0)

  const timeFlagInDate = new Date(timeFlag * 1000)

  console.log(timeFlag)

  type TimeLeftType = {
    // days: number;
    hours: number
    minutes: number
    seconds: number
  }

  const formatTime = (timeInSeconds: number): TimeLeftType => {
    let hours = Math.floor(timeInSeconds / 3600)
    let minutes = Math.floor((timeInSeconds % 3600) / 60)
    let seconds = Math.floor(timeInSeconds % 60)

    return {
      hours,
      minutes,
      seconds,
    }
  }

  // let timeFlagInDate = formatTime(new Date(timeFlag).getTime())
  // console.log(timeFlag)
  // let timeFlagInDate = new Date(timeFlag)

  /*------THINGS TO MONITOR

  OZ relayer ETH balance
  


  ----------*/

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <p className="text-zinc-600 dark:text-zinc-200 whitespace-nowrap bg-transparent focus: outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline h-10 border rounded-xl px-4 py-2 text-md font-whitrabt">
          Admin
        </p>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-opacity-100 dark:bg-opacity-100 mt-2 container-last flex flex-col justify-center w-[30rem] p-5 bg-white"
      >
        <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
          <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
            <p className="text-left">Time Flag</p>
            <p className="text-right">
              <p>Current Date: {timeFlagInDate.toDateString()}</p>
              <p>Current Time: {timeFlagInDate.toLocaleTimeString()}</p>
            </p>
          </div>
          <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
            <p className="text-left">Countdown Time</p>
            {/* <p className="text-right"> {countdownTime} </p> */}
          </div>

          <div className="grid grid-cols-2 text-lg justify-between gap-1 text-xl">
            <p className="text-left">Nights stayed</p>
            <p className="text-right"> 100 </p>
          </div>

          <div className="grid grid-cols-2 text-lg justify-between gap-1">
            <p className="text-left">Price per night</p>
            <p className="text-right"> 100 $LAST </p>
          </div>
        </div>

        <div className="text-center">Gamemaster functions</div>

        <Button variant="primary" className="px-4 py-2 text-md rounded-xl">
          Start game
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
