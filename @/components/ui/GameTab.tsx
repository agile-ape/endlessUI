import React, { useEffect, useState, useCallback } from 'react'
import type { PropsWithChildren } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import Image from 'next/image'
import { Button } from './button'
import TicketUI from './TicketUI'
import { useStoreActions, useStoreState } from '../../../store'

import { useAccount, useContractRead } from 'wagmi'
import { GAME_ADDRESS, TWITTER_URL, defaultContractObj } from '../../../services/constant'
import { cn } from '@/lib/utils'
import Modal from './Modal'
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/shadcn/carousel'
import type { Ticket } from 'types/app'
import { useWindowSize } from '../../../hooks/useWindowSize'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Roll from '@/components/ui/Roll'
import Exit from '@/components/ui/Exit'
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
        className="bg-[#404833] hover:opacity-50 active:opacity-75 text-[#FCFDC7] m-2 p-1 cursor-pointer rounded-full border border-[#404833]"
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
        className="bg-[#404833] hover:opacity-50 active:opacity-75 text-[#FCFDC7] m-2 p-1 cursor-pointer rounded-full border border-[#404833]"
      />

      {children}
    </button>
  )
}

/*-------------------------------------- Carousel --------------------------------------*/

// type PropType = {
//   slides: Ticket[]
//   options?: EmblaOptionsType
// }

// const EmblaCarousel: React.FC<PropType> = (props) => {
//   const { address, isConnected } = useAccount()

//   const { slides, options } = props
//   const [emblaRef, emblaApi] = useEmblaCarousel(options)

//   const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

//   const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
//     usePrevNextButtons(emblaApi)

//   const [showLoadModal, setShowLoadModal] = React.useState<boolean>(false)
//   const toggleLoad = () => setShowLoadModal((prevState) => !prevState)

//   const [showExitModal, setShowExitModal] = React.useState<boolean>(false)
//   const toggleExit = () => setShowExitModal((prevState) => !prevState)

//   let ticket: Ticket | undefined = {
//     id: 0,
//     player: address as `0x${string}`,
//     isInPlay: false,
//     value: 0,
//     purchasePrice: 0,
//     redeemValue: 0,
//     potClaimCount: 0,
//     passRate: 0,
//     joinRound: 0,
//     exitRound: 0,
//     logs: [],
//   }

//   return (
//     <section className="mx-auto">
//       <div className="w-[320px] overflow-hidden" ref={emblaRef}>
//         <div className="flex touch-pan-x">
//           {ownedTickets.map((ticket) => (
//             <div className="" key={ticket.id}>
//               <TicketUI ticketNumber={ticket.id} ticketSize={1} ticket={ticket} />
//             </div>
//           ))}

//           <div className="my-2 mx-2" key={ticket.id}>
//             <div className="flex flex-col gap-2">
//               <TicketUI ticketNumber={1} ticketSize={1} ticket={ticket} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* <div className="flex justify-center">
//         <div
//           className="w-[240px] rounded-xl px-2
//                   container-last
//                   flex flex-col my-6 relative"
//         >
//           <div className="bg-[#FCFC03]/80 rounded-md mt-2">
//             <Button
//               variant="primary"
//               className="p-1 h-12 w-full text-2xl shadow-sm
//                       hover:-translate-y-1 hover:brightness-100 hover:bg-opacity-100
//                   active:-translate-y-0 active:brightness-200"
//               onClick={toggleLoad}
//             >
//               🎲 Reroll
//             </Button>
//           </div>

//           <div className="bg-[#FCFC03]/80 rounded-md mt-4 mb-2">
//             <Button
//               variant="primary"
//               className="p-1 h-12 w-full text-2xl shadow-sm
//                       hover:-translate-y-1 hover:brightness-100 hover:bg-opacity-100
//                   active:-translate-y-0 active:brightness-200"
//               onClick={toggleExit}
//             >
//               🚪 Exit Game
//             </Button>
//           </div>
//         </div>
//       </div> */}

//       <div className="flex flex-col justify-center items-center gap-2">
//         <div className="flex flex-row justify-center items-center">
//           {scrollSnaps.map((_, index) => (
//             <DotButton
//               key={index}
//               onClick={() => onDotButtonClick(index)}
//               className={'w-4 h-4 bg-gray-500 rounded-full m-2 p-0 border-none cursor-pointer'.concat(
//                 index === selectedIndex ? ' border-2 border-black' : '',
//               )}
//             />
//           ))}
//         </div>

//         <div className="grid grid-cols-2 gap-1 items-center">
//           <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
//           <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
//         </div>
//       </div>
//       {showLoadModal && <Modal action={'loadLast'} toggle={toggleLoad} />}
//       {showExitModal && <Modal action={'exitGame'} toggle={toggleExit} />}
//     </section>
//   )
// }

/*-------------------------------------- GameTab --------------------------------------*/

// const OPTIONS: EmblaOptionsType =

const GameTab = () => {
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
    <div className="flex justify-center w-[320px] mx-auto">
      <>
        {isConnected ? (
          <>
            <div className="mb-2">
              <p
                className="
              pb-2 \
              text-[36px] sm:text-[28px] \
              text-[#404833] \
              capitalized font-digit \
              text-center\
              flex justify-center"
              >
                Your Tickets
              </p>

              {/* <Carousel orientation="horizontal" className="w-full mx-auto">
                  <CarouselContent className="">
                   {yourTicketArray.map((index) => (
                    <CarouselItem key={index} className="basis-1/4 justify-items-center">
                      <div className="flex items-center justify-center mx-auto"></div>
                    </CarouselItem>
                  ))} 
                    <TicketUI ticketSize={2} ticketNumber={ticket.id} ticket={ticket} />
                  </CarouselContent>
                  <CarouselPrevious className="h-6 w-6 -left-[20px]" />
                  <CarouselNext className="h-6 w-6 -right-[20px]" />
                </Carousel> */}
              {/* <EmblaCarousel slides={ownedTickets} options={OPTIONS} /> */}

              <section className="mx-auto">
                <div className="w-[320px] overflow-hidden" ref={emblaRef}>
                  <div className="flex touch-pan-x">
                    {ownedTickets.map((ticket) => (
                      <div className="" key={ticket.id}>
                        <TicketUI ticketNumber={ticket.id} ticketSize={1} ticket={ticket} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <div className="flex flex-row justify-center items-center">
                    {scrollSnaps.map((_, index) => (
                      <DotButton
                        key={index}
                        onClick={() => onDotButtonClick(index)}
                        className={cn(
                          index === selectedIndex ? 'border-2 border-black' : '',
                          'w-4 h-4 bg-gray-500 rounded-full m-2 p-0 border-none cursor-pointer',
                        )}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-1 items-center">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                  </div>
                </div>
                {showLoadModal && <Modal action={'loadLast'} toggle={toggleLoad} />}
                {showExitModal && <Modal action={'exitGame'} toggle={toggleExit} />}
              </section>

              {/* <div>
                <div
                  className="
              pb-2 \
              text-[36px] sm:text-[28px] \
              text-[#404833] \
              capitalized font-digit \
              text-center\
              flex justify-center"
                >
                  Ticket Log
                </div>
                <GameFeed />
              </div> */}
            </div>
          </>
        ) : (
          <div className="mb-4">
            <div className="text-gray-600 flex flex-col gap-4 items-center justify-center">
              <div className="text-center px-10 py-1 leading-10 h-12 text-2xl">Not logged in</div>
              <Image
                priority
                src={`/faces/eatchips.svg`}
                height={110}
                width={150}
                className={`h-auto mt-0 mb-0`}
                alt={`guest pepe`}
              />
              <div className="text-center text-2xl rounded-lg py-1 px-2 border-gray-600">
                <a href={TWITTER_URL} target="_blank">
                  Follow 🐦
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  )
}

export default GameTab
