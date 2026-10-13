<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
</script>

<template>
  <main class="mx-auto min-h-dvh w-full max-w-xl space-y-6 px-4 py-6">
    <header>
      <h1 class="text-2xl font-bold tracking-tight">BolehBeli?</h1>
    </header>

    <Card>
      <CardHeader>
        <CardTitle>Kalkulator Keputusan Belanja</CardTitle>
        <CardDescription>Boleh beli atau tahan dulu?</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          Simulasi belanja cerdas untuk menjaga stabilitas finansial harian Anda.
        </p>
      </CardContent>
      <CardFooter class="flex gap-2">
        <Button variant="default">Tombol Primer</Button>
        <Button variant="outline">Tombol Outline</Button>
      </CardFooter>
    </Card>
  </main>
</template>
