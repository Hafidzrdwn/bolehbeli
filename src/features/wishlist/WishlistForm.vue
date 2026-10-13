<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useItemForm } from '@/composables/useItemForm'
import { MAX_ITEMS } from '@/lib/constants'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state } = storeToRefs(store)

const isLimitReached = computed(() => state.value.wishlist.length >= MAX_ITEMS)

const { title, amount, error, submit } = useItemForm(
  ({ title: itemTitle, amount: itemAmount }) => {
    return store.addWishlistItem({
      title: itemTitle,
      price: itemAmount,
    })
  },
  () => {
    document.getElementById('wishlist-title-input')?.focus()
  },
)

const hasError = computed(() => Boolean(error.value))

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    submit()
  }
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="space-y-1">
        <Label for="wishlist-title-input" class="text-xs text-muted-foreground">
          Nama barang
        </Label>
        <Input
          id="wishlist-title-input"
          v-model="title"
          maxlength="60"
          placeholder="Misal: Monitor 24 inch"
          :disabled="isLimitReached"
          :aria-invalid="hasError"
          :aria-describedby="hasError ? 'wishlist-form-error' : undefined"
          class="h-11 text-base md:text-sm"
          @keydown="handleKeydown"
        />
      </div>

      <div class="space-y-1">
        <Label for="wishlist-price-input" class="text-xs text-muted-foreground">
          Harga
        </Label>
        <RupiahInput
          id="wishlist-price-input"
          v-model="amount"
          placeholder="0"
          :disabled="isLimitReached"
          :invalid="hasError"
          @keydown="handleKeydown"
        />
      </div>
    </div>

    <p
      v-if="isLimitReached"
      class="text-xs font-medium text-amber-500"
    >
      Maksimal 50 item wishlist tercapai.
    </p>

    <p
      v-if="error"
      id="wishlist-form-error"
      role="alert"
      class="text-xs font-medium text-danger"
    >
      {{ error }}
    </p>

    <Button
      type="submit"
      :disabled="isLimitReached"
      class="h-11 w-full font-medium sm:w-auto"
    >
      Tambah
    </Button>
  </form>
</template>
