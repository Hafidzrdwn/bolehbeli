<script setup lang="ts">
import type { Component } from 'vue'
import { formatIDR } from '@/lib/money'

interface Props {
  title: string
  amount: number
  meta?: string
  icon?: Component
  selected?: boolean
  labelFor?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'labelClick', event: MouseEvent): void
}>()
</script>

<template>
  <li
    class="flex h-[52px] lg:h-12 w-full items-center justify-between gap-3 px-3 transition-colors border-b border-border/40 last:border-b-0 hover:bg-foreground/[0.03]"
    :class="{ 'bg-primary/[0.06]': selected }"
  >
    <div class="flex items-center gap-3 min-w-0 flex-1">
      <div
        v-if="icon"
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <component :is="icon" class="size-4" aria-hidden="true" />
      </div>

      <label
        v-if="labelFor"
        :for="labelFor"
        class="min-w-0 flex-1 cursor-pointer select-none"
        @click="emit('labelClick', $event)"
      >
        <p class="truncate text-sm font-medium text-foreground" :title="title">
          {{ title }}
        </p>
        <p v-if="meta" class="truncate text-xs text-muted-foreground">
          {{ meta }}
        </p>
      </label>

      <div v-else class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-foreground" :title="title">
          {{ title }}
        </p>
        <p v-if="meta" class="truncate text-xs text-muted-foreground">
          {{ meta }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <span class="text-sm font-semibold tabular-nums text-foreground">
        {{ formatIDR(amount) }}
      </span>
      <slot name="trailing" />
    </div>
  </li>
</template>
