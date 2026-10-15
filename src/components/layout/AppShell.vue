<template>
  <div
    class="mx-auto min-h-dvh w-full max-w-full md:max-w-3xl lg:max-w-[1200px] px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-8 flex flex-col gap-6"
  >
    <header v-if="$slots.header" class="w-full">
      <slot name="header" />
    </header>

    <div class="w-full flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8">
      <main class="w-full min-w-0 space-y-6">
        <slot />
      </main>

      <aside v-if="$slots.aside" class="w-full pt-4 lg:pt-0 lg:sticky lg:top-8">
        <slot name="aside" />
      </aside>
    </div>
  </div>
</template>
