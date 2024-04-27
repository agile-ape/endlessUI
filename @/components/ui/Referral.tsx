import React, { useRef, useState, useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/shadcn/command'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/shadcn/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { PopoverContentList } from '@/components/shadcn/popover-list'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Button } from '../shadcn/button'
import Link from 'next/link'
import { DOCS_URL } from '../../../services/constant'
import Image from 'next/image'
import { fetcher, poster, isJson, formatNumber } from '@/lib/utils'
import {
  useAccount,
  useReadContracts,
  useSendTransaction,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'
import useSWR, { useSWRConfig } from 'swr'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../../store'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { cn } from '@/lib/utils'

// import { ComboboxForm } from '../shadcn/combobox-form'

type referralData = {
  player: `0x${string}`
  referrer: `0x${string}`
  // isTake: boolean
}

function Referral() {
  const { address, isConnected } = useAccount()
  // const [value, setValue] = useState('')
  // const [referral, setReferral] = useState('')
  const [check, setCheck] = useState<string>('')

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>('')

  const [submitted, setSubmitted] = useState(false)
  // const [lowerCaseAddress, setLowerCaseAddress] = useState('');

  const lowerCaseAddress = String(address?.toLowerCase())
  // console.log(lowerCaseAddress)

  const referral = useStoreState((state) => state.referral)
  const referralList = useStoreState((state) => state.referralList)

  // const updateReferral = useStoreActions((actions) => actions.updateReferral)
  // const updateReferralList = useStoreActions((actions) => actions.updateReferralList)

  // const referralAddress = referralData.referralAddress

  // const {
  //   data: referralData,
  //   error: referralError,
  //   isLoading,
  //   mutate,
  // } = useSWR(
  //   // <{data: Number[]}>
  //   `/referrals/${lowerCaseAddress}`,
  //   fetcher,
  // )

  // let referralAddress: string = ''
  // if (referralData) {
  //   referralAddress = referralData.referralAddress

  //   setReferral(referralAddress)
  // }

  // useEffect(() => {
  //   // Ensure playerTicketsArray is defined and has at least one element with a result property
  //   setReferral(referralAddress)
  // }, [referralAddress]) // Run this effect whenever playerTicketsArray changes

  // const referrals = [
  //   {
  //     value: 'AB01',
  //     label: 'AB01',
  //   },
  //   {
  //     value: 'DI02',
  //     label: 'AB01',
  //   },
  // ]

  // const referralList = [{ referralCode: 'AB01' }]

  // const frameworks = [
  //   {
  //     value: 'next.js',
  //     // label: 'Next.js',
  //   },
  //   {
  //     value: 'sveltekit',
  //     // label: 'SvelteKit',
  //   },
  //   {
  //     value: 'nuxt.js',
  //     // label: 'Nuxt.js',
  //   },
  //   {
  //     value: 'remix',
  //     // label: 'Remix',
  //   },
  //   {
  //     value: 'astro',
  //     // label: 'Astro',
  //   },
  // ]

  // const addGiveHandler = async () => {
  //   try {
  //     const data: referralData = {
  //       player: lowerCaseAddress as `0x${string}`,
  //       referrer: referral as `0x${string}`,
  //       isTake: false,
  //     }
  //     const responseData = await poster(data, `/players/${data.player}`)
  //     console.log(responseData)

  //     if (responseData?.status === 201) {
  //       setSubmitted(true)
  //     }

  //     if (responseData?.status !== 201) {
  //       console.log('error')
  //     }

  //     return responseData
  //   } catch (error) {
  //     console.error('Error:', error)
  //   }
  // }

  const submitReferral = async () => {
    try {
      const data: referralData = {
        player: lowerCaseAddress as `0x${string}`,
        referrer: value as `0x${string}`,
        // isTake: true,
      }
      const responseData = await poster(data, `/players/${data.player}`)

      if (responseData?.status === 201) {
        setSubmitted(true)
      }

      if (responseData?.status !== 201) {
        console.error('error')
      }

      return responseData
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // const handleReferralChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const regex = /^0x[0-9a-fA-F]{40}$/

  //   const address = event.target.value.toLowerCase()
  //   if (regex.test(address)) {
  //     setCheck('valid eth address')
  //     setReferral(address)
  //   } else {
  //     setCheck('not valid eth address')
  //     // Handle invalid input (e.g., show error message)
  //     // For now, let's just clear the input
  //     setReferral('')
  //   }
  // }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="referral"
            className="rounded-sm border-2 border-gray-200 hover:border-gray-200/50 px-4"
          >
            🟢 Referral
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-4 justify-center items-center p-4">
            <div>
              <div className="text-3xl">Submit referrer</div>
              <div className="text-xl">
                Both of you get 5% of your purchases.
                <a href={DOCS_URL} target="_blank" className="ml-1 underline">
                  Learn more
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 p-2">
              {referral ? (
                <>
                  <div className="text-3xl">Your referrer is: {referral}</div>
                  <div className="text-xl">Change referrer</div>
                </>
              ) : (
                <>
                  <div className="text-xl">Add referre</div>
                </>
              )}

              <div className="flex flex-col gap-2 justify-center items-center">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="primary"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between flex px-4 py-2 h-12 items-center text-3xl"
                    >
                      {value
                        ? referralList.find((referral) => referral.referralCode === value)
                            ?.referralCode
                        : 'Select...'}
                      {/* {referral ? referral : 'Select...'} */}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContentList className="w-[200px] p-0 overflow-auto h-[200px]">
                    {referralList?.map((referral) => (
                      <button
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-2xl hover:bg-opacity-80 hover:text-white outline-none aria-selected:bg-zinc-100 aria-selected:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-50"
                        key={referral.referralCode}
                        value={referral.referralCode}
                        onClick={() => {
                          setValue(referral.referralCode)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === referral.referralCode ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {referral.referralCode}
                      </button>
                    ))}
                  </PopoverContentList>
                </Popover>

                <Button
                  className="w-full text-2xl rounded-sm"
                  variant="give"
                  onClick={submitReferral}
                  // disabled={true}
                >
                  Submit
                </Button>

                {submitted ? (
                  <div className="flex flex-col gap-2 justify-center items-center">
                    Thanks for the submission
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default Referral
