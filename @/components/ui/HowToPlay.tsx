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

function HowToPlay() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="play">How To Play 🎮</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-digit text-[#FCFC03]">
              Pass the pot 🍯
            </DialogTitle>
            <ScrollArea className="h-[400px] lg:h-[600px] rounded-md border p-4">
              <DialogDescription>
                <div className="text-[#FCFCD7] text-2xl">
                  <p className="mb-6">A pot 🍯 is funded with ETH.</p>
                  <p className="mb-6">Players buy tickets 🎟 to join the game.</p>
                  <p className="mb-6">The game goes in rounds 🪜. </p>
                  <p>At the end of each round: </p>
                  <ol>
                    <li className="ml-4 mb-4">
                      1. Every ticket pass 10% of its value to the ticket after them
                    </li>
                    <li className="ml-4 mb-4">
                      2. Ticket that holds the pot claims the value they joined game with
                    </li>
                    <li className="ml-4 mb-6">
                      3. The pot is then passed to the next ticket to hold for the next round
                    </li>
                    <li className="mb-4">P.S. $LAST tokens help reduce % of value passed</li>
                  </ol>
                </div>

                <a href={DOCS_URL} target="_blank">
                  <Button variant="primary" className={`w-full text-3xl py-8`}>
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
