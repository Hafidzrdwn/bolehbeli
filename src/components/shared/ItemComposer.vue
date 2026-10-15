<script setup lang="ts">
import { computed, nextTick, useId, watch } from 'vue'
import { Plus, X } from '@lucide/vue'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type ItemFormSubmitData, useItemForm } from '@/composables/useItemForm'
import type { Result } from '@/types/finance'

interface Props {
  titleId?: string; amountId?: string; errorId?: string
  titlePlaceholder?: string; amountPlaceholder?: string
  submitLabel?: string; isLimitReached?: boolean
  limitMessage?: string; isEmergencyBuffer?: boolean
  maxlength?: number
  onSubmit: (data: ItemFormSubmitData) => Result<unknown>
}

const props = withDefaults(defineProps<Props>(), {
  titlePlaceholder: 'Nama item', amountPlaceholder: '0',
  submitLabel: 'Tambah', maxlength: 60,
})

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'titleChange', title: string): void
}>()

const fallbackId = useId()
const tId = computed(() => props.titleId ?? `composer-title-${fallbackId}`)
const aId = computed(() => props.amountId ?? `composer-amount-${fallbackId}`)
const errId = computed(() => props.errorId ?? `composer-error-${fallbackId}`)

const { title, amount, error, submit, reset } = useItemForm(
  props.onSubmit,
  () => {
    emit('success')
    nextTick(() => document.getElementById(tId.value)?.focus())
  },
  (err) => {
    document.getElementById(err === 'TITLE_EMPTY' ? tId.value : aId.value)?.focus()
  },
)

watch(title, (val) => emit('titleChange', val))

function onTitleKey(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (!amount.value) document.getElementById(aId.value)?.focus()
    else submit()
  } else if (e.key === 'Escape') {
    if (title.value) {
      e.preventDefault()
      title.value = ''
    } else {
      (e.target as HTMLElement).blur()
    }
  }
}

function onAmountKey(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    e.preventDefault()
    submit()
  }
}

function clearTitle(): void {
  title.value = ''
  document.getElementById(tId.value)?.focus()
}

defineExpose({
  getTitle: () => title.value,
  setTitle: (val: string) => { title.value = val },
  focusAmount: () => nextTick(() => document.getElementById(aId.value)?.focus()),
  reset,
})
</script>

<template>
  <div class="space-y-3">
    <slot v-if="$slots.presets" name="presets" />

    <form class="space-y-2" @submit.prevent="submit">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div class="relative min-w-0 flex-1">
          <Input
            :id="tId"
            v-model="title"
            :placeholder="titlePlaceholder"
            :maxlength="maxlength"
            :disabled="isLimitReached"
            :aria-invalid="Boolean(error)"
            :aria-describedby="error ? errId : undefined"
            class="h-11 w-full text-base md:text-sm pr-9"
            @keydown="onTitleKey"
          />
          <button
            v-if="title"
            type="button"
            tabindex="-1"
            aria-label="Hapus isi"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            @mousedown.prevent
            @click="clearTitle"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </div>

        <div class="flex items-center gap-2 sm:w-auto">
          <div class="min-w-0 flex-1 sm:w-36 sm:flex-none">
            <RupiahInput
              :id="aId"
              v-model="amount"
              :placeholder="amountPlaceholder"
              :disabled="isLimitReached"
              :invalid="Boolean(error)"
              class="h-11 text-base md:text-sm"
              @keydown="onAmountKey"
            />
          </div>

          <Button
            type="submit"
            :disabled="isLimitReached"
            :aria-label="submitLabel"
            class="size-11 shrink-0 p-0 font-semibold"
          >
            <Plus class="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <p v-if="isEmergencyBuffer" class="text-meta italic text-muted-foreground">
        Dihitung sebagai kebutuhan wajib; terpisah dari buffer otomatis.
      </p>
      <p v-if="isLimitReached && limitMessage" class="text-meta font-medium text-warning-foreground">
        {{ limitMessage }}
      </p>
      <p v-if="error" :id="errId" role="alert" class="text-meta font-medium text-danger-foreground">
        {{ error }}
      </p>
    </form>
  </div>
</template>
