import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import React from 'react'
import { Button } from '../@/components/ui/button'
import { AlertCircle, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { whitelistContractObj } from '../services/constant'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const Whitelist: NextPage = () => {
  const { address, isConnected } = useAccount()

  const { data: isAddressWhitelisted } = useContractRead({
    ...whitelistContractObj,
    functionName: 'whitelistAddress',
    args: [address as `0x${string}`],
    enabled: isConnected,
  })

  const { write, isLoading } = useContractWrite({
    ...whitelistContractObj,
    functionName: 'signUpToWhitelist',
    onError(error) {
      // @ts-ignore
      const errorMsg = error?.cause?.shortMessage || error?.message
      toast({
        variant: 'destructive',
        // title: 'Whitelist failed 😭',
        description: (
          <div className="flex flex-row">
            <AlertCircle size={24} className="mr-2 stroke-red-800" />
            <span className="text-base">Reason: {errorMsg}</span>
          </div>
        ),
      })
    },
    onSuccess(data) {
      console.log('Success', data)
      toast({
        variant: 'success',
        description: (
          <div className="flex flex-row">
            <AlertCircle size={24} className="mr-2 stroke-green-800" />
            <span className="text-base"> Welcome! Congrats on being early.</span>
          </div>
        ),
      })
    },
  })

  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white capitalize"> A game of endurance</p>
        <p className="text-xl text-gray-400"> How many rounds can you last</p>
        <p className="flex justify-center items-center">
          <span className="text-3xl uppercase text-white">Join whitelist now</span>
          
          <span className="hidden lg:inline">  
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle size={24} className="ml-1 align-end text-white" />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                  Joining the whitelist allows you to buy tickets before others when the game
                  begins. Follow us on Twitter to get updates.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </span>

          <span className="lg:hidden">
            <Popover>
              <PopoverTrigger> 
                <HelpCircle size={24} className="ml-1 align-end text-white" />
              </PopoverTrigger>
              <PopoverContent side="top" align="center">
                <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                  Joining the whitelist allows you to buy tickets before others when the game
                  begins. Follow us on Twitter to get updates.
                </p>
              </PopoverContent>
            </Popover>
            </span>
          
        </p>
      </div>
      <div className="flex place-content-center">
        <div className="relative">
          <Image
            priority
            src="/pepe/sun.svg"
            className="place-self-center animate-pulse"
            height={300}
            width={300}
            alt="sneak-a-peek-pepe"
          />

          <div className="absolute top-[50px]">
            <Image
              priority
              src="/pepe/pepe-robe.svg"
              className="place-self-center"
              height={300}
              width={300}
              alt="sneak-a-peek-pepe"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-7">
        <div className="bg-gradient-to-br from-orange-600 to-yellow-400 rounded-xl p-0.5 shadow-md shadow-orange-400/70">
          <Button
            disabled={!write || isAddressWhitelisted}
            size="lg"
            variant="whitelist"
            onClick={() => write()}
            isLoading={isLoading && !isAddressWhitelisted}
          >
            {isAddressWhitelisted ? 'Your address is whitelisted' : 'Join Whitelist'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query, req, res, locale }) => {
  return {
    props: {
      metadata: {
        title: 'Whitelist',
      },
      theme: 'dark',
    },
  }
}

export default Whitelist
