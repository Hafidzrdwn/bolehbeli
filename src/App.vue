<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import DecisionHub from './features/decision/DecisionHub.vue'
import StickyDecisionBar from './features/decision/StickyDecisionBar.vue'
import NeedsSection from './features/needs/NeedsSection.vue'
import AppHeader from './features/overview/AppHeader.vue'
import BalanceCard from './features/overview/BalanceCard.vue'
import TargetDatePicker from './features/overview/TargetDatePicker.vue'
import WishlistSection from './features/wishlist/WishlistSection.vue'

const InstallBanner = defineAsyncComponent(
  () => import('./features/pwa/InstallBanner.vue'),
)
const UpdateToast = defineAsyncComponent(
  () => import('./features/pwa/UpdateToast.vue'),
)

const hubRef = ref<InstanceType<typeof DecisionHub> | null>(null)
const hubElement = computed(() => hubRef.value?.el ?? null)
</script>

<template>
  <div
    class="mx-auto min-h-dvh w-full max-w-xl space-y-6 px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
  >
    <AppHeader />

    <InstallBanner />

    <main class="space-y-6 pb-20">
      <BalanceCard />
      <TargetDatePicker />
      <NeedsSection />
      <WishlistSection />
      <DecisionHub ref="hubRef" />
    </main>

    <StickyDecisionBar :target="hubElement" />
    <UpdateToast />
  </div>
</template>
