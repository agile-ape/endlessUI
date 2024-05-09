import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
  const minAllowedNumber = useStoreState((state) => state.minAllowedNumber)
  const maxAllowedNumber = useStoreState((state) => state.maxAllowedNumber)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="play" className="text-2xl flash px-4">
          How To Play
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl sm:text-3xl font-digit">
              💾 FLOP THE AVERAGE
            </DialogTitle>
            <ScrollArea className="rounded-md border p-4">
              <DialogDescription>
                <div className="text-xl sm:text-3xl">
                  {/* <p className="mb-6">Pooh's Pot 🍯 has ETH</p> */}
                  {/* <p className="mb-6 underline text-center">How to play</p> */}
                  <p className="mb-8">
                    <p className="mb-4">
                      {' '}
                      Pick a number ({minAllowedNumber} - {maxAllowedNumber}) and buy a disk 💾
                    </p>
                    <p className="mb-4">
                      {' '}
                      Your disk wins if your number matches the final average number of all disks
                      bought
                    </p>
                  </p>

                  <p className="mb-2 underline text-center">Final Pot Split</p>

                  {/* <p className="text-3xl grid grid-cols-2 my-2">
                    <span className="text-left mr-2 col-span-1"> 🔴 Funders share </span>
                    <span className="text-right font-digit mr-4">20%</span>{' '}
                  </p> */}

                  <p className="text-xl sm:text-3xl grid grid-cols-3 my-2">
                    <span className="text-left mr-2 col-span-2"> 🟡 Winners share </span>
                    <span className="text-right font-digit mr-4">{winnersShare}%</span>{' '}
                  </p>

                  <p className="text-xl sm:text-3xl grid grid-cols-3 my-2">
                    <span className="text-left mr-2 col-span-2"> 🟣 Players share </span>
                    <span className="text-right font-digit mr-4">{playersShare}%</span>{' '}
                  </p>

                  <p className="text-xl sm:text-3xl grid grid-cols-3 my-2">
                    <span className="text-left mr-2 col-span-2"> 🟢 Referrals share </span>
                    <span className="text-right font-digit mr-6">{referralsShare}%</span>{' '}
                  </p>

                  <p className="text-xl sm:text-3xl grid grid-cols-3 my-2">
                    <span className="text-left mr-2 col-span-2"> 🔵 Rollover share </span>
                    <span className="text-right font-digit mr-4">{rolloverShare}%</span>{' '}
                  </p>
                  <p className="text-base sm:text-xl my-4">
                    <span className="text-left mr-2 col-span-1">
                      {' '}
                      🔵 Hint: You can rollover your winnings to share in 5% of next pot.
                    </span>
                  </p>
                </div>

                <div className="flex justify-around">
                  <Button
                    variant="primary"
                    className="w-5/12 text-xl sm:text-3xl px-4 py-4 sm:py-8 my-4 hover:bg-opacity-50"
                  >
                    <a href={DOCS_URL} className="" target="_blank">
                      Learn more
                    </a>
                  </Button>

                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="reset"
                      className="w-5/12 text-xl sm:text-3xl py-4 sm:py-8 my-4 hover:bg-opacity-50"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </div>
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowToPlay
