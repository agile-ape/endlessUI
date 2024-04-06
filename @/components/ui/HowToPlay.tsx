import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Button } from './button'
import Link from 'next/link'
import { DOCS_URL } from '../../../services/constant'
import Image from 'next/image'

function HowToPlay() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="play"
          className="border rounded-xl border-gray-200 hover:border-gray-200/50 px-4"
        >
          How To Play
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-digit text-[#FCFC03]">
              AVERAGE
            </DialogTitle>
            <ScrollArea className="h-[650px] rounded-md border p-4">
              <DialogDescription>
                <div className="text-[#FCFCD7] text-xl">
                  {/* <p className="mb-6">Pooh's Pot 🍯 has ETH</p> */}
                  <p className="mb-6 text-2xl">
                    Guess the final average number chosen by all players
                    {/* <span className="italic">(buy-in value)</span> */}
                  </p>
                  <p className="mb-4"> Pick a number, from 0 to 9999. </p>
                  <p className="mb-4"> Buy a key for 0.001e to lock it in. </p>
                  <p className="mb-4"> Purchases add towards the pot, and extends time. </p>
                  <p className="mb-8"> Once the timer reaches zero, game ends. </p>

                  <p className="mb-6 text-2xl">
                    Pot is split 3 ways when game ends
                    {/* <span className="italic">(buy-in value)</span> */}
                  </p>

                  <p className="mb-6">
                    {' '}
                    🔴 Funders Pot (20%): Divided by all whom contributed to pot - split by
                    contribution share.{' '}
                  </p>
                  <p className="mb-6">
                    {' '}
                    🟡 Players Pot (30%): Divided by all players - split by how early they join -
                    the earlier you join, the more you claim.
                  </p>
                  <p className="mb-6">
                    {' '}
                    🟣 Winners Pot (50%): Divided equally by keys that picked the final average.{' '}
                  </p>
                </div>

                <a href={DOCS_URL} target="_blank">
                  <Button variant="primary" className="w-full text-3xl py-8 hover:bg-opacity-50">
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
