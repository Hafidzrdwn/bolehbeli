<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import MoneyText from '@/components/shared/MoneyText.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import NeedForm from '@/features/needs/NeedForm.vue'
import NeedList from '@/features/needs/NeedList.vue'
import NeedPresetChips from '@/features/needs/NeedPresetChips.vue'
import type { NeedPreset } from '@/lib/finance/presets'
import { useFinanceStore } from '@/stores/finance'
import type { ExpenseCategory, ExpenseItem, Result } from '@/types/finance'

const store = useFinanceStore()
const { state, totalNeeds } = storeToRefs(store)

const formRef = ref<InstanceType<typeof NeedForm> | null>(null)
const activePreset = ref<NeedPreset | null>(null)

const activeCategory = computed<ExpenseCategory>(() => activePreset.value?.category ?? 'other')
const isEmergency = computed(() => activePreset.value?.id === 'buffer')

function handleSelectPreset(preset: NeedPreset): void {
  activePreset.value = preset
  formRef.value?.setTitle(preset.label)
  formRef.value?.focusAmount()
}

function handleAddNeed(payload: {
  title: string
  amount: number
  category: ExpenseCategory
}): Result<ExpenseItem> {
  const res = store.addNeed(payload)
  if (res.ok) {
    activePreset.value = null
  }
  return res
}

function handleRemoveNeed(id: string): void {
  store.removeNeed(id)
}
</script>

<template>
  <SectionCard title="Kebutuhan wajib" description="Biaya pokok yang harus dibayar sampai tanggal target">
    <template #action>
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-muted-foreground">Total:</span>
        <MoneyText :value="totalNeeds" class="text-base font-bold text-foreground" />
      </div>
    </template>

    <div class="space-y-6">
      <NeedPresetChips
        :active-preset-id="activePreset?.id"
        @select="handleSelectPreset"
      />

      <NeedForm
        ref="formRef"
        :category="activeCategory"
        :is-emergency-buffer="isEmergency"
        @submit="handleAddNeed"
      />

      <div class="border-t border-border/60 pt-4">
        <NeedList
          :items="state.needs"
          @remove="handleRemoveNeed"
        />
      </div>
    </div>
  </SectionCard>
</template>
