// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Button } from './button'
import Link from 'next/link'

function GameHeader() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="howToPlay" size="md">
          Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl">Last Man Standing</DialogTitle>
            <ScrollArea className="h-[400px] md:h-[450px] lg:h-[500px] rounded-md border p-4">

            <DialogDescription>
              <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Buy a ticket.</AccordionTrigger>
                  <AccordionContent>
                    <p>Tickets can be bought during <span className="font-headline beginnings-last">Beginnings</span> and{' '}
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
                      Keyword will be posted on <a href="https://twitter.com/lastman0x" target="_blank" className="underline">Twitter</a> and{' '}
                      
                      <span className="hidden lg:inline">
                      <TooltipProvider delayDuration={10}>
                        <Tooltip>
                          <TooltipTrigger className="opacity-50"> Telegram.</TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p className="px-3 py-1.5 max-w-[240px] cursor-default">
                              Coming soon.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      </span>
                      
                      <span className="lg:hidden">
                      <Popover>
                        <PopoverTrigger className="opacity-50">Telegram</PopoverTrigger>
                        <PopoverContent side="top">
                            <p className="px-3 py-1.5 max-w-[240px] cursor-default">
                              Coming soon.
                            </p>
                        </PopoverContent>
                      </Popover>
                      </span>
                                      
                    </p>

                    <p>
                      Players can do many check ins during the <span className="font-headline day-last">Day</span>. Only the last one
                      counts.
                    </p>
                    <p>
                      Players can choose to leave the game anytime during the <span className="font-headline day-last">Day</span>.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>In the Night, check others.</AccordionTrigger>
                  <AccordionContent>
                    <p>Tickets can only be checked during the <span className="font-headline night-last">Night</span></p>
                    <p>Any ticket that{' '} 
                      
                    <span className="hidden lg:inline">  
                      <TooltipProvider delayDuration={10}>
                        <Tooltip>
                          <TooltipTrigger className="underline"> fails the check </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p className="px-3 py-1.5 max-w-[240px] cursor-default">
                            Did not check in or check in with the wrong keyword
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>

                    <span className="lg:hidden">
                      <Popover>
                        <PopoverTrigger className="underline"> fails the check </PopoverTrigger>
                        <PopoverContent side="top" align="center">
                            <p className="px-3 py-1.5 max-w-[240px] cursor-default">
                            Did not check in or check in with the wrong keyword
                            </p>
                        </PopoverContent>
                      </Popover>
                    </span>
                      {' '}
                      is killed - its value goes to the ticket before it. Example: If Ticket #4 is killed, it's ticket value goes to Ticket #3.{' '}
                      
                      <span className="hidden lg:inline">  
                        <TooltipProvider delayDuration={10}>
                          <Tooltip>
                            <TooltipTrigger className="underline"> What this means</TooltipTrigger>
                            <TooltipContent side="top" align="center" className="px-3 py-1.5 max-w-[240px] cursor-default">
                              <p>You break even if the player above you is killed.</p>
                              <p>You double up your buy-in if 3 players directly above you is killed.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>

                      <span className="lg:hidden">
                        <Popover>
                          <PopoverTrigger className="underline"> What this means </PopoverTrigger>
                          <PopoverContent side="top" align="center" className="px-3 py-1.5 max-w-[240px] cursor-default">
                                <p>You break even if the player above you is killed.</p>
                                <p>You double up your buy-in if 3 players directly above you is killed.</p>
                          </PopoverContent>
                        </Popover>
                      </span>

                    </p>
                    <p>Tickets need to be checked to be{' '}

                    <span className="hidden lg:inline">  
                      <TooltipProvider delayDuration={10}>
                        <Tooltip>
                          <TooltipTrigger className="underline"> killed </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <p className="px-3 py-1.5 max-w-[240px] cursor-default">
                            It is possible to escape the Night if no one checks you.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                    
                    <span className="lg:hidden">
                        <Popover>
                          <PopoverTrigger className="underline"> killed </PopoverTrigger>
                          <PopoverContent side="top" align="center" className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                              <p className="px-3 py-1.5 max-w-[240px] cursor-default">
                              It is possible to escape the Night if no one checks you.
                              </p>
                          </PopoverContent>
                        </Popover>
                      </span>
                    </p>
                   
                    <p>
                      If there are no players below the killed ticket, the value goes to the Bounty.
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
                    <p>The <span className="font-headline day-last">Day</span> and{' '} 
                    <span className="font-headline night-last">Night</span> time duration is halved.</p>
                    <p>A countdown timer helps to track time.</p>                  
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Outlast the competition.</AccordionTrigger>
                  <AccordionContent>
                    <p>Everyone gets to claim a portion of the pool when they leave or gets killed. </p>
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
              </Accordion>
            </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GameHeader
