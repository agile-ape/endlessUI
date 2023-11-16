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

interface CompletionModalType {
  emittedEvent: string
  //   children: React.ReactNode | null
}

const CompletionModal: React.FC<CompletionModalType> = ({ emittedEvent }) => {
  // const alertLookTest: string = emittedEvent
  const alertLookTest = 'attackedButSafe'

  const getAlertLook = (alertLookTest: string) => {
    switch (alertLookTest) {
      case 'afterPurchase':
        return {
          bgImage: 'rainbow',
          face: 'happy',
          title: 'Welcome to the game!',
          message: 'We are excited to have you. Just hold on tight until DAY comes!',
        }
      case 'submittedDay':
        return {
          bgImage: 'motif',
          face: 'handsup',
          title: 'Keyword submitted!',
          message: 'In case you submitted wrongly, you can still submit again anytime in the DAY',
        }
      case 'attackAndKill':
        return {
          bgImage: 'deadOverlay',
          face: 'angry',
          title: 'Player killed!',
          message: 'Congrats on the kill. You are 1 step nearer to be the last man standing',
        }
      case 'attackButFail':
        return {
          bgImage: 'combine',
          face: 'pray',
          title: 'Player is safe!',
          message:
            'Player submitted the right keyword and is safe from attacks. Try another player?',
        }
      case 'kickedOut':
        return {
          bgImage: 'deadOverlay',
          face: 'angry',
          title: 'Player kicked out and killed!',
          message: 'Thanks for kicking the overstayer out.',
        }
      case 'checkedIn':
        return {
          bgImage: 'safeOverlay',
          face: 'warm',
          title: 'You are checked in!',
          message: 'Enjoy your stay. Please remember to check out on time. Or else.',
        }
      case 'checkedOut':
        return {
          bgImage: 'rainbow',
          face: 'happy',
          title: 'You are checked out!',
          message:
            'We hope you enjoyed your stay. Please remember to submit the keyword now that you are back in the game.',
        }
      case 'voteYes':
        return {
          bgImage: 'rainbow',
          face: 'beers',
          title: 'You voted Yes!',
          message: 'Cheers man. Make love not war.',
        }
      case 'voteNo':
        return {
          bgImage: 'rainbow',
          face: 'watchitburn',
          title: 'You voted back No!',
          message: 'Awww. We appreciate you fighting the good fight.',
        }
      case 'exitGame':
        return {
          bgImage: 'burst',
          face: 'exit',
          title: 'Thanks for playing!',
          message: 'We hope you have fun.',
        }
      // sent to another player
      case 'killed':
        return {
          bgImage: 'deadOverlay',
          face: 'angry',
          title: 'You got killed!',
          message: 'Sorry about that. You can still claim your share of the pot when you exit.',
        }
      case 'received':
        return {
          bgImage: 'motif',
          face: 'surprised',
          title: 'You got ETH!',
          message: 'Good things happen to those that outlast others.',
        }
      case 'attackedButSafe':
        return {
          bgImage: 'combine',
          face: 'pray',
          title: 'You were attacked!',
          message: 'A player attacked you but you are safe as you submitted the keyword.',
        }

      default:
        return {}
    }
  }

  const { bgImage, face, title, message } = getAlertLook(alertLookTest)

  return (
    <Dialog>
      <DialogTrigger>
        {/* Button to click on */}
        <Button variant="transfer" className="w-full text-2xl">
          Check Modal
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-white p-0 md:w-[20rem] w-[90%] rounded-3xl">
        <div
          className="rounded-lg h-full w-full"
          style={{
            backgroundImage: `url('/ticket/${bgImage}.svg')`, // different for true
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div className="rounded-t-sm">
            <div className="flex flex-col justify-center gap-1 items-center pt-5">
              <p className="text-lime-700 text-center border bg-slate-100/50 px-4 py-2 rounded-lg text-2xl font-whitrabt font-semibold">
                {title}
              </p>
              <Image
                priority
                src={`/faces/${face}.png`}
                height={152}
                width={152}
                alt={`${face} pepe`}
              />
            </div>
          </div>

          <DialogClose className="flex justify-center w-full">
            <div className="flex flex-col w-[70%] px-4 md:w-[18rem] mx-auto text-center border bg-slate-100/50 rounded-lg my-4">
              <div className="text-black text-xl my-4">{message}</div>
              <div className="flex justify-center mb-4">
                <Button
                  variant="primary"
                  className="w-[100%] px-10 py-2 w-full rounded-full mx-auto text-xl"
                >
                  Continue
                </Button>
              </div>
            </div>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default dynamic(() => Promise.resolve(CompletionModal), {
  ssr: false,
})
