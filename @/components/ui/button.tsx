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
        // enter and exit - purple
        // fixed bg. dark mode
        enter:
          // 'text-white bg-purple-900 hover:bg-purple-700 active:bg-purple-500 border-2 border-transparent hover:border-purple-300',
          // 'text-fuchsia-950 bg-gradient-to-r from-fuchsia-500 to-fuchsia-400 border-4 border-fuchsia-950 hover:text-fuchsia-50 hover:bg-fuchsia-700 hover:border-fuchsia-300 active:bg-fuchsia-500 ',
          // 'text-blue-100 shadow-xl hover:shadow-purple-50 bg-gradient-to-r from-purple-600 to-purple-500 border-4 border-purple-700 hover:text-purple-50 hover:bg-purple-700 hover:border-purple-300 active:bg-purple-500 ',
          'font-whitrabt text-2xl hover:text-3xl text-lime-400 bg-slate-200/10 hover:bg-slate-600/30 border-4 border-lime-400 hover:text-lime-200 hover:border-lime-200 active:text-lime-300 active:border-lime-300',

        // gradient bg. 1 mode.
        wager:
          // 'text-neutral-50 bg-neutral-600 border-2 border-neutral-800 hover:bg-neutral-700 hover:border-neutral-900 active:bg-neutral-700',
          // 'text-neutral-950 bg-neutral-200 border-2 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-200 active:bg-neutral-300',
          'text-stone-950 bg-stone-200 border-2 border-stone-400 hover:bg-stone-100 hover:border-stone-500 active:bg-stone-300',

        admin:
          'text-pink-50 bg-pink-500 border-2 border-pink-700 hover:bg-pink-700 hover:border-pink-200 active:bg-pink-600',

        send:
          // fixed bg. light and dark mode. opposite of enter
          // 'text-purple-50 bg-purple-500 border-2 border-purple-600 hover:bg-purple-400 hover:border-purple-300 active:bg-purple-600',
          'text-slate-950 bg-slate-300 border-2 border-slate-400 hover:bg-slate-400 hover:border-slate-500 active:bg-slate-300',
        // 'text-indigo-50 bg-indigo-700 border border-indigo-500 hover:bg-indigo-600 hover:border-indigo-200 active:bg-indigo-500',

        buy: 'text-indigo-950 bg-indigo-300 border-2 border-indigo-400 hover:bg-indigo-200 hover:border-indigo-300 active:bg-indigo-100',

        change:
          // 'text-indigo-50 bg-indigo-700 border border-indigo-500 hover:bg-indigo-600 hover:border-indigo-200 active:bg-indigo-500',
          'text-purple-50 bg-purple-700 border-2 border-purple-500 hover:bg-purple-600 hover:border-purple-200 active:bg-purple-500',

        exit:
          // 'text-purple-900 dark:text-purple-100 hover:text-white bg-transparent hover:bg-purple-600 active:bg-purple-500 border-2 border-purple-900 dark:border-purple-100',
          'text-red-500 bg-transparent border-2 border-red-600 hover:text-red-700 hover:bg-red-200 hover:border-red-800 active:bg-red-700/20 dark:text-red-200 dark:bg-transparent dark:border-red-300 dark:hover:bg-red-300/20 dark:hover:text-red-300 dark:hover:border-red-300 dark:active:bg-red-200/20',
        // 'text-red-800 dark:text-red-300  border border-red-800 dark:border-red-300 bg-transparent hover:text-white hover:dark:text-white hover:bg-red-600 active:bg-red-500   ',

        // fixed bg. light mode
        submit:
          // 'text-white bg-green-600 hover:bg-green-500 active:bg-green-700 border-2 border-green-800 hover:border-green-300 active:bg-green-800',
          // 'text-white bg-green-700 border-2 border-green-800 hover:bg-green-600 hover:border-green-400 active:bg-green-800',
          'text-green-50 bg-green-600 border-2 border-green-800 hover:bg-green-800 hover:border-green-300 active:bg-green-700',

        // fixed bg. light mode
        splitPot:
          // 'text-white bg-green-600 hover:bg-green-500 active:bg-green-600 border-2 border-green-800 hover:border-green-300 active:bg-green-800',
          // 'text-white bg-pink-500 hover:bg-pink-600 active:bg-pink-500 border-2 border-pink-800 hover:border-pink-300 active:bg-pink-600',
          // 'text-pink-50 bg-pink-500 border-2 border-pink-700 hover:bg-pink-700 hover:border-pink-200 active:bg-pink-600',
          'text-amber-950 bg-amber-400 border-2 border-amber-700 hover:bg-amber-300 hover:border-amber-950 active:bg-amber-500',

        // checkin and checkout - sky
        // fixed bg. light mode
        checkIn:
          // 'text-white bg-sky-600 border-2 border-sky-800 hover:bg-sky-800 hover:border-sky-300 active:bg-sky-700',
          // 'text-white bg-cyan-600 border-2 border-cyan-800 hover:bg-cyan-800 hover:border-cyan-300 active:bg-cyan-700',
          // 'text-white bg-teal-600 border-2 border-teal-800 hover:bg-teal-800 hover:border-teal-300 active:bg-teal-700',
          'text-blue-50 bg-blue-600 border-2 border-blue-800 hover:bg-blue-800 hover:border-blue-300 active:bg-blue-700',

        // fixed bg. opposite but lighter tone than checkIn
        checkOut:
          // 'text-sky-600 bg-transparent border-2 border-sky-600 hover:text-sky-800 hover:bg-sky-800/20 hover:border-sky-800 active:bg-sky-700/20 dark:text-sky-300 dark:bg-transparent dark:border-sky-300 dark:hover:bg-sky-300/20 dark:hover:text-sky-300 dark:hover:border-sky-300 dark:active:bg-sky-200/20',
          // 'text-white bg-sky-500 border-2 border-sky-600 hover:bg-sky-400 hover:border-sky-500 active:bg-sky-600',
          'text-blue-950 bg-blue-200 border-2 border-blue-300 hover:bg-blue-100 hover:border-blue-200 active:bg-blue-300',

        // does not uses size
        attack:
          // 'text-black dark:text-amber-700 bg-transparent border-2 border-amber-700 hover:text-white dark:hover:text-white hover:bg-amber-600 hover:border-2 hover:border-amber-300 active:bg-amber-500',
          // does not uses size
          // 'text-amber-50 bg-amber-500 border-2 border-amber-700 hover:bg-amber-700 hover:border-amber-200 active:bg-amber-600',
          // 'text-white bg-orange-500 border-2 border-orange-700 hover:bg-orange-700 hover:border-orange-200 active:bg-orange-600',
          'text-orange-50 bg-orange-500 border-2 border-orange-700 hover:bg-orange-700 hover:border-orange-200 active:bg-orange-600',

        kickOut:
          // 'text-rose-800 border border-rose-800 bg-transparent hover:text-white hover:dark:text-white hover:bg-rose-900 active:bg-red-500',
          // 'text-red-800 dark:text-red-300  border border-red-800 dark:border-red-300 bg-transparent hover:text-white hover:dark:text-white hover:bg-red-600 active:bg-red-500   ',
          'text-orange-50 bg-orange-500 border-2 border-orange-700 hover:bg-orange-700 hover:border-orange-200 active:bg-orange-600',

        // fixed bg. light and dark mode
        // checkOutv2:
        //   'text-indigo-800 dark:text-indigo-100 hover:text-white bg-transparent hover:bg-indigo-600 active:bg-indigo-500 border-2 border-indigo-800 dark:border-indigo-2 dark:border-indigo-300',

        // fixed bg. light and dark mode
        primary:
          'text-indigo-50 bg-indigo-700 border border-indigo-500 hover:bg-indigo-600 hover:border-indigo-200 active:bg-indigo-500',

        secondary:
          'text-indigo-800 bg-transparent border border-indigo-800 \
            dark:text-indigo-50 dark:border-indigo-50 dark:hover:bg-indigo-800/20 \
            active:bg-indigo-100',

        // main: 'text-white bg-gradient-to-r from-indigo-800 via-indigo-700 to-[#6672C7] hover:bg-indigo-300 hover:motion-safe:animate-bounce active:bg-indigo-600 border border-transparent hover:border-indigo-300',
        // main: 'text-white bg-gradient-to-b from-[#FFF1F8] via-[#FFC3E0] to-[#6672C7] hover:bg-indigo-300 hover:motion-safe:animate-bounce active:bg-indigo-600 border border-transparent hover:border-indigo-300',

        privy:
          'text-white bg-violet-700 hover:bg-violet-600 active:bg-violet-600 border border-transparent hover:border-violet-300',
        // 'text-white bg-slate-700 hover:bg-slate-600 active:bg-slate-600 border border-transparent hover:border-slate-300',

        // claim:
        //   'text-indigo-800 dark:hover:text-white  border-2 border-indigo-800 bg-transparent hover:text-white hover:bg-indigo-600 active:bg-indigo-800',
        /*-------------------- TICKET LIST ---------------------*/
        // does not uses size
        filter:
          'text-gray-600 bg-gray-300 dark:bg-gray-600 text-zinc-500 dark:text-zinc-200 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:cursor-default disabled:text-black dark:disabled:text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:bg-opacity-80',

        // wallet:
        //   'text-black hover:text-white bg-white hover:bg-blue-400 active-bg-blue-600 border border-blue-950',

        // primary: 'text-white bg-indigo-500 hover:bg-indigo-600',
        // gradient bg.
        // connect:
        //   'text-blue-950 dark:text-white hover:text-white bg-transparent hover:bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 border border-blue-950 dark:border-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        md: 'h-10 rounded-md px-3 text-xl leading-6',
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
