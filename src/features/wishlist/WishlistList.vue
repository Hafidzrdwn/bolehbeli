<script setup lang="ts">
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
  <div
    v-if="items.length === 0"
    class="rounded-lg border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground"
  >
    Belum ada barang di wishlist. Tambahkan barang impian untuk disimulasikan.
  </div>

  <ul v-else class="space-y-2">
    <WishlistItemRow
      v-for="item in items"
      :key="item.id"
      :item="item"
      :baseline-daily-budget="baselineDailyBudget"
      @toggle="emits('toggle', $event)"
      @remove="emits('remove', $event)"
    />
  </ul>
</template>
