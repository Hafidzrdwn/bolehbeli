<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Receipt } from '@lucide/vue'
import PageSection from '@/components/layout/PageSection.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ItemComposer from '@/components/shared/ItemComposer.vue'
import WishlistRow from '@/features/wishlist/WishlistRow.vue'
import { MAX_ITEMS } from '@/lib/constants'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, selectedCount, totalActiveWishlist, baselineDailyBudget } = storeToRefs(store)

const isLimitReached = computed(() => state.value.wishlist.length >= MAX_ITEMS)

function handleAddWishlist(data: { title: string; amount: number }) {
  return store.addWishlistItem({
    title: data.title,
    price: data.amount,
  })
}

function handleToggle(id: string): void {
  store.toggleWishlistItem(id)
}

function handleRemove(id: string): void {
  store.removeWishlistItem(id)
}
</script>

<template>
  <PageSection title="Wishlist">
    <template #meta>
      <span class="text-xs font-semibold text-primary sm:text-sm tabular-nums" aria-live="polite">
        {{ selectedCount }} dipilih · {{ formatIDR(totalActiveWishlist) }}
      </span>
    </template>

    <div class="space-y-4">
      <ItemComposer
        title-id="wishlist-title-input"
        amount-id="wishlist-price-input"
        error-id="wishlist-form-error"
        title-placeholder="Misal: Monitor 24 inch"
        amount-placeholder="0"
        submit-label="Tambah"
        :is-limit-reached="isLimitReached"
        limit-message="Maksimal 50 item wishlist tercapai."
        :on-submit="handleAddWishlist"
      />

      <div v-if="state.wishlist.length === 0" class="pt-2">
        <EmptyState
          :icon="Receipt"
          title="Belum ada wishlist"
          description="Tambahkan barang yang ingin disimulasikan"
        />
      </div>

      <ul
        v-else
        role="list"
        class="divide-y divide-border/40 lg:max-h-[calc(100dvh-20rem)] lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:thin]"
      >
        <WishlistRow
          v-for="item in state.wishlist"
          :key="item.id"
          :item="item"
          :baseline-daily-budget="baselineDailyBudget"
          @toggle="handleToggle"
          @remove="handleRemove"
        />
      </ul>
    </div>
  </PageSection>
</template>
