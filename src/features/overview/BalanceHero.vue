<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Pencil } from '@lucide/vue'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, daysRemaining } = storeToRefs(store)

const isEditing = ref(false)
const originalValue = ref<number>(0)
const draftValue = ref<number | null>(null)
const rupiahInputRef = ref<InstanceType<typeof RupiahInput> | null>(null)

function startEditing(): void {
  originalValue.value = state.value.currentBalance
  draftValue.value = state.value.currentBalance
  isEditing.value = true
  nextTick(() => {
    rupiahInputRef.value?.focus()
  })
}

function handleSave(): void {
  if (!isEditing.value) return
  store.setBalance(draftValue.value ?? 0)
  isEditing.value = false
}

function handleCancel(): void {
  isEditing.value = false
  draftValue.value = originalValue.value
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleSave()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
  }
}
</script>

<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between gap-2">
      <span class="text-section-label select-none">Saldo saat ini</span>
      <span class="text-meta text-muted-foreground tabular-nums select-none">
        Sisa {{ daysRemaining }} hari
      </span>
    </div>

    <div v-if="!isEditing" class="flex items-center gap-2">
      <div
        role="button"
        tabindex="0"
        aria-label="Ubah saldo"
        class="group inline-flex items-center gap-2.5 rounded-xl px-2 py-1 -ml-2 hover:bg-foreground/5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="startEditing"
        @keydown.enter.prevent="startEditing"
        @keydown.space.prevent="startEditing"
      >
        <span class="text-display font-semibold text-foreground tabular-nums">
          {{ formatIDR(state.currentBalance) }}
        </span>
        <Pencil class="size-4 text-muted-foreground group-hover:text-foreground opacity-60 group-hover:opacity-100 transition-all shrink-0" aria-hidden="true" />
      </div>
    </div>

    <div v-else class="flex items-center">
      <RupiahInput
        id="balance-input"
        ref="rupiahInputRef"
        v-model="draftValue"
        variant="hero"
        placeholder="0"
        @keydown="handleKeydown"
        @blur="handleSave"
      />
    </div>
  </div>
</template>
