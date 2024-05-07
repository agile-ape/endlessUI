import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { MouseEventHandler, FC } from 'react'
import { Button } from './shadcn/button'
import { TWITTER_URL, TELEGRAM_URL } from '../../services/constant'
import HowToPlay from './ui/HowToPlay'
import Referral from './ui/Referral'
import { useStoreActions, useStoreState } from '../../store'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useAccount, useBalance, useWalletClient } from 'wagmi'

function Header() {
  const handleOnMouseDown: MouseEventHandler = () => {
    location.reload()
  }

  const { address, isConnected } = useAccount()

  const { xs } = useWindowSize()

  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 justify-center items-center py-3 px-5">
        {/* Logo */}
        <div className="flex justify-center lg:justify-start order-1">
          <div
            className="
              py-0 \
              text-[32px] \
              text-gray-200 \
              capitalized font-digit text-center cursor-pointer relative"
            onMouseDown={handleOnMouseDown}
          >
            <span className="text-gray-700">8888</span>
            <span className="absolute top-0 left-0">LAST</span>
          </div>
        </div>

        {/* Rest */}
        <div className="flex flex-col sm:flex-row justify-self-end gap-3 items-center space-x-4 order-3">
          <div className="flex gap-2">
            {isConnected ? <Referral /> : <></>}

            <HowToPlay />
          </div>

          <div className="flex">
            <a href={TWITTER_URL} target="_blank">
              <Button variant="link" className="px-2 text-lg">
                {xs ? '🐦' : 'Follow 🐦'}
              </Button>
            </a>
            <a href={TELEGRAM_URL} target="_blank">
              <Button variant="link" className="px-2 text-lg">
                {xs ? '🧑‍🤝‍🧑' : 'Telegram 🧑‍🤝‍🧑'}
              </Button>
            </a>
          </div>
          <div>
            <ConnectButton chainStatus="name" label="Connect" />
            {/* <CustomConnectButton /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
