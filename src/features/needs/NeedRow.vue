<script setup lang="ts">
import { computed } from 'vue'
import { Trash2 } from '@lucide/vue'
import ItemRow from '@/components/shared/ItemRow.vue'
import { CATEGORY_META } from '@/lib/finance/presets'
import type { ExpenseItem } from '@/types/finance'

interface Props {
  item: ExpenseItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
  (e: 'edit', item: ExpenseItem): void
}>()

const meta = computed(() => CATEGORY_META[props.item.category] ?? CATEGORY_META.other)
</script>

<template>
  <ItemRow
    :title="item.title"
    :meta="meta.label"
    :amount="item.amount"
    :icon="meta.icon"
    @edit="emit('edit', item)"
  >
    <template #trailing>
      <button
        type="button"
        :aria-label="`Hapus ${item.title}`"
        class="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        @click="emit('remove', item.id)"
      >
        <Trash2 class="size-4" aria-hidden="true" />
      </button>
    </template>
  </ItemRow>
</template>
