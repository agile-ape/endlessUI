import React, { useEffect, useState, useCallback } from 'react'
import type { PropsWithChildren } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import { useStoreActions, useStoreState } from '../../../store'

import { useAccount } from 'wagmi'
import { GAME_ADDRESS, TWITTER_URL, defaultContractObj } from '../../../services/constant'
import { cn } from '@/lib/utils'
import type { Ticket } from 'types/app'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/*-------------------------------------- DOT BUTTONS -------------------------------------- */

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  // when clicked on index -
  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  }
}

type DotButtonPropType = PropsWithChildren<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>

export const DotButton: React.FC<DotButtonPropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  )
}

/*-------------------------------------- Prev Next Buttons --------------------------------------*/

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  }
}

type PrevNextPropType = PropsWithChildren<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>

export const PrevButton: React.FC<PrevNextPropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button className="" type="button" {...restProps}>
      <ChevronLeft
        size={48}
        className="text-gray-400 hover:text-white active:opacity-75 m-1 p-1 cursor-pointer"
      />
      {children}
    </button>
  )
}

export const NextButton: React.FC<PrevNextPropType> = (props) => {
  const { children, ...restProps } = props

  return (
    <button className="" type="button" {...restProps}>
      <ChevronRight
        size={48}
        className="text-gray-400 hover:text-white active:opacity-75 m-1 p-1 cursor-pointer"
      />

      {children}
    </button>
  )
}

const YourTickets = () => {
  const { address, isConnected } = useAccount()

  const ownedTickets = useStoreState((state) => state.ownedTickets)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
  const toggleLoad = () => setShowLoadModal((prevState) => !prevState)

  const [showExitModal, setShowExitModal] = React.useState<boolean>(false)
  const toggleExit = () => setShowExitModal((prevState) => !prevState)

  let ticket: Ticket | undefined = {
    id: 0,
    player: address as `0x${string}`,
    isInPlay: false,
    value: 0,
    purchasePrice: 0,
    redeemValue: 0,
    potClaimCount: 0,
    passRate: 0,
    joinRound: 0,
    exitRound: 0,
    logs: [],
  }

  return (
    <div className="flex flex-col gap-4 my-2 items-center justify-center mx-auto">
      <p className="py-2 text-2xl text-gray-400 capitalized flex justify-center">Your keys</p>
      <div className="flex">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <section className="mx-auto">
          <div className="w-[250px] overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-x">
              {/* {isConnected ? <TicketUI id={1} number={2301} /> : <TicketUI id={1} number={2301} />} */}
              <li>
                <TicketUI id={1} number={2301} />
              </li>
              <li>
                <TicketUI id={1} number={2301} isWinner={true} />{' '}
              </li>
              <li>
                <TicketUI id={1} number={2301} />{' '}
              </li>
              {/* <TicketUI id={2} number={2301} /> */}
              {/* <TicketUI id={3} number={2301} /> */}
              {/* {ownedTickets.map((ticket) => (
                    <div className="mx-2" key={ticket.id}>
                      <TicketUI id={ticket.id} number={ticket.number} />
                      </div>
                    ))} */}
            </div>
          </div>
        </section>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="flex flex-row justify-center items-center">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                index === selectedIndex ? 'border-2 border-black' : '',
                'w-3 h-3 bg-gray-400 rounded-full m-1 p-0 border-none cursor-pointer',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default YourTickets
