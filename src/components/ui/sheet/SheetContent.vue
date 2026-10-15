<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { X } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  DialogClose,
  DialogContent,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import SheetOverlay from './SheetOverlay.vue'

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-card text-card-foreground shadow-xl dark:shadow-none transition ease-in-out data-open:animate-in data-closed:animate-out duration-200 outline-none',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b hairline data-closed:slide-out-to-top data-open:slide-in-from-top',
        bottom: 'inset-x-0 bottom-0 border-t hairline rounded-t-2xl max-w-xl mx-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))] data-closed:slide-out-to-bottom data-open:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r hairline data-closed:slide-out-to-left data-open:slide-in-from-left sm:max-w-sm',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l hairline data-closed:slide-out-to-right data-open:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'bottom',
    },
  },
)

type SheetVariants = VariantProps<typeof sheetVariants>

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<
    DialogContentProps & {
      class?: HTMLAttributes['class']
      side?: SheetVariants['side']
      showCloseButton?: boolean
    }
  >(),
  {
    side: 'bottom',
    showCloseButton: true,
  },
)

const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'side')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <SheetOverlay />
    <DialogContent
      data-slot="sheet-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="cn(sheetVariants({ side }), props.class)"
    >
      <slot />

      <DialogClose
        v-if="showCloseButton"
        data-slot="sheet-close"
        as-child
      >
        <Button variant="ghost" class="absolute top-4 right-4" size="icon-sm" aria-label="Tutup">
          <X class="size-4" />
        </Button>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
