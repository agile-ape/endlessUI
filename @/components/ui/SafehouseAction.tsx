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
import { Button } from './button'
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons'

function SafehouseAction() {
  const [isCheckedIn, setIsCheckedIn] = React.useState<boolean>(false)
  const [amountTicket, setAmountTicket] = React.useState<number>(0)
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button variant="destructive" className="w-full" >Tavern</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center">Safehouse</DialogTitle>
            <ScrollArea className="h-[500px] md:h-[450px] rounded-md p-4">

            <DialogDescription className=" mx-auto flex flex-col gap-3">
              {!isCheckedIn ? (
                <>
                  <div className="w-[100%] h-[10rem] border-[2px] border-slate-400 mx-auto">

                  </div>
                  <Accordion type="multiple">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Instruction</AccordionTrigger>
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
                  <div className="flex justify-center">
                    <div className="text-2xl border-[2px] border-slate-400 flex justify-between items-center p-2 gap-3">
                      <p>{amountTicket}</p>
                      <div className="flex flex-col">
                        <button className="w-[20px] h-[20px] flex justify-center items-center"
                          onClick={() => setAmountTicket(amountTicket + 1)}
                        ><ChevronUpIcon /></button>
                        <button className="w-[20px] h-[20px] flex justify-center items-center"
                          onClick={() => amountTicket > 0 && setAmountTicket(amountTicket - 1)}
                        ><ChevronDownIcon /></button>
                      </div>
                    </div>
                  </div>
                  <Button className="" variant="submit">Check In</Button>
                  <div className="flex justify-between">
                    <p className="text-2xl">$LAST in wallet</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-2xl">Price per night</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-2xl">Checkout by Round</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </>
              ) : (
                <>
                  <Button className="" variant="submit">Checked In on Round 1</Button>
                  <Button className="" variant="destructive">Checked Out</Button>
                </>
              )}
            </DialogDescription>
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SafehouseAction
