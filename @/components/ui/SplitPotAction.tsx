import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import SplitPot from './SplitPot'
import { Button } from './button'

function SplitPotAction() {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="w-full" >Split Pot</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center">Split Pot</DialogTitle>
            <ScrollArea className="h-[500px] md:h-[400px] rounded-md p-4">

            <DialogDescription className=" mx-auto flex flex-col gap-3">
              <div className="w-[100%] h-[10rem] border-[2px] border-slate-400 mx-auto">

              </div>
              <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Rules</AccordionTrigger>
                  <AccordionContent>
                    <p>Tickets can be bought during <span className="font-headline beginnings-last">Beginnings</span> and{' '}
                      <span className="font-headline beginnings-last">Countdown</span>.
                    </p>
                    <p>Ticket price increases for every subsequent ticket.</p>
                    <p>50% of price paid goes to a pool. 50% remains in the ticket.</p>
                    <p>1 ticket per address.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <SplitPot />
            </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SplitPotAction

