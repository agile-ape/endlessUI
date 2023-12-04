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

const ToastIcon = {
  destructive: <AlertCircle size={64} className="mr-2 stroke-red-800" />,
  success: <CheckCircle2 size={20} className="mr-2 stroke-green-600 mt-[3px]" />,
  warning: <AlertTriangle size={20} className="mr-2 stroke-yellow-600 mt-[3px]" />,
  info: <Info size={20} className="mr-2 stroke-blue-500" />,
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = props.variant

        return (
          <Toast key={id} {...props}>
            <div className="flex">
              {ToastIcon[variant as keyof typeof ToastIcon]}
              <div className="flex flex-col font-vt323 mr-7">
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
