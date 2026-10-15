<script setup lang="ts">
import { computed, useId } from 'vue'
import { Trash2 } from '@lucide/vue'
import ItemRow from '@/components/shared/ItemRow.vue'
import { Switch } from '@/components/ui/switch'
import { daysOfBudget } from '@/lib/finance/days-of-budget'
import { formatIDR } from '@/lib/money'
import type { WishlistItem } from '@/types/finance'

interface Props {
  item: WishlistItem
  baselineDailyBudget: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
  (e: 'edit', item: WishlistItem): void
}>()

const switchId = useId()
const days = computed(() => daysOfBudget(props.item.price, props.baselineDailyBudget))
const metaText = computed(() => (days.value !== null ? `≈ ${days.value} hari jatah` : undefined))

function handleLabelClick(event: MouseEvent): void {
  event.preventDefault()
  emit('toggle', props.item.id)
}
</script>

<template>
  <ItemRow
    :title="item.title"
    :meta="metaText"
    :amount="item.price"
    :selected="item.selected"
    :label-for="switchId"
    @label-click="handleLabelClick"
    @edit="emit('edit', item)"
  >
    <template #trailing>
      <Switch
        :id="switchId"
        :checked="item.selected"
        :aria-label="`Sertakan ${item.title} dalam simulasi, harga ${formatIDR(item.price)}`"
        class="shrink-0"
        @update:checked="emit('toggle', item.id)"
      />

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
