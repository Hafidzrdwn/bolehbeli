import { useRegisterSW } from 'virtual:pwa-register/vue'

export function usePwaUpdate() {
  const { needRefresh, offlineReady, updateServiceWorker } = useRegisterSW({
    immediate: true,
  })

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}
