import React, { useState, useEffect } from 'react'
import Square from './Square'
import { GameSwitch } from '@/components/shadcn/game-switch'
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ConnectWalletButton } from './ConnectWalletButton'
import Button from './Button'
import Entry from './Entry'

function GameBoy() {
  const [isPlay, setIsPlay] = useState(false)
  const [isGame, setIsGame] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [showIndex, setShowIndex] = useState<number>(0) // Initialize showValue state
  const [showAmountBought, setShowAmountBought] = useState<number>(0) // Initialize showValue state

  useEffect(() => {
    // Add any initialization logic here
  }, [])

  // Round info
  const round: number = 1

  // Game info
  const ticketId: number = 1
  const totalNumber: number = 1000
  const currentAverage: number = 1000
  const winnersPot: number = 1000
  const playersPot: number = 1000
  const winnersSplit: number = 1000
  const playersPayoutFactor: number = 1000

  // Game settings
  const ticketPrice: number = 1
  const winnersShare: number = 1
  const playersShare: number = 1
  // const minAllowedNumber
  // const maxAllowedNumber
  const gameTime: number = 1
  const timeAddon: number = 1

  const minTicketPrice: number = 1
  const maxTicketPrice: number = 1
  const minWinnersShare: number = 1
  const maxWinnersShare: number = 1
  const minAllowedNumber: number = 1
  const maxAllowedNumber: number = 1
  const minGameTime: number = 1
  const maxGameTime: number = 1
  const minTimeAddon: number = 1
  const maxTimeAddon: number = 1

  // Ticket info
  // const round: number = 1
  // const ticketId: number = 1
  // const player: number = 1
  // const number: number = 1
  // const isWinner: number = 1
  // const isClaimed: number = 1

  const startGameFlag: number = 1
  const endGameFlag: number = 1
  const canBuyTicket: number = 1
  const nonReentrancy: number = 1
  const closeTime: number = 1

  const potAmount: number = 1

  // const handleToggle = () => setIsOn(!isOn)
  const handleStart = () => setIsStarted(!isStarted)

  return (
    <div className="w-[1240px] mx-auto my-4 bg-[#c0c0c0] flex flex-col rounded-2xl border-t-4 border-l-4 border-[#ffffff] border-r-4 border-b-4 border-r-[#808080] border-b-[#808080]">
      <div className="flex relative border-b-8 border-[#adabab]">
        <div className="h-10 w-10 border-r-8 border-[#adabab]"></div>

        {/* <div className="flex justify-between"> */}
        <div className="flex-grow flex items-center">
          <span className="font-['VT323',monospace] uppercase text-2xl text-gray-500 mx-2">
            GAME
          </span>

          <GameSwitch
            defaultChecked={isGame}
            checked={!isGame}
            onCheckedChange={() => setIsGame(!isGame)}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary hover:scale-[1.1]"
          />
          <span className="font-['VT323',monospace] uppercase text-2xl text-gray-500 mx-2">
            RULES
          </span>
        </div>

        <div className="">
          <ConnectWalletButton />
        </div>
        {/* </div> */}

        <div className="h-10 w-10 border-l-8 border-[#adabab]"></div>
      </div>

      {/* <div className="mx-10 my-4 border-[48px] border-[#5d5b7e] bg-[#f0ece5] rounded-2xl relative"> */}
      {/* Switch */}
      {/* <div className="absolute -left-10 top-8">
          <div className="flex flex-col text-black justify-center items-center">
            <div>PLAY</div>
            <div
              className={`h-4 w-4 rounded-full z-10 transition-colors duration-300 border border-[#c0c0c0] ${isPlay ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <div>CLAIM</div>
          </div>
        </div> */}

      <div className="overflow-auto bg-[#c0c0c0] px-8 flex flex-col gap-2">
        {/* $$$ */}
        {/* <div className="mx-auto">
          <div className="grid grid-cols-3 gap-4 text-gray-500 gap-2">
            <Entry label="Price(ETH)" value={1} />
            <Entry label="Bought" value={100} />
            <Entry label="Pot(ETH)" value={100} />
          </div>
        </div> */}

        {/* <div className="bg-[#c0c0c0] p-4 border-t-4 border-l-4 border-[#ffffff] border-r-4 border-b-4 border-r-[#808080] border-b-[#808080]"> */}
        {/* Notice board */}

        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-b-[#808080] border-r-[#808080] flex items-center justify-center text-black font-bold text-lg select-none">
            <div className="bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="flex justify-center items-center text-black text-[32px] leading-none">
                😃
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex gap-4 w-[480px]">
          {/* $$$ */}
          <Entry label="Round" value={round} textColor={'red-600'} />
          <Entry label="Average" value={currentAverage} textColor={'red-600'} />

          <div className="mx-auto">
            <div className="grid grid-rows-3 gap-1 text-gray-500">
              <Entry label="Price" value={ticketPrice} textColor={'red-600'} />
              <Entry label="Bought" value={ticketId} textColor={'red-600'} />
              <Entry label="Pot" value={potAmount} textColor={'red-600'} />
            </div>
          </div>

          {/* ### */}
          <div className="mx-auto">
            <div className="grid grid-rows-3 gap-2 text-gray-500 gap-2">
              {/* <Entry label="Bought" value={100} /> */}
              {/* <Entry label="Average" value={1000} /> */}
              <Entry label="Sum" value={totalNumber} textColor={'red-600'} />
              <Entry label="Winners Pot" value={winnersPot} textColor={'red-600'} />
              <Entry label="Players Pot" value={playersPot} textColor={'red-600'} />
              <Entry label="Winners Share" value={winnersShare} textColor={'red-600'} />
              <Entry label="Players Share" value={playersShare} textColor={'red-600'} />
              <Entry label="Winners Split" value={winnersSplit} textColor={'red-600'} />
              <Entry
                label="Players Payout Factor"
                value={playersPayoutFactor}
                textColor={'red-600'}
              />
              <Entry label="Game Time" value={gameTime} textColor={'red-600'} />
              <Entry label="Time Addon" value={timeAddon} textColor={'red-600'} />
            </div>
          </div>
        </div>

        {/* Minesweeper grid would go here */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(30px,1fr))] overflow-y-auto overflow-x-hidden h-[400px] bg-[#c0c0c0] border-t-4 border-l-4 border-[#808080] border-r-4 border-b-4 border-r-[#ffffff] border-b-[#ffffff] gap-1">
          {[...Array(1000)].map((_, index) => (
            <Square
              key={index}
              onMouseEnter={() => {
                setShowIndex(index)
                setShowAmountBought(100)
              }} // Update showValue and showAmountBought on hover
              onMouseLeave={() => setShowIndex(0)} // Reset showValue when not hovering
            />
          ))}
        </div>
        {/* </div> */}

        {/* Squares */}
        {/* <div className="border border-gray-500">
            <div className="grid grid-flow-row auto-row-min gap-1">
              {[...Array(1000)].map((_, index) => (
                <Square key={index} />
              ))}
            </div>
          </div> */}

        {/* Player stats */}
        <div className="flex flex-row text-gray-500 gap-2">
          {/* <Entry label="Number" value={23} />
            <Entry label="Bought" value={100} /> */}
          <Entry label="#" value={showIndex | 0} textColor={'yellow-500'} />
          <Entry label="Amount bought" value={showAmountBought | 0} textColor={'yellow-500'} />
        </div>
      </div>

      {/* </div> */}

      <div className="flex justify-center mb-2">
        <Button onClick={handleStart} label="start" />

        {/* <label className="flex flex-col justify-center items-center">
          <input
            type="checkbox"
            className="opacity-0 w-0 h-0"
            checked={isStarted}
            onChange={handleStart}
          />
          <div className="bg-gray-500 rounded-2xl cursor-pointer transition-all duration-600 z-10">
            <span className="inline-block rounded-2xl bg-[#5d5b7e] font-['VT323',monospace] uppercase text-2xl text-black px-6 py-2 z-10 -translate-y-[0.4rem] transition-transform duration-150 hover:-translate-y-[0.6rem] active:-translate-y-[0.125rem]">
              start
            </span>
          </div>
        </label> */}
      </div>
    </div>
  )
}

export default GameBoy
