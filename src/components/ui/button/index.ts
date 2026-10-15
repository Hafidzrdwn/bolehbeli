import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-transparent text-sm font-medium transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        soft: 'bg-primary/10 text-primary hover:bg-primary/15',
        outline:
          'hairline border-border/60 bg-transparent hover:bg-muted hover:text-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-11 pointer-fine:h-10 gap-2 px-4',
        sm: 'h-8 gap-1 rounded-lg px-2.5',
        icon: 'size-11 pointer-fine:size-10',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
