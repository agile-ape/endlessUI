import React from 'react'
import type { FC } from 'react'
import Image from 'next/image'

interface PrizeAmountType {
  category: string
  amount: string
  logoHeight: number
  logoWidth?: number
}

type CategoryWordingVariants = {
  total: Element
  redeem: Element
  win: Element
  bounty: Element
}

const categoryLogo = {
  total: 'diamond.svg',
  redeem: 'present.svg',
  win: 'wallet.svg',
  bounty: 'bounty.svg',
}

const PrizeAmount: FC<PrizeAmountType> = ({
  amount,
  category,
  logoHeight = 24,
  logoWidth = 24,
}) => {
  return (
    <div className="flex">
      <Image
        priority
        src={`/logo/${categoryLogo[category as keyof CategoryWordingVariants]}`}
        height={logoHeight}
        width={logoWidth}
        alt={category}
      />
      <p className="ml-1">0.0822</p>
    </div>
  )
}

export default PrizeAmount
