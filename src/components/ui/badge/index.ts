import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap [&>svg]:size-3! [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border-border text-foreground',
        safe: 'bg-safe/15 text-safe-foreground border-transparent',
        warning: 'bg-warning/15 text-warning-foreground border-transparent',
        danger: 'bg-danger/15 text-danger-foreground border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
