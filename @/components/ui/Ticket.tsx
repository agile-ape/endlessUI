import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { Button } from './button'

const Ticket = () => {
  return (
    <Tabs defaultValue="account" className="w-[70%] mx-auto">
      <div className="flex justify-center">
        <TabsList className="rounded-2xl w-[190px] h-[41px] mx-auto">
          <TabsTrigger value="account" className="rounded-2xl w-[48%] p-1 text-[1rem]">Ticket</TabsTrigger>
          <TabsTrigger value="password" className="rounded-2xl w-[48%] p-1 text-[1rem]">Game</TabsTrigger>
        </TabsList>
      </div>
      <div className="flex justify-center my-5">
        <TabsContent
          value="account" 
          className="flex flex-col gap-3"
        >
          <div className="p-2 rounded-2xl" style={{background: "linear-gradient(140deg, #534CFFB2 0%, #534CFF26 100%)"}}>
            <div
              className="w-[220px] rounded-2xl text-white flex flex-col gap-8 py-[1rem] px-[0.5rem]" 
              style={{background: "linear-gradient(140deg, #0D032D 0%, #1E1049 100%)"}}
            >
              <p className="text-center text-[24px]">#03</p>
              <div className="text-center flex flex-col leading-10">
                <h2 className="text-[4rem]">0.057</h2>
                <p className="text-[1rem]">last seen: 04</p>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-1">
                  <Image 
                    priority
                    src="/icon/skull.svg"
                    height={24}
                    width={24}
                    alt="skull"
                  />
                  <Image 
                    priority
                    src="/icon/skull.svg"
                    height={24}
                    width={24}
                    alt="skull"
                  />
                  <Image 
                    priority
                    src="/icon/skull.svg"
                    height={24}
                    width={24}
                    alt="skull"
                  />
                </div>
                <div className="flex gap-1">
                  <Image 
                    priority
                    src="/icon/crosshair.svg"
                    height={24}
                    width={24}
                    alt="crosshair"
                  />
                  <p className="text-white">-</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-[#31197B] text-[1rem] rounded-xl">Buy Next Ticket</Button>
        </TabsContent>

        <TabsContent value="password">Change your password here.</TabsContent>
      </div>
      
    </Tabs>
  )
}

export default Ticket