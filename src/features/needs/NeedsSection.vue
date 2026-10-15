<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Receipt } from '@lucide/vue'
import PageSection from '@/components/layout/PageSection.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ItemComposer from '@/components/shared/ItemComposer.vue'
import { useUndo } from '@/composables/useUndo'
import NeedPresetChips from '@/features/needs/NeedPresetChips.vue'
import NeedRow from '@/features/needs/NeedRow.vue'
import type { NeedPreset } from '@/lib/finance/presets'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'
import type { ExpenseCategory, ExpenseItem } from '@/types/finance'

const ItemEditSheet = defineAsyncComponent(() => import('@/components/shared/ItemEditSheet.vue'))

const store = useFinanceStore()
const { state, totalNeeds } = storeToRefs(store)
const undo = useUndo()

const composerRef = ref<InstanceType<typeof ItemComposer> | null>(null)
const activePreset = ref<NeedPreset | null>(null)
const editingItem = ref<ExpenseItem | null>(null)
const isEditOpen = ref(false)
const lastAddedId = ref<string | null>(null)
const addedAnnouncement = ref('')

const activeCategory = computed<ExpenseCategory>(() => activePreset.value?.category ?? 'other')
const isEmergency = computed(() => activePreset.value?.id === 'buffer')

function handleSelectPreset(preset: NeedPreset): void {
  if (activePreset.value?.id === preset.id) {
    if (composerRef.value?.getTitle() === preset.label) composerRef.value?.setTitle('')
    activePreset.value = null
    return
  }
  activePreset.value = preset
  composerRef.value?.setTitle(preset.label)
  composerRef.value?.focusAmount()
}

function handleTitleChange(newTitle: string): void {
  if (activePreset.value && newTitle !== activePreset.value.label) activePreset.value = null
}

function handleSuccess(): void {
  activePreset.value = null
}

function handleAddNeed(data: { title: string; amount: number }) {
  const res = store.addNeed({
    title: data.title,
    amount: data.amount,
    category: activeCategory.value,
  })
  if (res.ok) {
    lastAddedId.value = res.value.id
    addedAnnouncement.value = `Ditambahkan: ${res.value.title}`
    nextTick(() => {
      const el = document.getElementById(`need-item-${res.value.id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setTimeout(() => {
        if (lastAddedId.value === res.value.id) lastAddedId.value = null
      }, 1000)
    })
  }
  return res
}

function handleRemoveNeed(id: string): void {
  const res = store.removeNeed(id)
  if (res.ok) {
    undo.record(`${res.value.item.title} dihapus`, () => {
      store.restoreNeed(res.value.item, res.value.index)
    })
  }
}

function handleEdit(item: ExpenseItem): void {
  editingItem.value = item
  isEditOpen.value = true
}
</script>

<template>
  <PageSection title="Kebutuhan wajib">
    <template #meta>
      <span class="text-xs text-muted-foreground tabular-nums">
        {{ state.needs.length }} item · {{ formatIDR(totalNeeds) }}
      </span>
    </template>

    <div class="space-y-4">
      <div class="sr-only" role="status" aria-live="polite">
        {{ addedAnnouncement }}
      </div>

      <ItemComposer
        ref="composerRef"
        title-id="need-title-input" amount-id="need-amount-input" error-id="need-form-error"
        title-placeholder="Misal: Makan siang" amount-placeholder="0" submit-label="Tambah Kebutuhan"
        :is-emergency-buffer="isEmergency" :on-submit="handleAddNeed"
        @title-change="handleTitleChange" @success="handleSuccess"
      >
        <template #presets>
          <NeedPresetChips :active-preset-id="activePreset?.id" @select="handleSelectPreset" />
        </template>
      </ItemComposer>

      <div v-if="state.needs.length === 0" class="pt-2">
        <EmptyState :icon="Receipt" title="Belum ada kebutuhan wajib" description="Tambahkan biaya pokok sampai target" />
      </div>

      <ul
        v-else
        role="list"
        class="divide-y divide-border/40 lg:max-h-[calc(100dvh-20rem)] lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:thin]"
      >
        <NeedRow
          v-for="item in state.needs"
          :id="`need-item-${item.id}`"
          :key="item.id"
          :item="item"
          :class="[
            'transition-all duration-300',
            lastAddedId === item.id && 'bg-primary/10 ring-1 ring-primary/40',
          ]"
          @remove="handleRemoveNeed"
          @edit="handleEdit"
        />
      </ul>

      <ItemEditSheet
        v-if="editingItem"
        v-model:open="isEditOpen"
        :item="editingItem"
        item-type="need"
      />
    </div>
  </PageSection>
</template>
