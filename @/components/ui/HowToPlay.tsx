import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Button } from '../shadcn/button'
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
              💾 FLOP THE AVERAGE
            </DialogTitle>
            <ScrollArea className="rounded-md border p-4">
              <DialogDescription>
                <div className="text-[#FCFCD7] text-3xl">
                  {/* <p className="mb-6">Pooh's Pot 🍯 has ETH</p> */}
                  <p className="mb-6 underline text-center">How to play</p>
                  <p className="mb-8">
                    <p className="mb-4"> Pick a number (0 - 999) and buy a disk 💾</p>
                    <p className="mb-4">
                      {' '}
                      You disk win if your number matches the final average number of all disks
                      bought
                    </p>
                  </p>

                  <p className="mb-2 underline text-center">Final Pot Split</p>

                  <p className="text-3xl flex items-center my-2">
                    <span className="font-digit mr-6">10%</span>{' '}
                    <span className="text-lg mr-2">🟢 </span> Referrals{' '}
                  </p>

                  <p className="text-3xl flex items-center my-2">
                    <span className="font-digit mr-4">20%</span>{' '}
                    <span className="text-lg mr-2">🔴 </span> Funders{' '}
                  </p>

                  <p className="text-3xl flex items-center my-2">
                    <span className="font-digit mr-4">30%</span>{' '}
                    <span className="text-lg mr-2">🟣 </span> All Players{' '}
                  </p>

                  <p className="text-3xl flex items-center my-2">
                    <span className="font-digit mr-4">40%</span>{' '}
                    <span className="text-lg mr-2">🟡 </span> Winners{' '}
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
