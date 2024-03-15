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
          className="border rounded-xl border-gray-900 hover:border-gray-900/50"
        >
          How To Play
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-digit text-[#FCFC03]">
              pooh's pot 🍯
            </DialogTitle>
            <ScrollArea className="h-[400px] lg:h-[610px] rounded-md border p-4">
              <DialogDescription>
                <div className="text-[#FCFCD7] text-xl">
                  {/* <p className="mb-6">Pooh's Pot 🍯 has ETH</p> */}
                  <p className="mb-4">
                    Players buy tickets 🎟 to join the game.
                    {/* <span className="italic">(buy-in value)</span> */}
                  </p>
                  <p className="mb-4">Their purchase price stays in their ticket.</p>
                  <p className="mb-4">
                    Players take turns holding the pot{' '}
                    <span className="inline">
                      <Image
                        priority
                        src="/logo/honeyPot.svg"
                        unoptimized
                        className="inline mr-2"
                        height={10}
                        width={40}
                        alt="honeyPot"
                      />
                    </span>
                    , starting with the first player.
                  </p>
                  <p className="mb-4">The game goes in rounds 🪜:</p>
                  <p>At the end of each round: </p>
                  <ol>
                    <li className="ml-4 mb-4">
                      1. Every ticket pass 10% <span className="italic">(pass rate)</span> of its
                      value to the ticket after - i.e. ticket 1 pass to ticket 2, 2 pass to 3...
                    </li>
                    <li className="ml-4 mb-4">
                      2. Ticket that is holding the pot claims its{' '}
                      <span className="italic">purchase price </span> from the pot.
                    </li>
                    <li className="ml-4 mb-6">
                      3. The pot is then passed to the next ticket and next round begins.
                    </li>
                    <p className="mb-6">
                      Anyone can fund the pot{' '}
                      <span className="inline">
                        <Image
                          priority
                          src="/logo/honeyPot.svg"
                          unoptimized
                          className="inline mr-2"
                          height={10}
                          width={40}
                          alt="honeyPot"
                        />
                      </span>
                      and get 🐻 Pooh tokens.
                    </p>
                    <p className="mb-6">
                      Players can roll any ticket with 🐻 Pooh tokens to change the pass rate.
                    </p>
                    {/* <li className="mb-4">P.S. $LAST tokens help reduce % of value passed</li> */}
                    {/* <li className="mb-4">P.S.S. Add to pot to get $LAST tokens</li> */}
                  </ol>
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
