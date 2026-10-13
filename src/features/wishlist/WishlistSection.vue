<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SectionCard from '@/components/shared/SectionCard.vue'
import WishlistForm from '@/features/wishlist/WishlistForm.vue'
import WishlistList from '@/features/wishlist/WishlistList.vue'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, selectedCount, totalActiveWishlist, baselineDailyBudget } = storeToRefs(store)

function handleToggle(id: string): void {
  store.toggleWishlistItem(id)
}

function handleRemove(id: string): void {
  store.removeWishlistItem(id)
}
</script>

<template>
  <SectionCard
    title="Wishlist (simulasi belanja)"
    description="Pilih barang yang ingin disimulasikan pengaruhnya terhadap jatah harian"
  >
    <template #action>
      <div
        class="text-xs font-semibold text-primary sm:text-sm"
        aria-live="polite"
      >
        {{ selectedCount }} dipilih · {{ formatIDR(totalActiveWishlist) }}
      </div>
    </template>

    <div class="space-y-6">
      <WishlistForm />

      <div class="border-t border-border/60 pt-4">
        <WishlistList
          :items="state.wishlist"
          :baseline-daily-budget="baselineDailyBudget"
          @toggle="handleToggle"
          @remove="handleRemove"
        />
      </div>
    </div>
  </SectionCard>
</template>
