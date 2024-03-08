import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './button'
import Image from 'next/image'
import { Send, CheckCircle2 } from 'lucide-react'

import { useStoreActions, useStoreState } from '../../../store'
import dynamic from 'next/dynamic'
import { DialogClose } from '@radix-ui/react-dialog'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

const getAlertLook = (alertLookTest: string) => {
  switch (alertLookTest) {
    case 'changeRound':
      return {
        bgImage: 'rainbow',
        face: 'salute',
        title: 'phase changed',
        message: 'We thank you for your service',
      }

    case 'afterPurchase':
      return {
        bgImage: 'rainbow',
        face: 'happy',
        title: 'welcome',
        message: 'A warrior enters the arena',
      }

    case 'lastLoaded':
      return {
        bgImage: 'safeOverlay',
        face: 'warm',
        title: 'checked in',
        message: 'Enjoy your stay. Remember to check out on time. Or else.',
      }

    case 'betMade':
      return {
        bgImage: 'rainbow',
        face: 'scheming',
        title: 'bet accepted',
        message: 'Good luck and enjoy the game',
      }

    case 'checkedOut':
      return {
        bgImage: 'rainbow',
        face: 'happy',
        title: 'checked out',
        message: 'We hope you enjoyed your stay. You are back in the game!',
      }

    case 'claimWin':
      return {
        bgImage: 'rainbow',
        face: 'wine',
        title: 'winnings claimed',
        message: 'Congrats on the win!',
      }

    //used
    case 'sentTokens':
      return {
        bgImage: 'rainbow',
        face: 'muscle',
        title: 'tokens sent',
        message: 'Thanks for spreading the love',
      }
    //used
    case 'submitted':
      return {
        bgImage: 'motif',
        face: 'handsup',
        title: 'received PPP',
        message: 'You received Pepe Protection for the day',
      }
    //used
    case 'attackAndKill':
      return {
        bgImage: 'deadOverlay',
        face: 'shoot',
        title: 'player killed',
        message: 'Congrats on the kill. You are 1 step nearer to be the last man',
      }
    //used
    case 'attackButFail':
      return {
        bgImage: 'rainbow',
        face: 'sad',
        title: 'player is safe',
        message: 'Player has PPP and defended your attack. Try another player?',
      }
    //used
    case 'kickedOut':
      return {
        bgImage: 'deadOverlay',
        face: 'police',
        title: 'player kicked out',
        message: 'Thanks for kicking the overstayer out.',
      }
    //used
    case 'voteYes':
      return {
        bgImage: 'rainbow',
        face: 'prettyplease',
        title: 'voted yes',
        message: 'Cheers man. Make love not war.',
      }
    //used
    case 'voteNo':
      return {
        bgImage: 'rainbow',
        face: 'smoke',
        title: 'voted back no',
        message: 'For honor and glory?',
      }
    //used
    case 'exitGame':
      return {
        bgImage: 'burst',
        face: 'exit',
        title: 'bye',
        message: 'We hope you had fun. We will see you in the next game.',
      }

    /*------  sent to another player ------*/

    //used
    case 'receivedTokens':
      return {
        bgImage: 'rainbow',
        face: 'surprised',
        title: '$LAST',
        message: 'Use it wisely in your journey',
      }

    //used
    case 'killed':
      return {
        bgImage: 'deadOverlay',
        face: 'angry',
        title: 'killed',
        message: 'Sorry about that. Remember to exit game and claim your share of the pot',
      }

    // NEXT ITERATION
    case 'received':
      return {
        bgImage: 'motif',
        face: 'surprised',
        title: 'value drop',
        message: 'You received ETH from players above. Congrats!',
      }

    //used
    case 'attackedButSafe':
      return {
        bgImage: 'combine',
        face: 'pray',
        title: 'attacked',
        message: 'You are untouchable with PPP',
      }

    /*------  sent to all ------*/
    //peacefound
    case 'peacefound':
      return {
        bgImage: 'burst',
        face: 'beers',
        title: 'peace',
        message: 'Peace is found. All remaining players share the remaining pot.',
      }
    //drain
    case 'drain':
      return {
        bgImage: 'burst',
        face: 'watchitburn',
        title: 'drained',
        message: 'Pot is drained. Was it worth it?',
      }
    //lastman
    case 'lastman':
      return {
        bgImage: 'burst',
        face: 'lastman',
        title: 'last man found',
        message: 'All hail the man, the myth, the legend. The lastman stands!',
      }

    //game closed
    case 'gameClosed':
      return {
        bgImage: 'rainbow',
        face: 'love',
        title: 'game end',
        message: 'Stay tuned for the next game!',
      }

    default:
      return {}
  }
}

interface CompletionModalType {
  alertLookTest: string
  //   children: React.ReactNode | null
}

const CompletionModal: React.FC<CompletionModalType> = () => {
  // const alertLookTest: string = emittedEvent
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => closeModal())

  const modalState = useStoreState((state) => state.triggerCompletionModal)
  const modalLooks = getAlertLook(modalState.state)
  const closeModalAction = useStoreActions((actions) => actions.updateTriggerCompletionModal)

  function closeModal() {
    closeModalAction({
      isOpen: false,
      state: '',
    })
  }

  const { bgImage, face, title, message } = modalLooks

  return (
    <Dialog open={modalState.isOpen}>
      <DialogContent className="bg-white dark:bg-white rounded-lg p-0 w-[75%] md:w-[20rem]">
        <div
          ref={modalRef}
          className="rounded-lg shadow-xl"
          style={{
            backgroundImage: `url('/ticket/${bgImage}.svg')`, // different for true
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div className="rounded-t-sm">
            <div className="flex flex-col justify-center gap-1 items-center pt-5">
              <p className="text-center border bg-slate-100/50 px-4 py-2 rounded-lg text-2xl font-digit text-[#404833]">
                {title}
              </p>
              <Image
                priority
                src={`/faces/${face}.svg`}
                height={152}
                width={152}
                alt={`${face} pepe`}
              />
            </div>
          </div>

          <div className="w-[90%] flex flex-col px-4 mx-auto text-center border bg-slate-100/50 rounded-lg my-4">
            <div className="text-black text-xl my-2">{message}</div>
            <div className="flex justify-center mb-4">
              <div className="flex justify-center w-full" onClick={closeModal}>
                <Button
                  variant="primary"
                  className="w-[100%] px-10 py-2 rounded-full mx-auto text-xl"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default dynamic(() => Promise.resolve(CompletionModal), {
  ssr: false,
})
