import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { Button } from './button'
import GameTextVariant from './GameTextVariant'
import { useStoreState } from '../../../store'
import { cn } from '@/lib/utils'

type TicketType = {
  onBuy?: () => void
  isCouldBuyTicket?: boolean
  isCouldRedeemedTicket?: boolean
}

const bgTicketColor = {
  default: 'linear-gradient(140deg, #0D032D 0%, #1E1049 100%)',
  checked: '#122148',
  checkin: '#10330F',
  dead: '#363636',
  redeemed: '#363636',
  beforeBuy: '#2D2008',
}

const borderTicketColor = {
  default: 'linear-gradient(140deg, #534CFFB2 0%, #534CFF26 100%)',
  checked: '#00B5FF',
  checkin: '#70ED6C',
  dead: '#C2C2C2',
  redeemed: '#C2C2C2',
  beforeBuy: '#7E5F30',
}

const Ticket: React.FC<TicketType> = ({ isCouldBuyTicket, onBuy, isCouldRedeemedTicket }) => {
  const ticketState = useStoreState((state) => state.ticketState)
  const stage = useStoreState((state) => state.stage)

  return (
    <Tabs defaultValue="account" className="w-[85%] mx-auto">
      <div className="flex justify-center">
        <TabsList className="rounded-2xl w-[190px] h-[41px] mx-auto">
          <TabsTrigger value="account" className="rounded-2xl w-[48%] p-1 text-[1rem]">
            Ticket
          </TabsTrigger>
          <TabsTrigger value="password" className="rounded-2xl w-[48%] p-1 text-[1rem]">
            Game
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex justify-center">
        <TabsContent value="account" className="flex flex-col gap-3 p-2">
          <div
            className={cn(
              'p-[4px] rounded-2xl',
              (ticketState === 'dead' || ticketState === 'redeemed') && 'opacity-80',
            )}
            style={{ background: borderTicketColor[ticketState] }}
          >
            <div
              className="w-[220px] rounded-2xl text-white flex flex-col gap-8 py-[1rem] px-[0.5rem]"
              style={{ background: bgTicketColor[ticketState] }}
            >
              <p className="text-center text-[24px]">#03</p>
              <div className="text-center flex flex-col leading-10">
                {ticketState === 'redeemed' ? (
                  <div className="flex justify-center gap-2">
                    <Image priority src={`/logo/medal.svg`} height={30} width={30} alt="skull" />
                    <h2 className="text-[3.5rem]">140</h2>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[4rem]">{ticketState === 'dead' ? '-' : '0.057'}</h2>
                    <p className="text-[1rem]">last seen: 04</p>
                  </>
                )}
              </div>
              <div className="flex justify-around gap-5">
                <div className="flex gap-1">
                  {stage === 'day' || stage === 'night' ? (
                    <>
                      <Image priority src="/icon/bullet.svg" height={24} width={24} alt="skull" />
                      <p className="text-white">10</p>
                    </>
                  ) : (
                    <>
                      <Image priority src="/icon/skull.svg" height={24} width={24} alt="skull" />
                      <Image priority src="/icon/skull.svg" height={24} width={24} alt="skull" />
                      <Image priority src="/icon/skull.svg" height={24} width={24} alt="skull" />
                    </>
                  )}
                </div>
                <div className="flex gap-1">
                  <Image
                    priority
                    src="/icon/crosshair.svg"
                    height={24}
                    width={24}
                    alt="crosshair"
                  />
                  <p className="text-white">-</p>
                </div>
              </div>
            </div>
          </div>
          {isCouldBuyTicket && (
            <Button className="bg-[#31197B] text-[1rem] rounded-xl dark:text-white" onClick={onBuy}>
              Buy Next Ticket
            </Button>
          )}
          {isCouldRedeemedTicket && (
            <Button
              className="bg-[#FFF5F5] hover:bg-[#EEEEEE] text-[1rem] rounded-xl border border-[#F10000] text-[#F10000]"
              onClick={onBuy}
            >
              Redeem Ticket
            </Button>
          )}
        </TabsContent>

        <TabsContent value="password" className="flex flex-col gap-3">
          <div
            className="md:w-[400px] w-[100%] rounded-2xl text-white flex flex-col border border-[#999999]"
            // style={{background: "linear-gradient(140deg, #0D032D 0%, #1E1049 100%)"}}
          >
            <div className="flex flex-col gap-2">
              <GameTextVariant
                variant="triggered_change"
                number={13}
                text="the phase change from day to dusk"
                timestamp="4 minutes"
                isLastIndex={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <GameTextVariant
                variant="new_entry"
                number={14}
                text="for 130ETH. Prize pool is now 100ETH."
                timestamp="4 minutes"
                isLastIndex={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <GameTextVariant
                variant="checked_in"
                number={15}
                text="Ticket value: 10.000ETH"
                timestamp="4 minutes"
                isLastIndex={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <GameTextVariant
                variant="exit"
                number={11}
                text="at Rank 10 with 1.5ETH (0.5 from pool)"
                timestamp="4 minutes"
                isLastIndex={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <GameTextVariant
                variant="safe"
                number={14}
                text="(attacker: 12)"
                timestamp="4 minutes"
                isLastIndex={false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <GameTextVariant
                variant="killed"
                number={13}
                text="(attacker: 12)"
                timestamp="4 minutes"
                isLastIndex={true}
              />
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default Ticket
