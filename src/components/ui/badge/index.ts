import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'h-5 gap-1 rounded-full px-2 py-0.5 text-xs font-medium inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap [&_svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary',
        neutral: 'bg-muted text-muted-foreground',
        safe: 'bg-safe/15 text-safe-foreground',
        warning: 'bg-warning/15 text-warning-foreground',
        danger: 'bg-danger/15 text-danger-foreground',
        outline: 'bg-muted/50 text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
