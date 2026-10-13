<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sun } from '@lucide/vue'
import { useAppTheme } from '@/composables/useAppTheme'
import { Button } from '@/components/ui/button'

const { isDark, toggle } = useAppTheme()

const label = computed(() =>
  isDark.value ? 'Beralih ke mode terang' : 'Beralih ke mode gelap',
)
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    :aria-label="label"
    class="text-foreground hover:bg-muted"
    @click="toggle"
  >
    <Sun
      v-if="isDark"
      class="size-5 transition-transform motion-safe:duration-200 motion-safe:rotate-0"
    />
    <Moon
      v-else
      class="size-5 transition-transform motion-safe:duration-200 motion-safe:rotate-0"
    />
  </Button>
</template>
