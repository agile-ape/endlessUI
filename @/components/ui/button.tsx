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
        default: 'text-black dark:text-white whitespace-nowrap bg-neutral-400 hover:bg-neutral-500 dark:hover:bg-neutral-800 dark:bg-neutral-900 focus:outline-none focus:ring disabled:pointer-events-none disabled:opacity-50',
        // destructive: 'text-black dark:text-white whitespace-nowrap bg-transparent hover:border hover:border-neutral-500 dark:hover:border dark:hover:bg-neutral-700 focus:outline-none focus:ring disabled:pointer-events-none disabled:opacity-50',
        


        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        
        play: 'text-lime-800 dark:text-lime-300 whitespace-nowrap bg-transparent hover:bg-lime-800 hover:text-white dark:hover:text-black dark:hover:bg-lime-300 focus:outline-none focus:ring focus:ring-lime-500 disabled:pointer-events-none disabled:opacity-50 border border-lime-800 dark:border-lime-300',
        link: 'text-black dark:text-white whitespace-nowrap bg-transparent focus: outline-none focus:ring disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline',
        
        
        exit: 'text-red-800 dark:text-red-300 whitespace-nowrap bg-transparent hover:bg-red-800 hover:text-black dark:hover:text-white dark:hover:bg-red-300 focus:outline-none focus:ring focus:ring-lime-500 disabled:pointer-events-none disabled:opacity-50 border border-red-800 dark:border-red-300',
        
        
        
        
        
        
        change: 'text-white hover:text-black bg-purple-700 hover:bg-gradient-to-br from-orange-600 to-yellow-400  active:hover:bg-gradient-to-br from-orange-600 to-yellow-400 focus: outline-none focus:ring focus:ring-pink-300 disabled:pointer-events-none disabled:opacity-90 disabled:bg-gradient-to-br from-orange-600 to-yellow-400 disabled:text-black',
        // menu: 'text-white whitespace-nowrap bg-indigo-950 hover:bg-indigo-800 active:bg-indigo-700 focus: outline-none focus:ring focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 dark:border dark:border-white',
        
        
        whitelist:
        'text-white hover:text-black bg-blue-950 hover:bg-gradient-to-br from-orange-600 to-yellow-400  active:hover:bg-gradient-to-br from-orange-600 to-yellow-400 focus: outline-none focus:ring focus:ring-pink-300 disabled:pointer-events-none disabled:opacity-90 disabled:bg-gradient-to-br from-orange-600 to-yellow-400 disabled:text-black',
        
        enter:
        'text-white bg-purple-900 hover:bg-purple-700 hover:border-2 hover:border-purple-300 active:bg-purple-500 focus: outline-none focus:ring focus:ring-purple-300 disabled:pointer-events-none disabled:opacity-50',
        
        submit:
        'text-white bg-green-900 hover:bg-green-950 hover:border-2 hover:border-green-300 active:bg-green-800 focus: outline-none focus:ring focus:ring-green-300 disabled:pointer-events-none disabled:opacity-50',
        
        splitPot: 
        'text-white bg-rose-900 border-2 border-rose-100 hover:bg-rose-950 hover:border-2 hover:border-rose-300 active:bg-rose-500 active:bg-rose-800',
        
        filter: 
        // 'text-white whitespace-nowrap bg-slate-700 hover:bg-slate-800 hover:border-2 hover:border-slate-300 focus:outline-none focus:ring disabled:cursor-default disabled:bg-slate-900 disabled:opacity-100',
        'text-white whitespace-nowrap bg-slate-700 hover:bg-slate-800 hover:border-2 hover:border-slate-300 focus:outline-none focus:ring disabled:cursor-default disabled:bg-slate-900 disabled:opacity-100',
      
        check:
          'text-white bg-blue-950 border border-slate-500 hover:bg-blue-700 hover:border-2 hover:border-blue-300 active:bg-blue-500 focus: outline-none focus:ring focus:ring-blue-300 disabled:pointer-events-none disabled:opacity-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 rounded-md px-3 text-base leading-6',
        lg: 'h-12 rounded-xl px-5 py-1 text-lg leading-10',
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
