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
        default:
          'text-black dark:text-white whitespace-nowrap bg-neutral-400 hover:bg-neutral-500 dark:hover:bg-neutral-800 dark:bg-neutral-900 focus:outline-none focus:ring disabled:pointer-events-none disabled:opacity-50',
        // destructive: 'text-black dark:text-white whitespace-nowrap bg-transparent hover:border hover:border-neutral-500 dark:hover:border dark:hover:bg-neutral-700 focus:outline-none focus:ring disabled:pointer-events-none disabled:opacity-50',

        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',

        // uses size
        page: 'text-zinc-600 dark:text-zinc-400 whitespace-nowrap bg-transparent focus: outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline',

        link: 'text-zinc-600 dark:text-zinc-200 whitespace-nowrap bg-transparent focus: outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 underline-offset-4 hover:underline',

        // uses size
        howToPlay:
          'text-lime-800 dark:text-lime-300 whitespace-nowrap bg-transparent hover:bg-lime-800 hover:text-white dark:hover:text-black dark:hover:bg-lime-300 focus:outline-none focus:ring-1 focus:ring-lime-500 disabled:pointer-events-none disabled:opacity-50 border border-lime-800 dark:border-lime-300',

        // does not use size
        enter:
          'text-white whitespace-nowrap bg-purple-900 hover:bg-purple-700 hover:border-2 hover:border-purple-300 active:bg-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-300 disabled:pointer-events-none disabled:opacity-50',
        exit: 'text-purple-900 dark:text-purple-300 dark:hover:text-white whitespace-nowrap border-2 border-purple-900 dark:border-purple-300 bg-transparent hover:text-white hover:bg-purple-600 active:bg-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:pointer-events-none disabled:opacity-50',

        kickOut:
          'text-rose-800 dark:text-rose-100 whitespace-nowrap border border-rose-800 dark:border-rose-100 bg-transparent hover:text-white hover:dark:text-white hover:bg-rose-900 active:bg-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:pointer-events-none disabled:opacity-50',
        // 'text-red-800 dark:text-red-300 whitespace-nowrap border border-red-800 dark:border-red-300 bg-transparent hover:text-white hover:dark:text-white hover:bg-red-600 active:bg-red-500 focus:outline-none focus:ring focus:ring-red-500 disabled:pointer-events-none disabled:opacity-50',

        // does not use size
        submit:
          'text-white whitespace-nowrap bg-green-600 hover:bg-green-800 border-2 border-green-800 hover:border-2 hover:border-green-300 active:bg-green-800 focus:outline-none focus:ring-1 focus:ring-green-300 disabled:pointer-events-none disabled:opacity-50',

        // does not use size
        checkIn:
          'text-white whitespace-nowrap bg-sky-600 hover:bg-sky-800 hover:border-2 hover:border-sky-300 active:bg-sky-800 focus:outline-none focus:ring-1 focus:ring-sky-300 disabled:pointer-events-none disabled:opacity-50',
        // does not use size
        checkOut:
          'text-indigo-800 dark:text-indigo-300 dark:hover:text-white whitespace-nowrap border-2 border-indigo-800 dark:border-indigo-300 bg-transparent hover:text-white hover:bg-indigo-600 active:bg-indigo-800 focus:outline-none focus:ring-1 focus:ring-indigo-300 disabled:pointer-events-none disabled:opacity-50',

        // does not use size
        splitPot:
          'text-white whitespace-nowrap bg-pink-500 hover:bg-pink-600 hover:border-2 hover:border-pink-300 active:bg-pink-600 focus:outline-none focus:ring-1 focus:ring-pink-300 disabled:pointer-events-none disabled:opacity-50',

        // uses size
        change:
          'text-white hover:text-black bg-fuchsia-700 hover:bg-gradient-to-br from-orange-600 to-yellow-400 active:hover:bg-gradient-to-br from-orange-600 to-yellow-400 focus:outline-none focus:ring-1 focus:ring-pink-300 disabled:pointer-events-none disabled:opacity-90 disabled:bg-gradient-to-br from-orange-600 to-yellow-400 disabled:text-black',

        // does not uses size
        inspect:
          'text-black dark:text-white bg-transparent border-2 border-amber-700 hover:bg-amber-600 hover:border-2 hover:border-amber-300 active:bg-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-300 disabled:pointer-events-none disabled:opacity-50',

        // does not uses size
        filter:
          'text-gray-600 bg-gray-300 dark:bg-gray-600 dark:text-gray-300 whitespace-nowrap hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 disabled:cursor-default disabled:text-black dark:disabled:text-white disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:opacity-100',

        // does not uses size
        dropdown:
          'bg-neutral-400 dark:bg-neutral-600 whitespace-nowrap hover:bg-neutral-500 dark:hover:bg-neutral-700  focus: outline-none focus:ring-1 focus:ring-pink-300 disabled:pointer-events-none disabled:opacity-90',

        // menu: 'text-white whitespace-nowrap bg-indigo-950 hover:bg-indigo-800 active:bg-indigo-700 focus: outline-none focus:ring focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 dark:border dark:border-white',

        // whitelist: 'text-white hover:text-black bg-blue-950 hover:bg-gradient-to-br from-orange-600 to-yellow-400  active:hover:bg-gradient-to-br from-orange-600 to-yellow-400 focus: outline-none focus:ring focus:ring-pink-300 disabled:pointer-events-none disabled:opacity-90 disabled:bg-gradient-to-br from-orange-600 to-yellow-400 disabled:text-black',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 rounded-md px-3 text-base leading-6',
        lg: 'h-12 rounded-xl px-5 py-1 text-xl leading-10',
        icon: 'h-10 w-10',
        // main:
        // primary:
        secondary: 'w-full text-xl',
        // filter: 'rounded-full text-lg'
        // tertiary:
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
