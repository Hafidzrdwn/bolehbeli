<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import DecisionPanel from './DecisionPanel.vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      side="bottom"
      class="mx-auto max-w-xl rounded-t-2xl p-0 overflow-hidden"
    >
      <SheetHeader class="sr-only">
        <SheetTitle>Hasil Analisis Keputusan</SheetTitle>
        <SheetDescription>Ringkasan jatah harian dan simulasi belanja Anda</SheetDescription>
      </SheetHeader>

      <div class="max-h-[85vh] overflow-y-auto p-4 sm:p-5">
        <DecisionPanel />
      </div>
    </SheetContent>
  </Sheet>
</template>
