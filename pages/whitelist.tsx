import type { NextPage } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'

import { Button } from '../@/components/ui/button'

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
        <p className="text-xl"> Crypto is about endurance </p>
        <p className="text-xl"> How many rounds can you go</p>
        <p className="text-3xl uppercase">
          {' '}
          Join the whitelist for{' '}
          <a href="https://github.com/" target="_blank" className="underline">
            early access
          </a>
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
          variant="enter"
          className={cn(
            'text-xl w-fit h-auto px-4 py-2 cursor-pointer',
            isAddressWhitelisted && '',
          )}
          onClick={() => write()}
          isLoading={isLoading && !isAddressWhitelisted}
        >
          {isAddressWhitelisted ? 'Your address is whitelisted, yay!' : 'Join Whitelist'}
        </Button>
      </div>
    </div>
  )
}

export default Whitelist
