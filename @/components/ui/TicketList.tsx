import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from './button'
import { Gem, Users } from 'lucide-react'
import TicketUI from './TicketUI'
import { useStoreState } from '../../../store'
import { useContractWrite, useContractReads, useContractEvent } from 'wagmi'
import { defaultContractObj } from '../../../services/constant'
import { fetcher, formatNumber, tokenConversion, transformToTicket } from '@/lib/utils'
import { formatUnits, parseUnits } from 'viem'
import useSWR from 'swr'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Ticket } from 'types/app'
// type TicketListType = {
//   stage: string
// }

const TicketList = () => {
  const phase = useStoreState((state) => state.phase)

  const { data: ticketsData, error } = useSWR<{
    data: Ticket[]
  }>('/tickets?page=1&limit=30&sortOrder=ASC&sortBy=purchasePrice', fetcher)

  const [ticketState, setTicketState] = useState<string>('aroundMe')
  const [ticketListState, setTicketListState] = useState<Ticket[]>([])

  let ticketList: Ticket[] = []

  if (ticketsData?.data.length) {
    ticketList = transformToTicket(ticketsData?.data).filter(
      (item) => item.player !== '0x0000000000000000000000000000000000000000',
    )
  }

  useEffect(() => {
    if (ticketsData?.data.length) {
      setTicketListState(ticketList)
    }
  }, [ticketsData])

  const totalTicketCount = ticketListState.length

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...defaultContractObj,
        functionName: 'currentPot',
      },
      {
        ...defaultContractObj,
        functionName: 'totalPot',
      },
      {
        ...defaultContractObj,
        functionName: 'ticketCount',
      },
    ],
  })

  const currentPot = data?.[0].result || BigInt(0)
  const totalPot = data?.[1].result || BigInt(0)
  const ticketCount = data?.[2].result || BigInt(0)

  const ethLeft = formatUnits(currentPot, 18)
  const totalETH = formatUnits(totalPot, 18)

  const { theme, forcedTheme } = useTheme()

  // new ticket bought
  useContractEvent({
    ...defaultContractObj,
    eventName: 'NewTicketBought',
    listener: (event) => {
      refetch()
    },
  })

  // const { data, write } = useContractWrite({
  //   ...defaultContractObj,
  //   functionName: 'checkTicket',
  //   onSuccess(data, variables, context) {
  //     console.log({ data })
  //   },
  //   onError(error, variables, context) {
  //     console.log({ error })
  //   },
  // })

  function toggleTab(tab: string) {
    setTicketState(tab)
    const nextTicketList = [...ticketList]

    if (tab === 'inPlay') {
      const inPlayList = nextTicketList.filter((item) => item.isInPlay)
      setTicketListState(inPlayList)
    } else if (tab === 'mostValue') {
      const notInPlayList = nextTicketList.filter((item) => !item.isInPlay)
      setTicketListState(notInPlayList)
    } else if (tab === 'safehouse') {
      const safehouseList = nextTicketList.filter(
        (item) => item.isInPlay && item.safehouseNights > 0,
      )
      setTicketListState(safehouseList)
    } else {
      setTicketListState(ticketList)
    }
  }

  return (
    <>
      <summary
        className="list-none
        relative px-6 py-0 flex flex-col"
      >
        <div className="flex flex-col items-center md:flex-row">
          <div className="flex text-2xl gap-3 text-zinc-500 dark:text-zinc-200 items-center grow leading-7 capitalize py-2">
            {/* <span className=""> Players</span> */}

            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    <Users size={24} className="mr-1" />
                    <div className="text-3xl flash text-amber-600 dark:text-amber-300 tracking-wide">
                      {Number(ticketCount)}
                    </div>
                    {/* {phase !== 'start' && <span className="text-md">/{totalTicketCount}</span>} */}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1 max-w-[240px] text-sm">Players left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row items-center cursor-default text-md tracking-wide">
                    {/* <Gem size={18} className="mr-1" /> */}

                    {forcedTheme === 'dark' ? (
                      <Image
                        priority
                        src="/logo/eth-dark.png"
                        className="mr-1"
                        height={14}
                        width={14}
                        alt="eth"
                      />
                    ) : (
                      <Image
                        priority
                        src="/logo/eth-light.png"
                        className="mr-1"
                        height={14}
                        width={14}
                        alt="eth"
                      />
                    )}
                    <div className="text-3xl flash text-amber-600 dark:text-amber-300 tracking-wide">
                      {formatNumber(ethLeft, {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 3,
                      })}
                      <span className="text-xl text-end">ETH</span>
                    </div>
                    {/* {phase !== 'start' && <span className="text-md">/{totalETH}</span>} */}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p className="px-3 py-1 max-w-[240px] text-sm">Value in Pot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-3 justify-center my-2">
            <Button
              onClick={() => toggleTab('aroundMe')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'aroundMe'}
            >
              Around Me
            </Button>
            <Button
              onClick={() => toggleTab('inPlay')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'inPlay'}
            >
              In Play
            </Button>

            {/* exit or dead */}
            <Button
              onClick={() => toggleTab('mostValue')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'mostValue'}
            >
              Not In Play
            </Button>
            <Button
              onClick={() => toggleTab('safehouse')}
              variant="filter"
              className="text-sm rounded-full h-8 px-3 py-2"
              disabled={ticketState === 'safehouse'}
            >
              In Safehouse
            </Button>
          </div>
        </div>
      </summary>

      {!totalTicketCount && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center place-content-center">
            <div className="relative">
              <Image
                priority
                src="/pepe/sun.svg"
                className="place-self-center animate-pulse"
                height={300}
                width={300}
                alt="sneak-a-peek-pepe"
              />

              <div className="absolute top-[50px]">
                <Image
                  priority
                  src="/pepe/pepe-robe.svg"
                  className="place-self-center"
                  height={300}
                  width={300}
                  alt="sneak-a-peek-pepe"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {totalTicketCount && (
        <div
          className="
            flex
            w-[100%]
            justify-evenly
            sm:justify-start
            gap-x-6
            gap-y-6
            flex-wrap
            px-6 py-6
            overflow-y-scroll max-h-[750px]
          "
        >
          {ticketListState.map((item, i) => (
            <TicketUI
              key={item.id}
              ownTicket={false}
              ticketNumber={item.id}
              // ticketLookInput={'afterPurchase'}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default TicketList
