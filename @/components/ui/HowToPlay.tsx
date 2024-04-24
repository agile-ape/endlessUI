import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { useStoreActions, useStoreState } from '../../../store'

import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { DOCS_URL } from '../../../services/constant'
import Image from 'next/image'
import Referral from './Referral'

function HowToPlay() {
  const winnersShare = useStoreState((state) => state.winnersShare)
  const playersShare = useStoreState((state) => state.playersShare)
  const rolloverShare = useStoreState((state) => state.rolloverShare)
  const referralsShare = useStoreState((state) => state.referralsShare)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="play" className=" px-4">
          How To Play
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-digit">
              💾 FLOP THE AVERAGE
            </DialogTitle>
            <ScrollArea className="rounded-md border p-4">
              <DialogDescription>
                <div className="text-3xl">
                  {/* <p className="mb-6">Pooh's Pot 🍯 has ETH</p> */}
                  {/* <p className="mb-6 underline text-center">How to play</p> */}
                  <p className="mb-8">
                    <p className="mb-4"> Pick a number (0 - 999) and buy a disk 💾</p>
                    <p className="mb-4">
                      {' '}
                      Your disk wins if your number matches the final average number of all disks
                      bought
                    </p>
                  </p>

                  <p className="mb-2 underline text-center">Final Pot Split</p>

                  <p className="text-3xl grid grid-cols-2 my-2">
                    <span className="text-left mr-2 col-span-1"> 🟢 Referrals share </span>
                    <span className="text-right font-digit mr-6">{referralsShare}%</span>{' '}
                  </p>

                  {/* <p className="text-3xl grid grid-cols-2 my-2">
                    <span className="text-left mr-2 col-span-1"> 🔴 Funders share </span>
                    <span className="text-right font-digit mr-4">20%</span>{' '}
                  </p> */}

                  <p className="text-3xl grid grid-cols-2 my-2">
                    <span className="text-left mr-2 col-span-1"> 🟣 Players share </span>
                    <span className="text-right font-digit mr-4">{playersShare}%</span>{' '}
                  </p>

                  <p className="text-3xl grid grid-cols-2 my-2">
                    <span className="text-left mr-2 col-span-1"> 🟡 Winners share </span>
                    <span className="text-right font-digit mr-4">{winnersShare}%</span>{' '}
                  </p>
                  {/* <p className="text-3xl grid grid-cols-2 my-2">
                    <span className="text-left mr-2 col-span-1"> 🔵 Rollover share </span>
                    <span className="text-right font-digit mr-4">{rolloverShare}%</span>{' '}
                  </p> */}

                  <p className="text-xl my-4">
                    <span className="text-left mr-2 col-span-1">
                      {' '}
                      🔵 Hint: You can rollover your winnings to share in 5% of next pot.
                    </span>
                  </p>
                </div>

                <a href={DOCS_URL} target="_blank">
                  <Button
                    variant="primary"
                    className="w-full text-3xl py-8 my-4 hover:bg-opacity-50"
                  >
                    Learn more
                  </Button>
                </a>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowToPlay
