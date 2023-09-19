import Round from '../ui/Round'
import Title from '../ui/Title'
import GameTab from '../ui/GameTab'
// import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'
import {
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { etherUnits, parseUnits, formatEther } from 'viem'
import { useStoreActions, useStoreState } from '../../../store'
import dynamic from 'next/dynamic'
import type { GetServerSideProps } from 'next'
import { toast } from '../ui/use-toast'
import { createTicket, getTickets } from '../../../services/api'
import { useRouter } from 'next/router'
import { transformToTicket } from '@/lib/utils'

function BeginningsScreen() {
  const round = useStoreState((state) => state.round)
  const router = useRouter()

  const updateTickets = useStoreActions((actions) => actions.updateTickets)

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
    data,
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
    hash: data?.hash,
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

  console.log({ txData, data })

  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Beginnings </p>
        <Round round={round} phaseType={'beginnings'} />
        <Title stageType={'beginnings'} />
      </div>

      <GameTab isCouldBuyTicket={true} onBuy={onBuy} />

      {/* <Ticket isCouldBuyTicket={true} onBuy={write} /> */}

      <Countdown timeFlag={0} countdownTime={0} />
      <TicketList stage="beginning" />
    </div>
  )
}

// BeginningsScreen.theme = 'dark'

export default dynamic(() => Promise.resolve(BeginningsScreen), {
  ssr: false,
})
