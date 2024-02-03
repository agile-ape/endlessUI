import React, { useRef, useState } from 'react'
import { Button } from './button'
import Image from 'next/image'
import { DOCS_URL_setup } from '../../../services/constant'
import { useOutsideClick } from '../../../hooks/useOutclideClick'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Share, PlusSquare, Key } from 'lucide-react'

// interface PWADrawerType {
//   toggleModal: () => void
// }

// const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

function PWADrawer() {
  // const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  // const toggle = () => {
  //   setShowWelcomeModal((prevState) => !prevState)
  // }
  // const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => toggleModal())

  return (
    // <div className="fixed inset-0 z-50 bg-white/10 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-zinc-500/10">
    //   <div
    //     ref={modalRef}
    //     className="flex justify-center fixed left-[50%] top-[50%] z-50 grid w-full md:w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-md sm:rounded-lg"
    //   >
    //     <div className="bg-white dark:bg-white p-0 shadow-lg w-[100%] rounded-3xl">
    //       <div
    //         className="rounded-3xl h-full w-full"
    //         style={{
    //           backgroundImage: `url('/ticket/rainbow.svg')`, // different for true
    //           backgroundRepeat: 'no-repeat',
    //           backgroundSize: 'cover',
    //         }}
    //       >
    //         <div className="rounded-t-sm">
    //           <div className="flex flex-col justify-center gap-1 items-center py-4">
    //             <p className="text-lime-700 text-center border bg-slate-100/50 px-4 py-2 mx-2 rounded-lg text-2xl font-semibold">
    //               Play on mobile?
    //             </p>
    //             <Image
    //               priority
    //               src={`/faces/choose.svg`}
    //               height={152}
    //               width={152}
    //               alt={`enter pepe`}
    //             />
    //           </div>
    //           <div className="flex flex-col text-center border bg-slate-100/50 px-4 py-2 mx-2 rounded-lg">
    //             {/* <div className="text-2xl text-center">How do you want to play?</div> */}
    //             <div className="text-black text-xl my-2 text-center">
    //               <p>'Add to home screen' to install app on phone</p>
    //               <p>
    //                 Login with the same account (sms, email, google, wallet) to access the same
    //                 wallet
    //               </p>
    //               <a
    //                 href={DOCS_URL_setup}
    //                 target="_blank"
    //                 className="link h6-last align-top text-center"
    //               >
    //                 Learn more
    //               </a>
    //             </div>
    //             <div className="flex justify-center mb-4">
    //               <Button
    //                 variant="primary"
    //                 className="w-[100%] px-10 py-2 w-full rounded-full mx-auto text-xl"
    //                 onClick={toggleModal}
    //               >
    //                 Continue
    //               </Button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   </div>

    <Drawer>
      <DrawerTrigger>Mobile</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="mx-auto">
          <DrawerTitle className="font-normal flex justify-center items-center h2-last">
            Play on mobile?
          </DrawerTitle>
          <DrawerDescription className="body-last">
            <div className="flex flex-col justify-center items-center">
              <Image
                priority
                src={`/faces/choose.svg`}
                height={152}
                width={152}
                alt={`enter pepe`}
              />
              <div className="h3-last">To install the app from Safari on iOS:</div>
              <div className="w-full flex justify-start my-1">
                <Share className="mr-1" />
                1. Tap Share
              </div>
              <div className="w-full flex justify-start my-1">
                <PlusSquare className="mr-1" />
                2. Swipe up and tap Add to Home Screen
              </div>
              <div className="w-full flex justify-start my-1">
                <Key className="mr-1" />
                3. Login with the same login method to access the same account
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PWADrawer
