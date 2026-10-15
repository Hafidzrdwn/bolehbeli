import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border border-transparent text-sm font-medium focus-visible:ring-3 motion-safe:active:scale-[0.98] [&_svg:not([class*=size-])]:size-4 inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 shadow-xs',
        ghost:
          'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 shadow-xs',
      },
      size: {
        default: 'h-11 gap-2 px-4',
        sm: 'h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5',
        icon: 'size-11',
        'icon-sm': 'size-8 rounded-[min(var(--radius-md),10px)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
