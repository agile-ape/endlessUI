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
import UserActions from '../ui/UserActions'
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
import GameStats from '../ui/GameStats'

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
    // <div className="flex flex-col gap-2">

    <div className="flex flex-col xl:mx-[150px] pb-8">
      <div className="text-center">
        {/* <p className="text-xl">Game: Pilot</p> */}
        <Title stageType={'countdown'} />
      </div>
      {/* top container */}
      <div className="flex flex-col mb-2">
        <div className="flex justify-between px-5 py-2">
          <Round />
          <div className="flex items-center gap-4">
            <p className="text-4xl font-headline uppercase beginnings-last my-2"> Countdown </p>
            <Countdown timeFlag={timeFlag} countdownTime={countdownTime} />
          </div>
        </div>
        <div>
          <GameStats />
        </div>
      </div>

      {/* bottom container */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-2 lg:container-last">
          <GameTab />
          <UserActions />
        </div>

        <div className="grow rounded-xl py-2 container-last">
          <TicketList stage="beginning" />
        </div>
      </div>
    </div>
    // </div>
  )
}

export default dynamic(() => Promise.resolve(CountdownScreen), {
  ssr: false,
})
