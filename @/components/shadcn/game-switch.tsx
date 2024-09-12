import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const GameSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-[24px] w-[48px] bg-grey-200 shrink-0 cursor-pointer items-center rounded-sm border border-slate-500/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-lime-400 data-[state=unchecked]:bg-red-800 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-950',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none bg-zinc-200 border-2 border-zinc-500  block h-6 w-6 rounded-sm shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
))
GameSwitch.displayName = SwitchPrimitives.Root.displayName

export { GameSwitch }
