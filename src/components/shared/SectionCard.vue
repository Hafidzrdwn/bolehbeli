<script setup lang="ts">
import { computed } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createId } from '@/lib/id'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  description?: string
  id?: string
  class?: string
}

const props = defineProps<Props>()

const headingId = computed(() => props.id ?? `section-heading-${createId()}`)

defineExpose({ headingId })
</script>

<template>
  <Card
    :aria-labelledby="headingId"
    :class="cn('border border-border/50 bg-card/80 rounded-2xl', props.class)"
  >
    <CardHeader class="flex flex-row items-start justify-between gap-4 p-4 pb-2 sm:p-5 sm:pb-3">
      <div class="space-y-1">
        <CardTitle :id="headingId" as="h2" class="text-base font-semibold tracking-tight sm:text-lg">
          {{ title }}
        </CardTitle>
        <CardDescription v-if="description" class="text-xs text-muted-foreground sm:text-sm">
          {{ description }}
        </CardDescription>
      </div>
      <div v-if="$slots.action" class="shrink-0">
        <slot name="action" />
      </div>
    </CardHeader>
    <CardContent class="p-4 pt-2 sm:p-5 sm:pt-3">
      <slot />
    </CardContent>
  </Card>
</template>
