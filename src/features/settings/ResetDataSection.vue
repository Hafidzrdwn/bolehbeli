<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useFinanceStore } from '@/stores/finance'

const emits = defineEmits<{
  (e: 'reset'): void
}>()

const store = useFinanceStore()
const isConfirming = ref(false)

function handleConfirm() {
  store.resetAll()
  isConfirming.value = false
  emits('reset')
}
</script>

<template>
  <div class="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
    <div class="space-y-0.5">
      <h4 class="text-sm font-semibold text-destructive">
        Zona Bahaya
      </h4>
      <p class="text-xs text-muted-foreground">
        Hapus seluruh saldo, catatan kebutuhan, wishlist, dan kembalikan pengaturan ke kondisi awal.
      </p>
    </div>

    <div v-if="!isConfirming">
      <Button
        variant="destructive"
        size="sm"
        class="w-full sm:w-auto"
        @click="isConfirming = true"
      >
        Hapus Semua Data
      </Button>
    </div>

    <div v-else class="space-y-3 pt-1">
      <div class="flex items-start gap-2 text-xs text-destructive">
        <AlertTriangle class="size-4 shrink-0 mt-0.5" />
        <p>Yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.</p>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          class="flex-1 sm:flex-none"
          @click="isConfirming = false"
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          size="sm"
          class="flex-1 sm:flex-none"
          @click="handleConfirm"
        >
          Ya, Hapus Semua
        </Button>
      </div>
    </div>
  </div>
</template>
