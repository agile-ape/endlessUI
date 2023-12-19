import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog-unblur'
import { ScrollArea } from '@/components/ui/scroll-area'
import OtpInput from 'react-otp-input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from './button'
import {
  useAccount,
  useEnsName,
  useEnsAvatar,
  useContractRead,
  useContractReads,
  useContractWrite,
  useContractEvent,
  useWaitForTransaction,
  useSignMessage,
  useWalletClient,
} from 'wagmi'
import Image from 'next/image'
import { Split, AlertTriangle, ExternalLink, HelpCircle, User } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useStoreActions, useStoreState } from '../../../store'
import { formatAddress, formatNumber } from '@/lib/utils'
import {
  TOKEN_ADDRESS,
  LAST_MAN_STANDING_ADDRESS,
  defaultContractObj,
  tokenContractObj,
  BLOCK_EXPLORER,
  LIQUIDITY_POOL,
  DOCS_URL,
} from '../../../services/constant'
import { formatUnits, parseUnits } from 'viem'
import { toast } from './use-toast'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setIsModalOpen(false))

  // Address read
  const { address, isConnected } = useAccount()

  const { data: ensName } = useEnsName({
    address: address,
    chainId: 1,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  })

  console.log(ensName)
  console.log(ensAvatar)

  const { data, refetch } = useContractReads({
    contracts: [
      {
        ...tokenContractObj,
        functionName: 'playCount',
        args: [address as `0x${string}`],
      },
      {
        ...tokenContractObj,
        functionName: 'sideQuestCount',
        args: [address as `0x${string}`],
      },
    ],
  })

  // assign to variables
  const playCount = data?.[0].result || BigInt(0)
  const sideQuestCount = data?.[1].result || BigInt(0)

  // potential to add game stats
  return (
    <Dialog>
      <DialogTrigger asChild className="shrink-0">
        <div className="flex items-center border rounded-full px-2 sm:px-3 py-0 sm:py-1 hover:border-zinc-300 hover:bg-zinc-200/50 hover:cursor-pointer">
          <Image
            priority
            src="/faces/peep.png"
            height={25}
            width={25}
            alt="last token"
            className="shrink-0 mr-1"
          />
          <User size={24} className="mr-1" />
        </div>
      </DialogTrigger>

      <DialogContent>
        <div className="overflow-auto">
          <DialogHeader className="items-center">
            <DialogTitle className="text-3xl text-center font-normal">Player Dashboard</DialogTitle>
            <ScrollArea className="h-[350px] rounded-md p-2">
              {/* <DialogDescription className="w-[100%] mx-auto flex flex-col gap-3"> */}
              <div className="w-[100%] text-xl leading-tight text-zinc-800 dark:text-zinc-200">
                <div className="w-[280px] mx-auto flex flex-col gap-4 justify-center items-center mb-4">
                  <div className="w-[100%] text-zinc-800 dark:text-zinc-200">
                    <div className="flex justify-center rounded-full p-2">
                      <Image
                        priority
                        // src="eip155:1/erc721:0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d/7959"
                        src={ensAvatar ? ensAvatar : '/faces/dance.webp'}
                        className="place-self-center"
                        height={150}
                        width={110}
                        alt="enter-into-the-pepe"
                      />
                    </div>
                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">Address</p>
                      <p className="text-right">
                        <a href={`${BLOCK_EXPLORER}address/${address}`} target="_blank">
                          {ensName ? ensName : formatAddress(String(address))}
                        </a>
                      </p>
                    </div>
                    <a
                      href={DOCS_URL}
                      target="_blank"
                      className="link text-xs sm:text-sm md:text-base leading-tight"
                    >
                      No ENS address or Avatar?
                    </a>

                    <br />

                    <div className="text-center mt-4 text-xl md:text-2xl lg:text-3xl m-1 capitalize text-zinc-500 dark:text-zinc-400">
                      Game Stats
                    </div>

                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">Game play count</p>
                      <p className="text-right">{Number(playCount)}</p>
                    </div>

                    <div className="flex text-lg justify-between gap-4 text-xl">
                      <p className="text-left">Side quest count</p>
                      <p className="text-right">{Number(sideQuestCount)}</p>
                    </div>
                    <a
                      href={DOCS_URL}
                      target="_blank"
                      className="link text-xs sm:text-sm md:text-base leading-tight"
                    >
                      Why does this matter
                    </a>
                  </div>
                </div>
              </div>
              {/* </DialogDescription> */}
            </ScrollArea>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Profile
