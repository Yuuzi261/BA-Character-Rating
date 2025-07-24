import { ref, onMounted, onUnmounted } from 'vue'

export function usePWAUpdate() {
  const updateAvailable = ref(false)
  const isRefreshing = ref(false)
  const registration = ref(null)
  const showFallbackError = ref(false)
  const retryCount = ref(0)
  const maxRetries = 3

  // 資源載入錯誤處理
  const handleResourceError = (error) => {
    console.warn('Resource loading failed:', error)
    retryCount.value++

    if (retryCount.value < maxRetries) {
      // 重試載入
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      // 達到最大重試次數，顯示更新提示
      showFallbackError.value = true
      checkForUpdate()
    }
  }

  // 監聽資源載入錯誤
  const setupErrorHandling = () => {
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        handleResourceError(event)
      }
    })

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('Loading chunk')) {
        handleResourceError(event.reason)
      }
    })
  }

  const checkForUpdate = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        if (reg) {
          registration.value = reg

          // 監聽 service worker 更新
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // 有新版本可用
                    updateAvailable.value = true
                  } else {
                    // 首次安裝，重新載入
                    window.location.reload()
                  }
                }
              })
            }
          })

          // 檢查是否有等待中的 service worker
          if (reg.waiting) {
            updateAvailable.value = true
          }

          // 監聽 service worker 控制變更
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!isRefreshing.value) {
              window.location.reload()
            }
          })

          // 手動檢查更新
          await reg.update()
        }
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }
  }

  const refreshApp = async () => {
    if (!registration.value?.waiting) {
      // 如果沒有等待中的 SW，直接重新載入
      window.location.reload()
      return
    }

    isRefreshing.value = true
    showFallbackError.value = false

    try {
      // 清除所有快取
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }

      // 告訴等待中的 service worker 跳過等待
      registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })

      // 設定超時，如果5秒內沒有更新就強制重新載入
      setTimeout(() => {
        window.location.reload()
      }, 5000)
    } catch (error) {
      console.error('Error during app refresh:', error)
      window.location.reload()
    }
  }

  // 強制更新函數
  const forceRefresh = () => {
    // 清除所有快取並重新載入
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))).then(() => {
          window.location.reload()
        })
      })
    } else {
      window.location.reload()
    }
  }

  // 版本比較功能（改進錯誤處理）
  const checkVersionFromServer = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超時

      const response = await fetch('/version.json?' + Date.now(), {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const serverVersion = await response.json()
      const localVersion = localStorage.getItem('app-version')

      if (localVersion && serverVersion.version !== localVersion) {
        updateAvailable.value = true
      }

      localStorage.setItem('app-version', serverVersion.version)
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Version check timeout')
      } else {
        console.error('Failed to check version:', error)
      }
      // 網路錯誤時也可能需要更新
      if (showFallbackError.value) {
        updateAvailable.value = true
      }
    }
  }

  onMounted(() => {
    setupErrorHandling()
    checkForUpdate()
    checkVersionFromServer()

    // 定期檢查更新（每10分鐘）
    const interval = setInterval(
      () => {
        checkForUpdate()
        checkVersionFromServer()
      },
      10 * 60 * 1000
    )

    onUnmounted(() => {
      clearInterval(interval)
    })
  })

  return {
    updateAvailable,
    isRefreshing,
    showFallbackError,
    refreshApp,
    forceRefresh,
    checkForUpdate,
  }
}
