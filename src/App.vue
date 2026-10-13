<script setup lang="ts">
import { usePwaUpdate } from '@/composables/usePwaUpdate'
import NeedsSection from '@/features/needs/NeedsSection.vue'
import AppHeader from '@/features/overview/AppHeader.vue'
import BalanceCard from '@/features/overview/BalanceCard.vue'
import TargetDatePicker from '@/features/overview/TargetDatePicker.vue'

usePwaUpdate()
</script>

<template>
  <div class="mx-auto min-h-dvh w-full max-w-xl space-y-6 px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
    <AppHeader />

    <main class="space-y-6">
      <BalanceCard />
      <TargetDatePicker />
      <NeedsSection />
    </main>
  </div>
</template>
