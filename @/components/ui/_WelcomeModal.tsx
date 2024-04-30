import React, { useRef, useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { PopoverContentList } from '@/components/shadcn/popover-list'
import { Button } from '@/components/shadcn/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import Image from 'next/image'
import { DOCS_URL } from '../../../services/constant'
import { useStoreActions, useStoreDispatch, useStoreState } from '../../../store'
import {
  useAccount,
  useReadContracts,
  useSendTransaction,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi'
import { fetcher, poster, isJson, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface WelcomeModalType {
  toggleModal: () => void
}

type referralData = {
  player: `0x${string}`
  referrer: `0x${string}`
  // isTake: boolean
}

const WelcomeModal: React.FC<WelcomeModalType> = ({ toggleModal }) => {
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

  return (
    <div className="fixed inset-0 z-50 bg-white/10 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-zinc-500/10">
      <div className="flex justify-center fixed left-[50%] top-[50%] z-50 grid w-full md:max-w-lg lg:max-w-xl max-w-xs translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-md sm:rounded-lg md:w-full">
        <div className="bg-white text-black dark:bg-white p-0 shadow-lg md:w-[24rem] w-[90%] rounded-3xl">
          <div
            className="rounded-3xl h-full w-full"
            style={{
              backgroundImage: `url('/ticket/rainbow.svg')`, // different for true
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <div className="rounded-t-sm">
              <div className="flex flex-col justify-center gap-1 items-center pt-5">
                <p className="text-lime-700 text-center border bg-slate-100/50 px-4 py-2 rounded-lg text-2xl font-whitrabt font-semibold">
                  Welcome to Last Man!
                </p>
                <Image
                  priority
                  src={`/faces/enter.png`}
                  height={152}
                  width={152}
                  alt={`enter pepe`}
                />
              </div>
            </div>

            <div className="flex flex-col w-[70%] px-4 md:w-[20rem] mx-auto text-center border bg-slate-100/50 rounded-lg my-4">
              {/* <div className="text-black text-xl my-4 text-left">
                LastMan is an on-chain game where players compete to outlast one another for magic
                internet money. <br />
                <br />
                Check our{' '}
                <a href={DOCS_URL} className="underline">
                  Docs
                </a>{' '}
                to learn more.
              </div> */}

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

              <div className="flex justify-center mb-4">
                <Button
                  variant="primary"
                  className="w-[100%] px-10 py-2 w-full rounded-full mx-auto text-xl"
                  onClick={toggleModal}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="justify-center items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none text-white">
        <div className="relative lg:w-[60rem] w-[90%] my-6 mx-auto">
          <div
            className="border-[2px] border-[#534CFFFF] p-3 rounded-xl flex flex-col gap-5 w-[100%] md:h-auto h-[90vh] md:overflow-auto overflow-y-scroll"
            style={{
              background: 'linear-gradient(155deg, #0D032D 1.46%, rgba(89, 69, 153, 0.00) 105.7%)',
            }}
          >
            <p className="text-center text-[48px]">WELCOME TO LASTMAN</p>
            <p className="text-[24px] text-center">
              LAST MAN is a game of endurance - where players try to outlast each other for magic
              internet money. Check out Guide for how to play, then Game to join the fun.
            </p>
            <p className="text-[24px] text-center">
              Note: You can always preview an action before signing the transaction
            </p>
            <div className="w-[90%] h-[179px] bg-[#040F2C] border-[2px] border-[#00B5FFFF] mx-auto"></div>
            <div className="mt-10 flex flex-col gap-5 mb-5">
              <p className="text-center text-[24px]">Do not show this pop-up again</p>
              <button
                className="flex justify-center items-center py-[12px] px-[40px] gap-[8px] rounded border-[1px] border-[#FF308A] text-[20px] font-light mx-auto"
                onClick={toggleModal}
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="opacity-75 fixed inset-0 z-40 bg-black"></div> */}
    </div>
  )
}

export default WelcomeModal
