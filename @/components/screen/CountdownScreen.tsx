import Round from '../ui/Round'
import Title from '../ui/Title'
// import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'
import AllPrize from '../ui/AllPrize'
import PrizeInfo from '../ui/PrizeInfo'
import dynamic from 'next/dynamic'
import GameTab from '../ui/GameTab'
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { useStoreActions, useStoreState } from '../../../store'
import { useRouter } from 'next/router'
import { createTicket, getTickets } from '../../../services/api'
import { transformToTicket } from '@/lib/utils'
import { formatEther, parseUnits } from 'viem'
import { toast } from '../ui/use-toast'

function CountdownScreen() {
  const { isConnected } = useAccount()
  const round = useStoreState((state) => state.round)
  const updateTickets = useStoreActions((actions) => actions.updateTickets)
  const router = useRouter()

  const refreshData = async () => {
    const data = await getTickets()
    if (data?.data?.length > 0) {
      const tickets = transformToTicket(data.data)
      updateTickets(tickets)
    }

    router.replace(router.asPath)
  }

  useContractEvent({
    ...defaultContractObj,
    eventName: 'NewTicketPurchased',
    listener: async (event) => {
      const args = event[0]?.args
      const { currentPrizePool, player, ticketId, ticketValue, purchaseTime } = args

      await createTicket({
        id: Number(ticketId),
        user_address: player as string,
        purchase_time: new Date(Number(purchaseTime)).getTime(),
        ticket_value: Number(ticketValue),
      })

      refreshData()
    },
  })

  const { data: currentPrize } = useContractRead({
    ...defaultContractObj,
    functionName: 'nextTicketPrize',
  })

  const ticketValue = currentPrize
    ? parseUnits(formatEther(currentPrize), 18)
    : parseUnits('0.002', 18)

  const onBuy = async () => {
    try {
      write()
    } catch (error) {
      console.log({ error })
    }
  }

  const {
    data: buyTicketData,
    writeAsync,
    error,
    write,
    isLoading: isBuyingTicket,
  } = useContractWrite({
    ...defaultContractObj,
    functionName: 'buyTicket',
    value: ticketValue,
    onSuccess(data, variables, context) {
      console.log({ data, variables, context })
    },
    onError: (error) => {
      console.log({ error: error?.cause })
      // @ts-ignore
      const errorMsg = error?.cause?.reason || error?.cause?.shortMessage || error?.message
      toast({
        variant: 'destructive',
        title: 'Buy ticket failed',
        description: <p className="text-base">{errorMsg}</p>,
      })
    },
  })

  const { data: txData } = useWaitForTransaction({
    hash: buyTicketData?.hash,
  })

  if (txData?.transactionHash) {
    toast({
      title: 'Buy ticket success',
      description: (
        <p className="text-base">
          Transaction Details:
          <a
            href={`https://goerli.arbiscan.io/tx/${txData?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            View on Block Explorer
          </a>
        </p>
      ),
    })
  }

  const { data } = useContractReads({
    contracts: [
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

  let timeFlag = 0
  let countdownTime = 0

  if (data && data?.length > 0) {
    timeFlag = Number(data[0]?.result)
    countdownTime = Number(data[1]?.result) || 0

    console.log('countdownTime', countdownTime)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <Round />
        <p className="text-3xl font-headline uppercase beginnings-last my-2"> Countdown </p>
        <Countdown timeFlag={timeFlag} countdownTime={countdownTime} />
        
        <Title stageType={'countdown'} />
        <div className="flex justify-center items-center text-sm">
          <AllPrize />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 xl:mx-[150px] mb-8">
        <div>
          <div
            className="flex flex-col gap-3 rounded-xl px-4 py-4
            lg:bg-slate-300 lg:bg-opacity-50 lg:border-2 lg:border-slate-400/50
            dark:lg:bg-slate-500 dark:lg:bg-opacity-50"
          >
            <GameTab />
          </div>
        </div>

        <div 
          className="grow rounded-xl py-2
          bg-slate-300 bg-opacity-50 border-2 border-slate-400/50
          dark:lg:bg-slate-500 dark:lg:bg-opacity-50"
        >
          <TicketList stage="beginning" />
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(CountdownScreen), {
  ssr: false,
})
