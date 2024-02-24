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
import { Share, PlusSquare, Key, MoreVertical, Compass } from 'lucide-react'
import { useWindowSize } from '../../../hooks/useWindowSize'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// interface PWADrawerType {
//   toggleModal: () => void
// }

// const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

function PWADrawer() {
  const { xs } = useWindowSize()

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)

  // const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  // const toggle = () => {
  //   setShowWelcomeModal((prevState) => !prevState)
  // }
  // const modalRef = useRef<HTMLDivElement | null>(null)
  // useOutsideClick(modalRef, () => toggleModal())

  return xs ? (
    <Drawer>
      <DrawerTrigger className="w-[100%]">Mobile</DrawerTrigger>
      <DrawerContent className="bg-[#404833] text-white">
        <DrawerHeader className="mx-auto">
          <DrawerTitle className="font-digit text-3xl font-normal flex justify-center items-center">
            Play on mobile?
          </DrawerTitle>
          <DrawerDescription className="text-white">
            <div className="flex flex-col justify-center items-center">
              <Image
                priority
                src={`/faces/choose.svg`}
                height={152}
                width={152}
                className="my-2"
                alt={`enter pepe`}
              />

              {isIOS ? (
                <div className="text-xl">
                  <div className="text-xl">To install the app from Safari on iOS:</div>
                  <div className="w-full flex justify-start my-1">
                    <Compass className="mr-1" />
                    1.Go to lastman.xyz on Safari browser
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <Share className="mr-1" />
                    2. Tap Share
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <PlusSquare className="mr-1" />
                    3. Swipe up and tap Add to Home Screen
                  </div>
                </div>
              ) : (
                <div className="text-xl">
                  <div className="text-xl">To install the app:</div>
                  <div className="w-full flex justify-start my-1">
                    <Compass className="mr-1" />
                    1. Go to lastman.xyz on mobile browser
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <MoreVertical className="mr-1" />
                    2. Tap the More icon
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <PlusSquare className="mr-1" />
                    3. Add to Home Screen or Install App
                  </div>
                </div>
              )}
            </div>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog>
      <DialogTrigger className="w-[100%]">Mobile</DialogTrigger>
      <DialogContent className="bg-[#404833] text-white">
        <DialogHeader className="mx-auto">
          <DialogTitle className="font-digit text-3xl font-normal flex justify-center items-center">
            Play on mobile?
          </DialogTitle>
          <DialogDescription className="text-white">
            <div className="flex flex-col justify-center items-center">
              <Image
                priority
                src={`/faces/choose.svg`}
                height={152}
                width={152}
                className="my-2"
                alt={`enter pepe`}
              />

              {isIOS ? (
                <div className="text-xl">
                  <div className="text-xl">To install the app from Safari on iOS:</div>
                  <div className="w-full flex justify-start my-1">
                    <Compass className="mr-1" />
                    1. Go to lastman.xyz on Safari mobile browser
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <Share className="mr-1" />
                    2. Tap Share
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <PlusSquare className="mr-1" />
                    3. Swipe up and tap Add to Home Screen
                  </div>
                </div>
              ) : (
                <div className="text-xl">
                  <div className="">To install the app:</div>
                  <div className="w-full flex justify-start my-1">
                    <Compass className="mr-1" />
                    1. Go to lastman.xyz on mobile browser
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <MoreVertical className="mr-1" />
                    2. Tap the More icon
                  </div>
                  <div className="w-full flex justify-start my-1">
                    <PlusSquare className="mr-1" />
                    3. Add to Home Screen or Install App
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PWADrawer
