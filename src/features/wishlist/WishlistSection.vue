<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Receipt } from '@lucide/vue'
import PageSection from '@/components/layout/PageSection.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ItemComposer from '@/components/shared/ItemComposer.vue'
import { useUndo } from '@/composables/useUndo'
import WishlistRow from '@/features/wishlist/WishlistRow.vue'
import { MAX_ITEMS } from '@/lib/constants'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'
import type { WishlistItem } from '@/types/finance'

const ItemEditSheet = defineAsyncComponent(
  () => import('@/components/shared/ItemEditSheet.vue'),
)

const store = useFinanceStore()
const { state, selectedCount, totalActiveWishlist, baselineDailyBudget } = storeToRefs(store)
const undo = useUndo()

const isLimitReached = computed(() => state.value.wishlist.length >= MAX_ITEMS)
const allSelected = computed(
  () => state.value.wishlist.length > 0 && selectedCount.value === state.value.wishlist.length,
)

const editingItem = ref<WishlistItem | null>(null)
const isEditOpen = ref(false)
const lastAddedId = ref<string | null>(null)
const addedAnnouncement = ref('')

function handleToggleAll(): void {
  store.setAllWishlistSelected(!allSelected.value)
}

function handleAddWishlist(data: { title: string; amount: number }) {
  const res = store.addWishlistItem({
    title: data.title,
    price: data.amount,
  })
  if (res.ok) {
    lastAddedId.value = res.value.id
    addedAnnouncement.value = `Ditambahkan: ${res.value.title}`
    nextTick(() => {
      const el = document.getElementById(`wishlist-item-${res.value.id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setTimeout(() => {
        if (lastAddedId.value === res.value.id) lastAddedId.value = null
      }, 1000)
    })
  }
  return res
}

function handleToggle(id: string): void {
  store.toggleWishlistItem(id)
}

function handleRemove(id: string): void {
  const res = store.removeWishlistItem(id)
  if (res.ok) {
    undo.record(`${res.value.item.title} dihapus`, () => {
      store.restoreWishlistItem(res.value.item, res.value.index)
    })
  }
}

function handleEdit(item: WishlistItem): void {
  editingItem.value = item
  isEditOpen.value = true
}
</script>

<template>
  <PageSection title="Wishlist">
    <template #meta>
      <div class="flex items-center gap-2.5">
        <button
          v-if="state.wishlist.length > 0"
          type="button"
          class="text-xs font-medium text-muted-foreground hover:text-foreground underline transition-colors"
          @click="handleToggleAll"
        >
          {{ allSelected ? 'Kosongkan' : 'Pilih semua' }}
        </button>
        <span class="text-xs font-semibold text-primary sm:text-sm tabular-nums" aria-live="polite">
          {{ selectedCount }} dipilih · {{ formatIDR(totalActiveWishlist) }}
        </span>
      </div>
    </template>

    <div class="space-y-4">
      <div class="sr-only" role="status" aria-live="polite">
        {{ addedAnnouncement }}
      </div>

      <ItemComposer
        title-id="wishlist-title-input"
        amount-id="wishlist-price-input"
        error-id="wishlist-form-error"
        title-placeholder="Misal: Monitor 24 inch"
        amount-placeholder="0"
        submit-label="Tambah Wishlist"
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

      <TransitionGroup
        v-else
        tag="ul"
        role="list"
        name="row-fade"
        class="divide-y divide-border/40 lg:max-h-[calc(100dvh-20rem)] lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:thin]"
      >
        <WishlistRow
          v-for="item in state.wishlist"
          :id="`wishlist-item-${item.id}`"
          :key="item.id"
          :item="item"
          :baseline-daily-budget="baselineDailyBudget"
          :class="[
            'transition-all duration-300',
            lastAddedId === item.id && 'bg-primary/10 ring-1 ring-primary/40',
          ]"
          @toggle="handleToggle"
          @remove="handleRemove"
          @edit="handleEdit"
        />
      </TransitionGroup>

      <ItemEditSheet
        v-if="editingItem"
        v-model:open="isEditOpen"
        :item="editingItem"
        item-type="wishlist"
      />
    </div>
  </PageSection>
</template>
