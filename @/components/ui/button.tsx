import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-75',
  {
    variants: {
      variant: {
        default: 'bg-black text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',

        whitelist:
          'text-white bg-pink-900 hover:bg-pink-700 active:bg-pink-500 focus: outline-none focus:ring focus:ring-pink-300 disabled:pointer-events-none disabled:opacity-80',

        check:
          'text-white bg-blue-950 border border-slate-500 hover:bg-blue-700 active:bg-blue-500 focus: outline-none focus:ring focus:ring-blue-300 disabled:pointer-events-none disabled:opacity-50',
        enter:
          'text-white bg-purple-900 hover:bg-purple-700 active:bg-purple-500 focus: outline-none focus:ring focus:ring-purple-300 disabled:pointer-events-none disabled:opacity-50',
        submit:
          'text-white bg-green-900 hover:bg-green-950 active:bg-green-800 focus: outline-none focus:ring focus:ring-green-300 disabled:pointer-events-none disabled:opacity-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-xl px-8 py-2 text-lg leading-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <>
        {isLoading ? (
          <Comp
            disabled
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          >
            <Loader2 className="mr-1 animate-spin" />
            Loading...
          </Comp>
        ) : (
          <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
        )}
      </>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
