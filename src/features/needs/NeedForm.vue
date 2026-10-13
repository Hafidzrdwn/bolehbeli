<script setup lang="ts">
import { computed, nextTick } from 'vue'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useItemForm } from '@/composables/useItemForm'
import type { ExpenseCategory, ExpenseItem, Result } from '@/types/finance'

interface Props {
  category?: ExpenseCategory
  isEmergencyBuffer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  category: 'other',
  isEmergencyBuffer: false,
})

const emits = defineEmits<{
  (
    e: 'submit',
    payload: { title: string; amount: number; category: ExpenseCategory },
  ): Result<ExpenseItem>
}>()

const { title, amount, error, submit } = useItemForm(
  ({ title: itemTitle, amount: itemAmount }) => {
    return emits('submit', {
      title: itemTitle,
      amount: itemAmount,
      category: props.category,
    })
  },
  () => {
    document.getElementById('need-title-input')?.focus()
  },
)

const hasError = computed(() => Boolean(error.value))

function focusAmount(): void {
  nextTick(() => {
    const el = document.getElementById('need-amount-input')
    el?.focus()
  })
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    submit()
  }
}

defineExpose({
  setTitle: (newTitle: string) => {
    title.value = newTitle
  },
  focusAmount,
})
</script>

<template>
  <form class="space-y-3" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="space-y-1">
        <Label for="need-title-input" class="text-xs text-muted-foreground">
          Nama kebutuhan
        </Label>
        <Input
          id="need-title-input"
          v-model="title"
          maxlength="60"
          placeholder="Misal: Makan siang"
          :aria-invalid="hasError"
          :aria-describedby="hasError ? 'need-form-error' : undefined"
          class="h-11 text-base md:text-sm"
          @keydown="handleKeydown"
        />
      </div>

      <div class="space-y-1">
        <Label for="need-amount-input" class="text-xs text-muted-foreground">
          Nominal
        </Label>
        <RupiahInput
          id="need-amount-input"
          v-model="amount"
          placeholder="0"
          :invalid="hasError"
          @keydown="handleKeydown"
        />
      </div>
    </div>

    <p
      v-if="isEmergencyBuffer"
      class="text-xs italic text-muted-foreground"
    >
      Dihitung sebagai kebutuhan wajib; terpisah dari buffer otomatis.
    </p>

    <p
      v-if="error"
      id="need-form-error"
      role="alert"
      class="text-xs font-medium text-danger"
    >
      {{ error }}
    </p>

    <Button type="submit" class="h-11 w-full font-medium sm:w-auto">
      Tambah Kebutuhan
    </Button>
  </form>
</template>
