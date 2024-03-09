import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { MouseEventHandler, FC } from 'react'
import { Button } from './ui/button'
import { DOCS_URL, TWITTER_URL, TELEGRAM_URL, BLOG_URL } from '../../services/constant'
import HowToPlay from './ui/HowToPlay'

function Header() {
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
         text-[#FCFDC7] \
        capitalized font-digit text-center cursor-pointer"
              onMouseDown={handleOnMouseDown}
            >
              last
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

              <ConnectButton label="Connect" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
