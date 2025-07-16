import { ref, onMounted, onUnmounted } from 'vue'

export function usePWAUpdate() {
  const updateAvailable = ref(false)
  const isRefreshing = ref(false)
  const registration = ref(null)

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
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 有新版本可用
                  updateAvailable.value = true
                }
              })
            }
          })

          // 檢查是否有等待中的 service worker
          if (reg.waiting) {
            updateAvailable.value = true
          }

          // 手動檢查更新
          reg.update()
        }
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }
  }

  const refreshApp = async () => {
    if (!registration.value?.waiting) return
    
    isRefreshing.value = true
    
    // 告訴等待中的 service worker 跳過等待
    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    // 監聽 service worker 控制權變更
    const controllerChangeHandler = () => {
      // 重新載入頁面
      window.location.reload()
    }
    
    navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler)
    
    // 清理事件監聽器
    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler)
      isRefreshing.value = false
    }, 5000)
  }

  // 版本比較功能
  const checkVersionFromServer = async () => {
    try {
      // 從服務器獲取當前版本信息
      const response = await fetch('/version.json?' + Date.now(), {
        cache: 'no-store'
      })
      const serverVersion = await response.json()
      
      // 從 localStorage 獲取本地版本
      const localVersion = localStorage.getItem('app-version')
      
      if (localVersion && serverVersion.version !== localVersion) {
        updateAvailable.value = true
      }
      
      // 更新本地版本
      localStorage.setItem('app-version', serverVersion.version)
    } catch (error) {
      console.error('Failed to check version:', error)
    }
  }

  onMounted(() => {
    checkForUpdate()
    checkVersionFromServer()
    
    // 定期檢查更新（每5分鐘）
    const interval = setInterval(() => {
      checkForUpdate()
      checkVersionFromServer()
    }, 5 * 60 * 1000)
    
    onUnmounted(() => {
      clearInterval(interval)
    })
  })

  return {
    updateAvailable,
    isRefreshing,
    refreshApp,
    checkForUpdate
  }
}