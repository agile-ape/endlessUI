import React, { useRef, useState } from 'react'
import { Button } from './button'
import Image from 'next/image'
import { DOCS_URL_setup } from '../../../services/constant'
import { useOutsideClick } from '../../../hooks/useOutclideClick'

interface WelcomeModalType {
  toggleModal: () => void
}

// const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

const WelcomeModal: React.FC<WelcomeModalType> = ({ toggleModal }) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const toggle = () => {
    setShowWelcomeModal((prevState) => !prevState)
  }
  const modalRef = useRef<HTMLDivElement | null>(null)
  useOutsideClick(modalRef, () => setShowWelcomeModal(false))

  return (
    <div className="fixed inset-0 z-50 bg-white/10 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-zinc-500/10">
      <div className="flex justify-center fixed left-[50%] top-[50%] z-50 grid w-full md:w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-md sm:rounded-lg">
        <div className="bg-white dark:bg-white p-0 shadow-lg w-[100%] rounded-3xl">
          <div
            className="rounded-3xl h-full w-full"
            style={{
              backgroundImage: `url('/ticket/rainbow.svg')`, // different for true
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <div className="rounded-t-sm">
              <div className="flex flex-col justify-center gap-1 items-center py-4">
                <p className="text-lime-700 text-center border bg-slate-100/50 px-4 py-2 mx-2 rounded-lg text-2xl font-whitrabt font-semibold">
                  Play on desktop or mobile?
                </p>
                <Image
                  priority
                  src={`/faces/choose.png`}
                  height={152}
                  width={152}
                  alt={`enter pepe`}
                />
              </div>
              <div className="flex flex-col text-center border bg-slate-100/50 px-4 py-2 mx-2 rounded-lg">
                {/* <div className="text-2xl text-center">How do you want to play?</div> */}
                <div className="text-black text-2xl my-2 text-center">
                  <p>For mobile, install app onto phone by 'Add to home screen'</p>
                  <a
                    href={DOCS_URL_setup}
                    target="_blank"
                    className="link h6-last align-top text-center"
                  >
                    Learn more
                  </a>
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
