<script setup lang="ts">
import { inject, ref, type HTMLAttributes, type Ref } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  sideOffset: 6,
})

const open = inject<Ref<boolean>>('popover-open')
const contentRef = ref<HTMLElement | null>(null)

onClickOutside(contentRef, () => {
  if (open && open.value) {
    open.value = false
  }
})

onKeyStroke('Escape', () => {
  if (open && open.value) {
    open.value = false
  }
})
</script>

<template>
  <div
    v-if="open"
    ref="contentRef"
    data-slot="popover-content"
    role="dialog"
    tabindex="-1"
    :class="
      cn(
        'absolute top-full z-50 mt-1.5 w-72 rounded-2xl bg-popover p-4 text-popover-foreground hairline shadow-xl dark:shadow-none outline-none duration-150',
        align === 'center'
          ? 'left-1/2 -translate-x-1/2'
          : align === 'end'
            ? 'right-0'
            : 'left-0',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
