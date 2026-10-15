<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  SwitchRoot,
  SwitchThumb,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SwitchRootProps & {
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<SwitchRootEmits>()
const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot
    data-slot="switch"
    v-bind="forwarded"
    :class="cn(
      'peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground/15 before:absolute before:inset-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-11 before:content-[\'\']',
      props.class,
    )"
  >
    <SwitchThumb
      data-slot="switch-thumb"
      class="pointer-events-none block size-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5.5 data-[state=unchecked]:translate-x-0.5"
    />
  </SwitchRoot>
</template>
