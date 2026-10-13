<script setup lang="ts">
import NeedListItem from '@/features/needs/NeedListItem.vue'
import type { ExpenseItem } from '@/types/finance'

interface Props {
  items: ExpenseItem[]
}

defineProps<Props>()

const emits = defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <div class="space-y-2">
    <div v-if="items.length === 0" class="py-6 text-center text-sm text-muted-foreground">
      Belum ada kebutuhan wajib yang dicatat.
    </div>
    <ul v-else class="space-y-2">
      <NeedListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @remove="(id) => emits('remove', id)"
      />
    </ul>
  </div>
</template>
