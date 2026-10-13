import { ref, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { todayISO } from '@/lib/date'

let sharedToday: Ref<string> | null = null
let listenerRegistered = false

export function useToday(): Ref<string> {
  if (!sharedToday) {
    sharedToday = ref(todayISO())
  }

  if (!listenerRegistered && typeof document !== 'undefined') {
    useEventListener(document, 'visibilitychange', () => {
      if (document.visibilityState === 'visible' && sharedToday) {
        sharedToday.value = todayISO()
      }
    })
    listenerRegistered = true
  }

  return sharedToday
}
