<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BufferSetting from './BufferSetting.vue'
import MinDailySetting from './MinDailySetting.vue'
import ResetDataSection from './ResetDataSection.vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-h-[90dvh] overflow-y-auto sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="text-lg font-bold">
          Pengaturan
        </DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground">
          Konfigurasi batasan kalkulasi belanja dan pengelolaan data.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-5 pt-2">
        <BufferSetting />
        <div class="h-px bg-border/60" role="separator" />
        <MinDailySetting />
        <div class="h-px bg-border/60" role="separator" />
        <ResetDataSection @reset="open = false" />
      </div>
    </DialogContent>
  </Dialog>
</template>
