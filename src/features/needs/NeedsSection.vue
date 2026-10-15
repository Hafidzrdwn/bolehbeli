<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Receipt } from '@lucide/vue'
import PageSection from '@/components/layout/PageSection.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import ItemComposer from '@/components/shared/ItemComposer.vue'
import NeedPresetChips from '@/features/needs/NeedPresetChips.vue'
import NeedRow from '@/features/needs/NeedRow.vue'
import type { NeedPreset } from '@/lib/finance/presets'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'
import type { ExpenseCategory } from '@/types/finance'

const store = useFinanceStore()
const { state, totalNeeds } = storeToRefs(store)

const composerRef = ref<InstanceType<typeof ItemComposer> | null>(null)
const activePreset = ref<NeedPreset | null>(null)

const activeCategory = computed<ExpenseCategory>(() => activePreset.value?.category ?? 'other')
const isEmergency = computed(() => activePreset.value?.id === 'buffer')

function handleSelectPreset(preset: NeedPreset): void {
  activePreset.value = preset
  composerRef.value?.setTitle(preset.label)
  composerRef.value?.focusAmount()
}

function handleSuccess(): void {
  activePreset.value = null
}

function handleAddNeed(data: { title: string; amount: number }) {
  return store.addNeed({
    title: data.title,
    amount: data.amount,
    category: activeCategory.value,
  })
}

function handleRemoveNeed(id: string): void {
  store.removeNeed(id)
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
      <ItemComposer
        ref="composerRef"
        title-id="need-title-input"
        amount-id="need-amount-input"
        error-id="need-form-error"
        title-placeholder="Misal: Makan siang"
        amount-placeholder="0"
        submit-label="Tambah Kebutuhan"
        :is-emergency-buffer="isEmergency"
        :on-submit="handleAddNeed"
        @success="handleSuccess"
      >
        <template #presets>
          <NeedPresetChips
            :active-preset-id="activePreset?.id"
            @select="handleSelectPreset"
          />
        </template>
      </ItemComposer>

      <div v-if="state.needs.length === 0" class="pt-2">
        <EmptyState
          :icon="Receipt"
          title="Belum ada kebutuhan wajib"
          description="Tambahkan biaya pokok sampai target"
        />
      </div>

      <ul
        v-else
        role="list"
        class="divide-y divide-border/40 lg:max-h-[calc(100dvh-20rem)] lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:thin]"
      >
        <NeedRow
          v-for="item in state.needs"
          :key="item.id"
          :item="item"
          @remove="handleRemoveNeed"
        />
      </ul>
    </div>
  </PageSection>
</template>
