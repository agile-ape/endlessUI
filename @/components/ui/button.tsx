import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-white focus:ring disabled:pointer-events-none items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        // secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        // ghost: 'hover:bg-accent hover:text-accent-foreground',

        default: '',

        /*-------------------- HEADER ---------------------*/
        // style text only. no bg. underline
        link: 'text-gray-600 dark:text-gray-200 bg-transparent active:underline hover:underline underline-offset-4',

        /*-------------------- GAME TAB ---------------------*/
        // fixed bg. dark mode
        enter:
          'text-white bg-purple-900 hover:bg-purple-700 active:bg-purple-500 border-2 border-transparent hover:border-purple-300',

        // fixed bg. light and dark mode
        exit: 'text-purple-900 dark:text-purple-100 hover:text-white bg-transparent hover:bg-purple-600 active:bg-purple-500 border-2 border-purple-900 dark:border-purple-100',
        // fixed bg. light and dark mode
        checkOut:
          'text-indigo-800 dark:text-indigo-100 hover:text-white bg-transparent hover:bg-indigo-600 active:bg-indigo-500 border-2 border-indigo-800 dark:border-indigo-2 dark:border-indigo-300',

        // fixed bg. light mode
        submit:
          'text-white bg-green-600 hover:bg-green-800 active:bg-green-700 border-2 border-green-800 hover:border-green-300 active:bg-green-800',
        // fixed bg. light mode
        splitPot:
          'text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-500 border-2 border-pink-800 hover:border-pink-300 active:bg-pink-600',
        // fixed bg. light mode
        checkIn:
          'text-white bg-sky-600 hover:bg-sky-800 active:bg-sky-700 border-2 border-sky-800 hover:border-sky-300',

        // gradient bg. 1 mode.
        wager:
          'rounded-full text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 border-4 border-orange-800 hover:border-orange-300',

        // gradient bg.
        secondary:
          'text-blue-950 dark:text-white hover:text-white bg-transparent hover:bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 border border-blue-950 dark:border-white',

        // claim:
        //   'text-indigo-800 dark:hover:text-white  border-2 border-indigo-800 bg-transparent hover:text-white hover:bg-indigo-600 active:bg-indigo-800',
        /*-------------------- TICKET LIST ---------------------*/
        // does not uses size
        filter:
          'text-gray-600 bg-gray-300 dark:bg-gray-600 text-zinc-500 dark:text-zinc-200hover:bg-gray-400 dark:hover:bg-gray-700 disabled:cursor-default disabled:text-black dark:disabled:text-white disabled:bg-gray-400 dark:disabled:bg-gray-800',

        // does not uses size
        attack:
          'text-black dark:text-amber-700 bg-transparent border-2 border-amber-700 hover:text-white dark:hover:text-white hover:bg-amber-600 hover:border-2 hover:border-amber-300 active:bg-amber-500',

        // does not uses size
        kickOut:
          'text-rose-800 border border-rose-800 bg-transparent hover:text-white hover:dark:text-white hover:bg-rose-900 active:bg-red-500',
        // 'text-red-800 dark:text-red-300  border border-red-800 dark:border-red-300 bg-transparent hover:text-white hover:dark:text-white hover:bg-red-600 active:bg-red-500   ',

        primary: 'text-white border bg-blue-800 hover:bg-blue-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 rounded-md px-3 text-base leading-6',
        lg: 'h-12 rounded-xl px-5 py-1 text-xl leading-10',
        icon: 'h-10 w-10',
        secondary: 'w-full text-xl',
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
