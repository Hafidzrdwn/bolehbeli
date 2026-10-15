<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { X } from '@lucide/vue'
import { reactiveOmit } from '@vueuse/core'
import {
  DialogClose,
  DialogContent,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import SheetOverlay from './SheetOverlay.vue'

const sheetClass =
  'fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl gap-4 rounded-t-2xl border-t hairline bg-card pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-card-foreground shadow-xl dark:shadow-none outline-none'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<
    DialogContentProps & {
      class?: HTMLAttributes['class']
      side?: 'top' | 'bottom' | 'left' | 'right'
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
      :class="cn(sheetClass, props.class)"
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
