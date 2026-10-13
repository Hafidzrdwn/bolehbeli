<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, daysRemaining } = storeToRefs(store)

const balance = computed({
  get: () => state.value.currentBalance,
  set: (val: number | null) => {
    store.setBalance(val ?? 0)
  },
})
</script>

<template>
  <SectionCard title="Saldo saat ini" description="Uang cair yang kamu miliki saat ini">
    <template #action>
      <Badge variant="outline" class="font-medium text-xs">
        Sisa {{ daysRemaining }} hari
      </Badge>
    </template>

    <div class="space-y-2">
      <Label for="balance-input" class="sr-only">Saldo saat ini</Label>
      <RupiahInput
        id="balance-input"
        v-model="balance"
        placeholder="0"
      />
    </div>
  </SectionCard>
</template>
