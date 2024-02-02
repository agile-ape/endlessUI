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
    case 'changePhase':
      return {
        bgImage: 'rainbow',
        face: 'salute',
        title: 'Phase Changed!',
        message: 'We thank you for your service',
      }

    case 'betMade':
      return {
        bgImage: 'rainbow',
        face: 'scheming',
        title: 'Bet Placed!',
        message: 'Ooo. Good luck and enjoy the game!',
      }

    case 'claimWin':
      return {
        bgImage: 'rainbow',
        face: 'wine',
        title: 'Winnings Claimed!',
        message: 'Congrats on the win sire!',
      }

    //used
    case 'sentTokens':
      return {
        bgImage: 'rainbow',
        face: 'muscle',
        title: 'Tokens sent!',
        message: 'Thanks for spreading the love',
      }
    //used
    case 'afterPurchase':
      return {
        bgImage: 'rainbow',
        face: 'happy',
        title: 'Welcome to the game!',
        message: 'We are excited to have you. Just hold on tight until DAY comes!',
      }
    //used
    case 'submitted':
      return {
        bgImage: 'motif',
        face: 'handsup',
        title: 'Keyword submitted!',
        message: 'You can always submit again anytime in the DAY',
      }
    //used
    case 'attackAndKill':
      return {
        bgImage: 'deadOverlay',
        face: 'shoot',
        title: 'Player killed!',
        message: 'Congrats on the kill. You are 1 step nearer to be the last man standing',
      }
    //used
    case 'attackButFail':
      return {
        bgImage: 'rainbow',
        face: 'sad',
        title: 'Player is safe!',
        message: 'Sorry. Player defended your attack (valid keyword). Try another player?',
      }
    //used
    case 'kickedOut':
      return {
        bgImage: 'deadOverlay',
        face: 'police',
        title: 'Player kicked out and killed!',
        message: 'Thanks for kicking the overstayer out.',
      }
    //used
    case 'checkedIn':
      return {
        bgImage: 'safeOverlay',
        face: 'warm',
        title: 'You are checked in!',
        message: 'Enjoy your stay. Please remember to check out on time. Or else.',
      }
    //used
    case 'checkedOut':
      return {
        bgImage: 'rainbow',
        face: 'happy',
        title: 'You are checked out!',
        message:
          'We hope you enjoyed your stay. Please remember to submit the keyword now that you are back in the game.',
      }
    //used
    case 'voteYes':
      return {
        bgImage: 'rainbow',
        face: 'prettyplease',
        title: 'You voted Yes!',
        message: 'Cheers man. Make love not war.',
      }
    //used
    case 'voteNo':
      return {
        bgImage: 'rainbow',
        face: 'smoke',
        title: 'You voted back No!',
        message: 'Awww. We appreciate you fighting the good fight.',
      }
    //used
    case 'exitGame':
      return {
        bgImage: 'burst',
        face: 'exit',
        title: 'Thanks for playing!',
        message: 'We hope you have fun. We will see you in the next game.',
      }

    /*------  sent to another player ------*/

    //used
    case 'receivedTokens':
      return {
        bgImage: 'rainbow',
        face: 'surprised',
        title: '$LAST received!',
        message: 'Do use it wisely in your game journey',
      }

    //used
    case 'killed':
      return {
        bgImage: 'deadOverlay',
        face: 'angry',
        title: 'You got killed!',
        message: 'Sorry about that. You can still claim your share of the pot when you exit.',
      }

    // NEXT ITERATION
    case 'received':
      return {
        bgImage: 'motif',
        face: 'surprised',
        title: 'You got ETH!',
        message: 'Good things happen to those that outlast others.',
      }

    //used
    case 'attackedButSafe':
      return {
        bgImage: 'combine',
        face: 'pray',
        title: 'You were attacked!',
        message: 'You are untouchable as your keyword is valid.',
      }

    /*------  sent to all ------*/
    //peacefound
    case 'peacefound':
      return {
        bgImage: 'burst',
        face: 'beers',
        title: 'Peace to all!',
        message: 'Peace is found. All remaining players gets to share the pot.',
      }
    //drain
    case 'drain':
      return {
        bgImage: 'burst',
        face: 'watchitburn',
        title: 'Pot is drained!',
        message:
          'Some pot crumbs left. Remaining players can claim whatever that is left of the pot.',
      }
    //lastman
    case 'lastman':
      return {
        bgImage: 'burst',
        face: 'lastman',
        title: 'Last Man Found!',
        message: 'All hail the man, the myth, the legend. The last man standing!',
      }

    //game closed
    case 'gameClosed':
      return {
        bgImage: 'rainbow',
        face: 'love',
        title: 'Game has ended!',
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
