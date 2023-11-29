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
    ],
    enabled: isConnected,
  })

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
            <p className="text-left">$LAST in wallet</p>
            <p className="text-right"> 100 </p>
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
