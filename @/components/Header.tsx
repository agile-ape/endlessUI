import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { MouseEventHandler, FC } from 'react'
import { Button } from './ui/button'
import { DOCS_URL, TWITTER_URL, TELEGRAM_URL, BLOG_URL } from '../../services/constant'
import HowToPlay from './ui/HowToPlay'
import { useStoreActions, useStoreState } from '../../store'

const useStore = () => {
  // const ownedTicket = useStoreState((state) => state.ownedTicket)
  const tokenBalance = useStoreState((state) => state.tokenBalance)

  return {
    tokenBalance,
  }
}

function Header() {
  const { tokenBalance } = useStore()

  const handleOnMouseDown: MouseEventHandler = () => {
    location.reload()
  }

  return (
    <>
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 gap-2 items-center py-3 px-5">
          <div className="flex justify-start order-1">
            {/* <Logo /> */}
            <div
              className="
            py-4 sm:py-0 \
        text-[36px] sm:text-[28px] \
         text-[#404833] \
        capitalized font-digit text-center cursor-pointer"
              onMouseDown={handleOnMouseDown}
            >
              🐻 pooh
            </div>
          </div>

          <div className="flex justify-self-end gap-3 order-3">
            <div className="flex items-center space-x-4">
              <HowToPlay />
              <a href={TWITTER_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Follow 🐦
                </Button>
              </a>
              <a href={TELEGRAM_URL} target="_blank">
                <Button variant="link" className={`px-2 text-lg`} size="sm">
                  Telegram 🧑‍🤝‍🧑
                </Button>
              </a>

              {/* token holdings */}
              <div
                className="
                
                text-[22px] text-[#404833] text-center capitalized \
                rounded-md px-2 py-0.5 whitespace-nowrap
                "
              >
                POOH: <span className="font-digit">{tokenBalance}</span>
              </div>

              <ConnectButton label="Connect" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
