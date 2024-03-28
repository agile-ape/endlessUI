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
          className="border rounded-xl border-gray-200 hover:border-gray-200/50"
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
            <ScrollArea className="h-[400px] lg:h-[610px] rounded-md border p-4">
              <DialogDescription>
                <div className="text-[#FCFCD7] text-xl">
                  {/* <p className="mb-6">Pooh's Pot 🍯 has ETH</p> */}
                  <p className="mb-6 text-2xl">
                    Guess the average number chosen by all players
                    {/* <span className="italic">(buy-in value)</span> */}
                  </p>
                  <p className="mb-4"> Pick a number, from 0 to 9999. </p>
                  <p className="mb-4"> Buy a key for 0.005e to lock it in. </p>
                  <p className="mb-4"> All purchases add towards the pot. </p>
                  <p className="mb-4"> Once the timer reaches zero, game ends. </p>
                  <p className="mb-4">
                    {' '}
                    Once game ends, pot is divided into 🏆winners pot (50%), 🏃‍♂️players pot (30%) and
                    🏦funders pot (20%).{' '}
                  </p>
                  <p className="ml-4 mb-4">
                    {' '}
                    Keys that win (number == final average) share in the 🏆winners pot.{' '}
                  </p>
                  <p className="ml-4 mb-4">
                    {' '}
                    All keys can claim from the 🏃‍♂️players pot - The earlier you join, the more you
                    claim.{' '}
                  </p>
                  <p className="ml-4 mb-4">
                    {' '}
                    🏦Funders pot is for the brave souls that put money into this project, where
                    they only make money if 5x more capital entered after them.
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
