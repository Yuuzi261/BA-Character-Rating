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
              // 修復：更新後重新載入到根路徑，避免查詢參數問題
              const currentUrl = new URL(window.location)
              if (currentUrl.search) {
                // 如果有查詢參數，先跳轉到根路徑再重新載入
                window.location.href = currentUrl.origin + currentUrl.pathname
              } else {
                window.location.reload()
              }
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
      // 修復：確保重新載入時處理查詢參數
      const currentUrl = new URL(window.location)
      if (currentUrl.search) {
        window.location.href = currentUrl.origin + currentUrl.pathname + currentUrl.search
      } else {
        window.location.reload()
      }
      return
    }

    isRefreshing.value = true
    showFallbackError.value = false

    try {
      // 修復：更謹慎的快取清理
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        // 只清理應用相關的快取，保留系統快取
        const appCaches = cacheNames.filter(
          (name) => name.includes('workbox') || name.includes('pages-cache') || name.includes('static-resources')
        )
        await Promise.all(appCaches.map((cacheName) => caches.delete(cacheName)))
      }

      // 告訴等待中的 service worker 跳過等待
      registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })

      // 修復：增加超時時間並改善重載邏輯
      setTimeout(() => {
        const currentUrl = new URL(window.location)
        // 重新載入當前頁面，包括查詢參數
        window.location.href = currentUrl.href
      }, 3000) // 增加到3秒
    } catch (error) {
      console.error('Error during app refresh:', error)
      // 修復：錯誤時也要處理查詢參數
      const currentUrl = new URL(window.location)
      window.location.href = currentUrl.href
    }
  }

  // 強制更新函數
  const forceRefresh = async () => {
    // 修復：更完整的快取清理和重載
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }

      // 清理 localStorage 中的版本信息
      localStorage.removeItem('app-version')

      // 取消註冊所有 service worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((reg) => reg.unregister()))
      }

      // 強制重新載入
      const currentUrl = new URL(window.location)
      window.location.href = currentUrl.href + (currentUrl.href.includes('?') ? '&' : '?') + '_refresh=' + Date.now()
    } catch (error) {
      console.error('Error during force refresh:', error)
      window.location.reload(true)
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
