<script setup lang="ts">
import { ShoppingBag } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import WishlistItemRow from '@/features/wishlist/WishlistItemRow.vue'
import type { WishlistItem } from '@/types/finance'

interface Props {
  items: WishlistItem[]
  baselineDailyBudget: number
}

defineProps<Props>()

const emits = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <div>
    <EmptyState
      v-if="items.length === 0"
      :icon="ShoppingBag"
      title="Belum ada barang incaran"
      description="Tambahkan barang impian di atas untuk mulai mensimulasikan kelayakan belanja."
    />

    <TransitionGroup
      v-else
      tag="ul"
      name="list-fade"
      class="space-y-2"
    >
      <WishlistItemRow
        v-for="item in items"
        :key="item.id"
        :item="item"
        :baseline-daily-budget="baselineDailyBudget"
        @toggle="emits('toggle', $event)"
        @remove="emits('remove', $event)"
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
