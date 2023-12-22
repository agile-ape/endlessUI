import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../@/components/ui/button'
import type { FC } from 'react'
import GameTab from '@/components/ui/GameTab'

type MobileType = {
  page: string
}

const Mobile: FC<MobileType> = ({ page }) => {
  return (
    <div className="flex flex-col mx-auto gap-4 justify-center items-center mt-[50px] text-white text-2xl">
      {page === 'you' && <GameTab />}
    </div>
  )
}

export default Mobile
