<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import AppShell from './components/layout/AppShell.vue'
import SegmentedControl from './components/layout/SegmentedControl.vue'
import { useLayoutMode } from './composables/useLayoutMode'
import DecisionDock from './features/decision/DecisionDock.vue'
import DecisionPanel from './features/decision/DecisionPanel.vue'
import NeedsSection from './features/needs/NeedsSection.vue'
import AppHeader from './features/overview/AppHeader.vue'
import BalanceHero from './features/overview/BalanceHero.vue'
import TargetDateChip from './features/overview/TargetDateChip.vue'
import WishlistSection from './features/wishlist/WishlistSection.vue'
import UndoSnackbar from './components/shared/UndoSnackbar.vue'
import { useFinanceStore } from './stores/finance'

const DecisionSheet = defineAsyncComponent(
  () => import('./features/decision/DecisionSheet.vue'),
)

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

const isSheetOpen = ref(false)

watch(layoutMode, (mode) => {
  if (mode === 'desktop') {
    isSheetOpen.value = false
  }
})
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
      <div v-show="layoutMode !== 'phone' || activeTab === 'needs'">
        <NeedsSection />
      </div>

      <div v-show="layoutMode !== 'phone' || activeTab === 'wishlist'">
        <WishlistSection />
      </div>
    </div>

    <template v-if="layoutMode === 'desktop'" #aside>
      <DecisionPanel class="lg:sticky lg:top-8" />
    </template>
  </AppShell>

  <template v-if="layoutMode !== 'desktop'">
    <DecisionDock @open="isSheetOpen = true" />
    <DecisionSheet v-model:open="isSheetOpen" />
  </template>

  <UndoSnackbar />
  <UpdateToast />
</template>
