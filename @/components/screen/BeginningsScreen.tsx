import Round from '../ui/Round'
import Title from '../ui/Title'
import Ticket from '../ui/Ticket'
// import CheckInBox from './ui/CheckIn'
import Countdown from '../ui/Countdown'
// import CheckIn from '../ui/CheckIn'
// import NextClaim from '../ui/NextClaim'
import TicketList from '../ui/TicketList'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { parseUnits } from 'viem'

function BeginningsScreen() {
  const { data, writeAsync, error, write } = useContractWrite({
    ...defaultContractObj,
    functionName: 'buyTicket',
    value: parseUnits('0.001', 18),
  })

  const { data: txData } = useWaitForTransaction({
    hash: data?.hash,
  })

  console.log({ txData, data })

  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Beginnings </p>
        <Round round={0} stageType={'beginnings'} />
        <Title stageType={'beginnings'} />
      </div>

      <Ticket isCouldBuyTicket={true} onBuy={write} />

      <Countdown />
      <TicketList stage="beginning" />
    </div>
  )
}

BeginningsScreen.theme = 'light'

export default BeginningsScreen
