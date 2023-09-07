import type { NextPage } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'

import { Button } from '../@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { whitelistContractObj } from '../services/constant'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

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
        title: 'Whitelist failed 😭',
        description: <p className="text-base">Reason: {errorMsg}</p>,
      })
    },
    onSuccess(data) {
      console.log('Success', data)
      toast({
        title: 'Whitelist success',
        description: 'Enjoy your early access!',
      })
    },
  })

  return (
    <div className="container mx-auto py-1 flex flex-col gap-7 mt-7">
      <div className="text-center">
        <p className="text-xl text-white"> Endurance is the game </p>
        <p className="text-xl text-white"> How many rounds can you go</p>
        <p className="flex justify-center items-center">
          <span className="text-3xl uppercase text-white">Join the whitelist now</span>
          <TooltipProvider delayDuration={10}>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle size={24} className="ml-1 align-end text-white" />
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p className="px-3 py-1.5 max-w-[240px] text-sm cursor-default">
                  Joining the whitelist allows you to buy tickets before others when the game
                  begins. Learn more, Follow us, or Huddle up to find out more.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* for{' '}
          <a href="https://github.com/" target="_blank" className="underline">
            early access
          </a> */}
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
  )
}

export default Whitelist
