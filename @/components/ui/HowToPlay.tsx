import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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

                {/* <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Buy a ticket.</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Tickets can be bought during{' '}
                        <span className="font-headline beginnings-last">Beginnings</span> and{' '}
                        <span className="font-headline beginnings-last">Countdown</span>.
                      </p>
                      <p>Ticket price increases for every subsequent ticket.</p>
                      <p>50% of price paid goes to a pool. 50% remains in the ticket.</p>
                      <p>1 ticket per address.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>In the Day, check in.</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Keyword will be posted on{' '}
                        <a
                          href="https://twitter.com/lastman0x"
                          target="_blank"
                          className="underline"
                        >
                          Twitter
                        </a>{' '}
                        and{' '}
                        <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger className="opacity-50"> Telegram.</TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                                Coming soon.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                      <p>
                        Players can do many check ins during the{' '}
                        <span className="font-headline day-last">Day</span>. Only the last one
                        counts.
                      </p>
                      <p>
                        Players can choose to leave the game anytime during the{' '}
                        <span className="font-headline day-last">Day</span>.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>In the Night, check others.</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Tickets can only be checked during the{' '}
                        <span className="font-headline night-last">Night</span>
                      </p>
                      <p>
                        Any ticket that{' '}
                        <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger className="underline"> fails the check </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                                Did not check in or check in with the wrong keyword
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>{' '}
                        is killed - its value goes to the ticket before it. Example: If Ticket #4 is
                        killed, it's ticket value goes to Ticket #3.{' '}
                        <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger className="underline"> What this means</TooltipTrigger>
                            <TooltipContent
                              side="top"
                              align="center"
                              className="px-3 py-1.5 max-w-[240px] text-sm cursor-default"
                            >
                              <p>You break even if the player above you is killed.</p>
                              <p>
                                You double up your buy-in if 3 players directly above you is killed.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                      <p>
                        Tickets need to be checked to be{' '}
                        <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger className="underline"> killed </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                              <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                                It is possible to escape the Night if no one checks you.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>

                      <p>
                        If there are no players below the killed ticket, the value goes to the
                        Bounty.
                      </p>
                      <p>Players can leave the game when their ticket failed.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>The Keyword changes every day.</AccordionTrigger>
                    <AccordionContent>This reduces bots</AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Time reduces after a while.</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        The <span className="font-headline day-last">Day</span> and{' '}
                        <span className="font-headline night-last">Night</span> time duration is
                        halved.
                      </p>
                      <p>A countdown timer helps to track time.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>Outlast the competition.</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Everyone gets to claim a portion of the pool when they leave or gets killed.{' '}
                      </p>
                      <p>The longer you last, the more you get to claim.</p>
                      <p>Pool distribution follows an exponentially increasing curve.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>Be the LAST MAN STANDING</AccordionTrigger>
                    <AccordionContent>
                      <p>The last person earns the most.</p>
                      <p>The player with the most kills wins the bounty.</p>
                      <p>Good luck.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default HowToPlay
