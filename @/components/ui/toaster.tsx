import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import Image from 'next/image'

const ToastIcon = {
  destructive: <AlertCircle size={20} className="mx-2 stroke-red-800" />,
  success: <CheckCircle2 size={20} className="mx-2 stroke-green-600" />,
  // warning: <AlertTriangle size={20} className="mx-2 stroke-yellow-600 mt-[3px]" />,
  info: <Info size={20} className="mx-2 stroke-blue-500" />,
}

const ToastFace = {
  destructive: (
    <Image
      priority
      src={`/faces/moody.png`}
      height={50}
      width={50}
      // fill={true}
      // sizes="max-width:150px"
      className=""
      // layout="fixed"
      alt={`moody-pepe`}
    />
  ),
  success: (
    <Image
      priority
      src={`/faces/peep.png`}
      height={50}
      width={50}
      // fill={true}
      // sizes="max-width:150px"
      className=""
      // layout="fixed"
      alt={`peep-pepe`}
    />
  ),
  info: (
    <Image
      priority
      src={`/faces/exclaim.png`}
      height={50}
      width={50}
      // fill={true}
      // sizes="max-width:150px"
      className=""
      // layout="fixed"
      alt={`exclaim-pepe`}
    />
  ),
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
              {ToastFace[variant as keyof typeof ToastIcon]}
              <div>{ToastIcon[variant as keyof typeof ToastIcon]}</div>
              <div className="flex flex-col text-black font-vt323 mr-7">
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
