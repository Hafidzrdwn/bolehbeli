<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from '@lucide/vue'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ERROR_MESSAGES } from '@/composables/useItemForm'
import { useFinanceStore } from '@/stores/finance'
import type { ExpenseCategory } from '@/types/finance'

interface ItemData {
  id: string
  title: string
  amount?: number
  price?: number
  category?: ExpenseCategory
}

interface Props {
  item: ItemData | null
  itemType: 'need' | 'wishlist'
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'saved'): void }>()
const open = defineModel<boolean>('open', { default: false })

const store = useFinanceStore()
const title = ref('')
const amount = ref<number | null>(null)
const error = ref<string | null>(null)

watch(
  () => props.item,
  (val) => {
    if (val) {
      title.value = val.title
      amount.value = props.itemType === 'need' ? (val.amount ?? 0) : (val.price ?? 0)
      error.value = null
    }
  },
  { immediate: true },
)

function clearTitle(): void {
  title.value = ''
}

function handleSave(): void {
  if (!props.item) return
  error.value = null

  if (props.itemType === 'need') {
    const res = store.updateNeed(props.item.id, {
      title: title.value,
      amount: amount.value ?? 0,
    })
    if (!res.ok) {
      error.value = ERROR_MESSAGES[res.error] ?? 'Input tidak valid'
      return
    }
  } else {
    const res = store.updateWishlistItem(props.item.id, {
      title: title.value,
      price: amount.value ?? 0,
    })
    if (!res.ok) {
      error.value = ERROR_MESSAGES[res.error] ?? 'Input tidak valid'
      return
    }
  }

  open.value = false
  emit('saved')
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="bottom" class="mx-auto max-w-md rounded-t-2xl p-5">
      <SheetHeader>
        <SheetTitle class="text-base font-semibold">
          Edit {{ itemType === 'need' ? 'Kebutuhan' : 'Wishlist' }}
        </SheetTitle>
        <SheetDescription class="sr-only">
          Ubah nama atau nominal item
        </SheetDescription>
      </SheetHeader>

      <form class="mt-4 space-y-4" @submit.prevent="handleSave">
        <div class="space-y-1.5">
          <label for="edit-title" class="text-xs font-semibold text-muted-foreground uppercase">
            Nama item
          </label>
          <div class="relative">
            <Input
              id="edit-title"
              v-model="title"
              placeholder="Nama item"
              class="h-11 w-full pr-9 text-base md:text-sm"
              :aria-invalid="Boolean(error)"
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
        </div>

        <div class="space-y-1.5">
          <label for="edit-amount" class="text-xs font-semibold text-muted-foreground uppercase">
            Nominal
          </label>
          <RupiahInput
            id="edit-amount"
            v-model="amount"
            placeholder="0"
            :invalid="Boolean(error)"
            class="h-11 text-base md:text-sm"
          />
        </div>

        <p v-if="error" role="alert" class="text-xs font-medium text-danger-foreground">
          {{ error }}
        </p>

        <div class="pt-2">
          <Button type="submit" class="w-full h-11 font-semibold">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>
