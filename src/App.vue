<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import AppShell from './components/layout/AppShell.vue'
import SegmentedControl from './components/layout/SegmentedControl.vue'
import { useLayoutMode } from './composables/useLayoutMode'
import DecisionHub from './features/decision/DecisionHub.vue'
import NeedsSection from './features/needs/NeedsSection.vue'
import AppHeader from './features/overview/AppHeader.vue'
import BalanceHero from './features/overview/BalanceHero.vue'
import TargetDateChip from './features/overview/TargetDateChip.vue'
import WishlistSection from './features/wishlist/WishlistSection.vue'
import { useFinanceStore } from './stores/finance'

import StickyDecisionBar from './features/decision/StickyDecisionBar.vue'

const InstallBanner = defineAsyncComponent(
  () => import('./features/pwa/InstallBanner.vue'),
)
const UpdateToast = defineAsyncComponent(
  () => import('./features/pwa/UpdateToast.vue'),
)

const store = useFinanceStore()
const { layoutMode } = useLayoutMode()

const activeTab = ref<'needs' | 'wishlist'>('needs')
const tabOptions = computed(() => [
  { value: 'needs', label: 'Kebutuhan', count: store.state.needs.length },
  { value: 'wishlist', label: 'Wishlist', count: store.state.wishlist.length },
])

const hubRef = ref<InstanceType<typeof DecisionHub> | null>(null)
const hubElement = computed(() => hubRef.value?.el ?? null)
</script>

<template>
  <AppShell>
    <template #header>
      <div class="space-y-4">
        <AppHeader />
        <InstallBanner />
      </div>
    </template>

    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
      <BalanceHero class="md:flex-1" />
      <TargetDateChip class="md:shrink-0 md:pt-1" />
    </div>

    <SegmentedControl
      v-if="layoutMode === 'phone'"
      v-model="activeTab"
      :options="tabOptions"
    />

    <div class="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 md:items-start">
      <div
        v-show="layoutMode !== 'phone' || activeTab === 'needs'"
        class="lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
      >
        <NeedsSection />
      </div>

      <div
        v-show="layoutMode !== 'phone' || activeTab === 'wishlist'"
        class="lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
      >
        <WishlistSection />
      </div>
    </div>

    <template #aside>
      <DecisionHub ref="hubRef" class="lg:sticky lg:top-6" />
    </template>
  </AppShell>

  <StickyDecisionBar v-if="layoutMode !== 'desktop'" :target="hubElement" />
  <UpdateToast />
</template>
