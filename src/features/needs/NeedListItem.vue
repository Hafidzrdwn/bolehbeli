<script setup lang="ts">
import { computed } from 'vue'
import { Trash2 } from '@lucide/vue'
import MoneyText from '@/components/shared/MoneyText.vue'
import { Button } from '@/components/ui/button'
import { CATEGORY_META } from '@/lib/finance/presets'
import type { ExpenseItem } from '@/types/finance'

interface Props {
  item: ExpenseItem
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'remove', id: string): void
}>()

const meta = computed(() => CATEGORY_META[props.item.category] ?? CATEGORY_META.other)
</script>

<template>
  <li
    class="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/50 p-3 transition-colors hover:bg-muted/40"
  >
    <div class="flex items-center gap-3 min-w-0">
      <div
        class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
      >
        <component :is="meta.icon" class="size-4" aria-hidden="true" />
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-medium text-foreground">
          {{ item.title }}
        </p>
        <p class="text-xs text-muted-foreground">
          {{ meta.label }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <MoneyText :value="item.amount" class="text-sm font-semibold" />
      <Button
        variant="ghost"
        size="icon"
        :aria-label="`Hapus ${item.title}`"
        class="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        @click="emits('remove', item.id)"
      >
        <Trash2 class="size-4" />
      </Button>
    </div>
  </li>
</template>
