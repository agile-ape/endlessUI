import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/shadcn/toast'
import { useToast } from './use-toast'
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import Image from 'next/image'

const ToastIcon = {
  bought: <AlertCircle size={20} className="mx-2 stroke-[#FCFC03]" />,
  // success: <CheckCircle2 size={20} className="mx-2 stroke-green-600" />,
  // warning: <AlertTriangle size={20} className="mx-2 stroke-yellow-600 mt-[3px]" />,
  // info: <Info size={20} className="mx-2 stroke-blue-500" />,
}

const ToastFace = {
  bought: (
    <Image
      priority
      src={`/faces/moody.png`}
      height={50}
      width={50}
      className=""
      alt={`moody-pepe`}
    />
  ),
  // success: (
  //   <Image priority src={`/faces/peep.png`} height={50} width={50} className="" alt={`peep-pepe`} />
  // ),
  // info: (
  //   <Image
  //     priority
  //     src={`/faces/exclaim.png`}
  //     height={50}
  //     width={50}
  //     className=""
  //     alt={`exclaim-pepe`}
  //   />
  // ),
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = props.variant

        return (
          <Toast key={id} {...props}>
            <div className="flex text-xl items-center">
              <div className="flex flex-col ml-2 text-[#FCFC03] mr-7">
                {/* {title && <ToastTitle>{title}</ToastTitle>} */}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
