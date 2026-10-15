import { computed, onMounted, ref, type Ref } from 'vue'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export const INSTALL_DISMISS_KEY = 'boleh-beli:install-dismissed'
export const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000

export function isDismissActive(now = Date.now()): boolean {
  try {
    const raw = localStorage.getItem(INSTALL_DISMISS_KEY)
    if (!raw) return false
    const timestamp = parseInt(raw, 10)
    if (Number.isNaN(timestamp)) return false
    return now - timestamp < DISMISS_DURATION_MS
  } catch {
    return false
  }
}

export function saveDismissTimestamp(now = Date.now()): void {
  try {
    localStorage.setItem(INSTALL_DISMISS_KEY, now.toString())
  } catch {
    // safe fallback on restricted storage
  }
}

export function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const media = window.matchMedia?.('(display-mode: standalone)')?.matches
  const navStandalone = (navigator as unknown as { standalone?: boolean }).standalone
  return Boolean(media || navStandalone)
}

export function checkIsIos(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream
}

function registerInstallListeners(
  deferred: Ref<BeforeInstallPromptEvent | null>,
  standalone: Ref<boolean>,
  onInstalled: () => void,
) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred.value = e as BeforeInstallPromptEvent
  })

  window.addEventListener('appinstalled', () => {
    deferred.value = null
    standalone.value = true
    onInstalled()
  })
}

export function useInstallPrompt() {
  const isStandalone = ref(checkIsStandalone())
  const isIosDevice = ref(checkIsIos())
  const isDismissed = ref(isDismissActive())
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

  const isIos = computed(() => isIosDevice.value && !isStandalone.value)
  const canInstall = computed(() => {
    if (isStandalone.value || isDismissed.value) return false
    return Boolean(deferredPrompt.value) || isIos.value
  })

  function dismiss() {
    isDismissed.value = true
    saveDismissTimestamp()
  }

  async function install(): Promise<boolean> {
    if (!deferredPrompt.value) return false
    try {
      await deferredPrompt.value.prompt()
      const choice = await deferredPrompt.value.userChoice
      deferredPrompt.value = null
      if (choice.outcome === 'accepted') {
        dismiss()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  onMounted(() => {
    isStandalone.value = checkIsStandalone()
    isDismissed.value = isDismissActive()
    registerInstallListeners(deferredPrompt, isStandalone, dismiss)
  })

  return { isStandalone, isIos, canInstall, install, dismiss }
}
