<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { STATUS_CONFIG_MAP } from '@/components/shared/status-badge.config'
import type { DecisionStatus } from '@/types/finance'

interface Props {
  status: DecisionStatus
  class?: string
}

const props = defineProps<Props>()

const config = computed(() => STATUS_CONFIG_MAP[props.status])
</script>

<template>
  <Badge
    :variant="config.variant"
    :class="['h-7 gap-1.5 px-2.5 text-xs font-semibold', props.class]"
  >
    <component :is="config.icon" class="size-3.5 shrink-0" aria-hidden="true" />
    <span>{{ config.label }}</span>
  </Badge>
</template>
