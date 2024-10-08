import React, { useRef, useState, useEffect } from 'react'
import Title from '../ui/Title'
import Countdown from '../ui/Countdown'
import PotSize from '../ui/PotSize'
import Average from '../ui/Average'
import BuyTicket from '../ui/BuyTicket'
import YourTickets from '../ui/YourTickets'
import GameEnd from '../ui/GameEnd'
import { useAccount, useReadContracts, useSendTransaction, useWatchContractEvent } from 'wagmi'
import {
  defaultContractObj,
  CRYTPOCOMPARE_ENDPOINT,
  GAME_ADDRESS,
} from '../../../services/constant'
import { toast } from '@/components/shadcn/use-toast'
// import { toast } from '@/components/shadcn/sonner'
import useSWR, { useSWRConfig } from 'swr'
import { fetcher, poster, isJson, formatNumber } from '@/lib/utils'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../../store'
import { number } from 'zod'

type Number = {
  chainId: number
  contractAddress: string
  ticketId: number
  selectedNumber: number
  averageNumber: number
  updatedAtTx: string
}

export default function DesktopScreen() {
  const { address, isConnected } = useAccount()
  const [expanded, setExpanded] = useState<boolean>(false)

  const lowerCaseAddress = String(address?.toLowerCase())

  const updateNumberList = useStoreActions((actions) => actions.updateNumberList)
  const updateAverageList = useStoreActions((actions) => actions.updateAverageList)
  const updateReferralList = useStoreActions((actions) => actions.updateReferralList)
  const updateReferral = useStoreActions((actions) => actions.updateReferral)
  const canBuyTicket = useStoreState((state) => state.canBuyTicket)
  const endGameFlag = useStoreState((state) => state.endGameFlag)
  const updateGameEndModal = useStoreActions((actions) => actions.updateGameEndModal)
  const modalState = useStoreState((state) => state.GameEndModal)
  const updateEthPrice = useStoreActions((actions) => actions.updateEthPrice)

  useEffect(() => {
    fetchPrice()
    if (endGameFlag) {
      updateGameEndModal({
        isOpen: true,
      })
    }
  }, [])

  // useWatchContractEvent({
  //   ...defaultContractObj,
  //   eventName: 'GameEnd',
  //   onLogs() {
  //     toast({
  //       variant: 'bought',
  //       description: <p className="text-xl">🔑 A key is bought</p>,
  //     })
  //   },
  //   poll: true,
  // })

  // useWatchContractEvent({
  //   ...defaultContractObj,
  //   eventName: 'PotAdded',
  //   onLogs() {
  //     toast({
  //       variant: 'contributed',
  //       description: <p className="text-xl">🍎 Someone added to the pot</p>,
  //     })
  //   },
  //   poll: true,
  // })

  const { mutate: globalMutate } = useSWRConfig()

  // const {
  //   data: ethPrice,
  //   error: ethPriceError,
  //   // mutate,
  // } = useSWR(
  //   // <{data: Number[]}>
  //   '/data/price?fsym=ETH&tsyms=USD',
  //   fetchPrice,
  //   { refreshInterval: 100000 },
  // )

  async function fetchPrice() {
    try {
      const response = await fetch(CRYTPOCOMPARE_ENDPOINT)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const json = await response.json()

      updateEthPrice(json.USD)

      return json
    } catch (error) {
      console.log({ error })
      throw new Error('Failed to fetch API')
    }
  }

  let numberList: number[] = []
  let averageList: number[] = []
  let referralAddress: string = ''

  const {
    data: numbersData,
    error: numbersError,
    isLoading,
    // mutate,
  } = useSWR(
    // <{data: Number[]}>
    `/numbers/${GAME_ADDRESS}`,
    fetcher,
    { refreshInterval: 1000 },
  )

  if (numbersError) {
    console.error('Error fetching data:', numbersError)
  }

  // Check if data is available
  if (numbersData) {
    for (let i = 0; i < numbersData.length; i++) {
      numberList.push(numbersData[i].selectedNumber)
      averageList.push(numbersData[i].averageNumber)
    }

    updateNumberList(numberList)
    updateAverageList(averageList)
  }

  const {
    data: referralsData,
    error: referralsError,
    // mutate,
  } = useSWR(
    // <{data: Number[]}>
    `/referrals`,
    fetcher,
    { refreshInterval: 1000 },
  )

  if (referralsError) {
    console.error('Error fetching data:', referralsError)
  }

  // Check if data is available
  if (referralsData) {
    updateReferralList(referralsData)
  }

  const {
    data: playersData,
    error: playersError,
    // isLoading,
    // mutate,
  } = useSWR(
    // <{data: Number[]}>
    `/players/${address}`,
    fetcher,
    { refreshInterval: 1000 },
  )

  if (playersError) {
    console.error('Error fetching data:', playersError)
  }

  // Check if data is available
  if (playersData) {
    const referralCode = playersData?.referralCode
    updateReferral(referralCode)
  }

  // const { data: referralData, error: referralError } = useSWR(
  //   // <{data: Number[]}>
  //   `/referrals/${lowerCaseAddress}`,
  //   fetcher,
  // )

  // if (referralData) {
  //   referralAddress = referralData.referralAddress
  //   isTake = referralData.isTake

  //   updateIsTake(isTake)
  //   updateReferral(referralAddress)
  // }

  // console.log(numbersData[1].chainId)
  // console.log(numbersData[1])
  // console.log(numbersData[2])
  // const { data } = useSWR<{ data: Number[] }>(fetcher('/numbers'))
  // console.log(data)

  // const response = async () => {
  //   const result = await fetch('http://localhost:3001/numbers')
  //   console.log(result)
  // }

  // response()

  // const {
  //   data: numbers,
  //   error,
  //   mutate,
  // } = useSWR('http://localhost:3001/numbers', async (url) => {
  //   const response = await fetch(url)
  //   console.log(response)

  //   if (!response.ok) {
  //     throw new Error('Failed to fetch numbers')
  //   }
  //   // return response.json();
  //   console.log(response.json())
  // })

  // if (error) return <div>Error: {error.message}</div>;
  // if (!numbers) return <div>Loading...</div>;

  // if (error) console.log('error')
  // if (!numbers) console.log('loading')

  // const data = fetcher('/numbers')
  // console.log(data)

  return (
    <>
      <div className="flex flex-col justify-center items-center mx-auto my-4">
        <Title />

        <div
          className="px-2 my-2 \
          outer-last \
          flex flex-col min-w-[220px]"
        >
          <Countdown />
          <PotSize />
        </div>

        {/* <div
          className="px-2 my-2 \
          buy-last \
          flex flex-col min-w-[280px]"
        >
          <BuyTicket />
        </div> */}

        <div className="average-last min-w-[280px]">
          <Average />
        </div>

        <div
          className="px-2 my-2 \
          keys-last \
          flex flex-col min-w-[320px]"
        >
          <YourTickets />
        </div>
      </div>
    </>
  )
}
