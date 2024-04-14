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
                  <div className="flex flex-col gap-4 justify-center bg-zinc-800 items-center border border-neutral-200 p-6 rounded-lg">
                    <label
                      htmlFor="referral"
                      className="text-3xl text-center text-gray-300 flex flex-col"
                    >
                      <span>Referral address</span>
                    </label>

                    <div
                      className="border-[2px] border-gray-400 \
                  bg-slate-700 rounded-xl \
                  flex flex-col justify-center items-center"
                    >
                      <input
                        type="text"
                        id="referral"
                        className="w-[500px] bg-transparent font-digit \
                    text-center text-xl text-gray-300 \
                    flex justify-between items-center py-2"
                        placeholder="0x0000000000000000000000000000000000000000"
                        maxLength={42}
                        // onChange={(e) => setReferral(e.target.value)}
                        onChange={handleReferralChange}
                      />
                    </div>

                    <p className="font-digit text-xl mt-2 text-center">{check}</p>

                    <div className="flex gap-8">
                      <TooltipProvider delayDuration={10}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              className="w-[150px] text-2xl"
                              variant="give"
                              onClick={addGiveHandler}
                              // disabled={true}
                            >
                              Give
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <div className="px-3 py-1 max-w-[240px] text-lg cursor-default">
                              Give all 10% of your proceeds to referrer
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider delayDuration={10}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              className="w-[150px] text-2xl"
                              variant="take"
                              onClick={addTakeHandler}
                              // disabled={true}
                            >
                              Take
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            <div className="px-3 py-1 max-w-[240px] text-lg cursor-default">
                              Take 5% of your proceeds back from your referrer, so 50-50
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
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
