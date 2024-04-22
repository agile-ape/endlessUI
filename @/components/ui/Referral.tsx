'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/shadcn/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { toast } from '@/components/shadcn/use-toast'

import React, { useRef, useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
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

type referralData = {
  player: `0x${string}`
  referrer: `0x${string}`
  isTake: boolean
}

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const FormSchema = z.object({
  language: z.string({
    required_error: 'Please select a language.',
  }),
})

export function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
}

function Referral() {
  const { address, isConnected } = useAccount()
  // const [value, setValue] = useState('')
  const [referral, setReferral] = useState('')
  const [check, setCheck] = useState<string>('')

  const [submitted, setSubmitted] = useState(false)
  // const [lowerCaseAddress, setLowerCaseAddress] = useState('');

  const lowerCaseAddress = String(address?.toLowerCase())
  // console.log(lowerCaseAddress)

  const referralAddress = useStoreState((state) => state.referral)

  // console.log(referralAddress)

  // const updateReferral = useStoreActions((actions) => actions.updateReferral)

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

  const addGiveHandler = async () => {
    try {
      const data: referralData = {
        player: lowerCaseAddress as `0x${string}`,
        referrer: referral as `0x${string}`,
        isTake: false,
      }
      const responseData = await poster(data, `/players/${data.player}`)
      console.log(responseData)

      if (responseData?.status === 201) {
        setSubmitted(true)
      }

      if (responseData?.status !== 201) {
        console.log('error')
      }

      return responseData
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const addTakeHandler = async () => {
    try {
      const data: referralData = {
        player: lowerCaseAddress as `0x${string}`,
        referrer: referral as `0x${string}`,
        isTake: true,
      }
      const responseData = await poster(data, `/players/${data.player}`)
      console.log(responseData)

      if (responseData?.status === 201) {
        setSubmitted(true)
      }

      if (responseData?.status !== 201) {
        console.log('error')
      }

      return responseData
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleReferralChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^0x[0-9a-fA-F]{40}$/

    const address = event.target.value.toLowerCase()
    if (regex.test(address)) {
      setCheck('valid eth address')
      setReferral(address)
    } else {
      setCheck('not valid eth address')
      // Handle invalid input (e.g., show error message)
      // For now, let's just clear the input
      setReferral('')
    }
  }

  return (
    <>
      {isConnected && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="play"
              className=" rounded-xl border-gray-200 hover:border-gray-200/50 px-4"
            >
              🟢 Referral
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-3xl">🟢 Show some love</DialogTitle>
              <DialogDescription className="text-center text-neutral-100 text-2xl">
                Submit your referrer's wallet address. Choose to give or take.
              </DialogDescription>
            </DialogHeader>
            {referralAddress ? (
              <div className="text-3xl text-center text-amber-300 flex flex-col gap-4">
                <span>You have submitted. Your referral is:</span>
                <span className="font-digit">{referralAddress}</span>
              </div>
            ) : (
              <>
                {submitted ? (
                  <>
                    <div className="flex flex-col gap-4 justify-center bg-zinc-800 items-center border border-neutral-200 p-6 rounded-lg text-3xl text-center text-gray-300">
                      Thanks for the submission!
                    </div>
                  </>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Language</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      'w-[200px] justify-between',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    {field.value
                                      ? languages.find((language) => language.value === field.value)
                                          ?.label
                                      : 'Select language'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Search language..." />
                                  <CommandEmpty>No language found.</CommandEmpty>
                                  <CommandGroup>
                                    {languages.map((language) => (
                                      <CommandItem
                                        value={language.label}
                                        key={language.value}
                                        onSelect={() => {
                                          form.setValue('language', language.value)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            language.value === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                        {language.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              This is the language that will be used in the dashboard.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Submit</Button>
                    </form>
                  </Form>
                )}
              </>
            )}

            {/* <DialogDescription className="text-center text-neutral-100 text-2xl">
              Your referral stats
            </DialogDescription> */}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default Referral
