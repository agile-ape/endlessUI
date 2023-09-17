import Round from '../ui/Round'
import Title from '../ui/Title'
import GameTab from '../ui/GameTab'
// import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { parseUnits } from 'viem'
import { useStoreState } from '../../../store'
import dynamic from 'next/dynamic'
import type { GetServerSideProps } from 'next'
import { toast } from '../ui/use-toast'

function BeginningsScreen() {
  const round = useStoreState((state) => state.round)

  const onBuy = async () => {
    try {
      write()
      // const addTicket = await fetch('/api/ticket', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     ticket_id: 1,
      //     ticket_value: '0.002',
      //   }),
      // })

      // const data = await addTicket.json()
      // console.log({ data })
    } catch (error) {
      console.log({ error })
    }
  }

  const { data, writeAsync, error, write } = useContractWrite({
    ...defaultContractObj,
    functionName: 'buyTicket',
    value: parseUnits('0.002', 18),
    onError: (error) => {
      console.log({ error: error?.cause })
      // @ts-ignore
      const errorMsg = error?.cause?.shortMessage || error?.message
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
