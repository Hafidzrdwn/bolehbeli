<script setup lang="ts">
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
</script>

<template>
  <header class="flex items-center justify-between py-2">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">
        BolehBeli?
      </h1>
      <p class="text-xs text-muted-foreground">
        Kalkulator keputusan belanja cerdas
      </p>
    </div>
    <div class="flex items-center gap-2">
      <ThemeToggle />
    </div>
  </header>
</template>
