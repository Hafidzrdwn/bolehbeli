<script setup lang="ts">
import { ReceiptText } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import NeedListItem from '@/features/needs/NeedListItem.vue'
import type { ExpenseItem } from '@/types/finance'

interface Props {
  items: ExpenseItem[]
}

defineProps<Props>()

const emits = defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <div class="space-y-2">
    <EmptyState
      v-if="items.length === 0"
      :icon="ReceiptText"
      title="Belum ada kebutuhan wajib"
      description="Catat pengeluaran rutinmu di atas atau pilih salah satu preset siap pakai."
    />
    <TransitionGroup
      v-else
      tag="ul"
      name="list-fade"
      class="space-y-2"
    >
      <NeedListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @remove="(id) => emits('remove', id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-fade-enter-active,
.list-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}
.list-fade-enter-from,
.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
