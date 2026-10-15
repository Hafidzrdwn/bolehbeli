import { ref } from 'vue'

export interface UndoEntry {
  id: string
  message: string
  action: () => void
}

const currentEntry = ref<UndoEntry | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let remainingMs = 5000
let startTime = 0
const isPaused = ref(false)

function clearTimer(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function startTimer(ms: number): void {
  clearTimer()
  startTime = Date.now()
  remainingMs = ms
  timer = setTimeout(() => {
    currentEntry.value = null
  }, ms)
}

function record(message: string, action: () => void): void {
  clearTimer()
  currentEntry.value = {
    id: Math.random().toString(36).slice(2),
    message,
    action,
  }
  isPaused.value = false
  startTimer(5000)
}

function pause(): void {
  if (!currentEntry.value || isPaused.value) return
  isPaused.value = true
  clearTimer()
  const elapsed = Date.now() - startTime
  remainingMs = Math.max(0, remainingMs - elapsed)
}

function resume(): void {
  if (!currentEntry.value || !isPaused.value) return
  isPaused.value = false
  startTimer(remainingMs)
}

function undo(): void {
  if (!currentEntry.value) return
  const entry = currentEntry.value
  currentEntry.value = null
  clearTimer()
  entry.action()
}

function dismiss(): void {
  currentEntry.value = null
  clearTimer()
}

export function useUndo() {
  return {
    currentEntry,
    isPaused,
    record,
    pause,
    resume,
    undo,
    dismiss,
  }
}
