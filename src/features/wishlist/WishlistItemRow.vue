<script setup lang="ts">
import { computed } from 'vue'
import { Trash2 } from '@lucide/vue'
import MoneyText from '@/components/shared/MoneyText.vue'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { daysOfBudget } from '@/lib/finance/days-of-budget'
import { formatIDR } from '@/lib/money'
import type { WishlistItem } from '@/types/finance'

interface Props {
  item: WishlistItem
  baselineDailyBudget: number
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
}>()

const days = computed(() => daysOfBudget(props.item.price, props.baselineDailyBudget))

const switchAriaLabel = computed(
  () => `Sertakan ${props.item.title} dalam simulasi, harga ${formatIDR(props.item.price)}`,
)

const inputId = computed(() => `wishlist-switch-${props.item.id}`)
</script>

<template>
  <li
    class="flex min-h-11 items-center justify-between gap-3 rounded-lg border p-3 transition-colors"
    :class="
      item.selected
        ? 'border-primary/50 bg-accent text-accent-foreground'
        : 'border-border/60 bg-background/50 hover:bg-muted/40'
    "
  >
    <label
      :for="inputId"
      class="flex min-h-11 flex-1 cursor-pointer select-none items-center gap-3 min-w-0"
    >
      <Switch
        :id="inputId"
        :checked="item.selected"
        :aria-label="switchAriaLabel"
        class="shrink-0"
        @click.stop
        @update:checked="emits('toggle', item.id)"
      />

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-foreground" :title="item.title">
          {{ item.title }}
        </p>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <MoneyText :value="item.price" class="font-medium text-foreground/80" />
          <span v-if="days !== null" class="text-xs text-muted-foreground">
            ≈ {{ days }} hari jatah
          </span>
        </div>
      </div>
    </label>

    <Button
      variant="ghost"
      size="icon"
      :aria-label="`Hapus ${item.title}`"
      class="size-11 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      @click="emits('remove', item.id)"
    >
      <Trash2 class="size-4" aria-hidden="true" />
    </Button>
  </li>
</template>
