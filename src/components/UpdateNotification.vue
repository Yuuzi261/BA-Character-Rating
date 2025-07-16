<template>
  <Teleport to="body">
    <div v-if="showNotification" class="update-notification" :class="{ 'error-mode': showFallbackError }">
      <div class="notification-content">
        <div class="notification-main">
          <div class="notification-icon">
            {{ showFallbackError ? '⚠️' : '🔄' }}
          </div>
          <div class="notification-text">
            <h3>{{ notificationTitle }}</h3>
            <p>{{ notificationMessage }}</p>
          </div>
        </div>
        <div class="notification-actions">
          <button :disabled="isRefreshing" class="refresh-btn" @click="handleRefresh">
            {{ refreshButtonText }}
          </button>
          <button v-if="!showFallbackError" class="later-btn" @click="handleLater">
            {{ t('updateNotification.laterButton') }}
          </button>
          <button v-if="showFallbackError" class="force-btn" @click="handleForceRefresh">
            {{ t('updateNotification.forceRefreshButton') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { ref, watch, computed } from 'vue'
  import { usePWAUpdate } from '@/composables/usePWAUpdate'
  import { useI18n } from '@/composables/useI18n'

  const { t } = useI18n()
  const { updateAvailable, isRefreshing, showFallbackError, refreshApp, forceRefresh } = usePWAUpdate()
  const showNotification = ref(false)
  const laterCount = ref(0)

  // 計算通知內容
  const notificationTitle = computed(() => {
    return showFallbackError.value ? t('updateNotification.loadErrorTitle') : t('updateNotification.newVersionTitle')
  })

  const notificationMessage = computed(() => {
    if (showFallbackError.value) {
      return t('updateNotification.loadErrorMessage')
    }
    return t('updateNotification.newVersionMessage')
  })

  const refreshButtonText = computed(() => {
    if (isRefreshing.value) return t('updateNotification.refreshingButton')
    if (showFallbackError.value) return t('updateNotification.fixButton')
    return t('updateNotification.updateButton')
  })

  // 監聽更新狀態
  watch([updateAvailable, showFallbackError], ([newUpdateAvailable, newFallbackError]) => {
    if (newUpdateAvailable || newFallbackError) {
      showNotification.value = true
    }
  })

  const handleRefresh = () => {
    refreshApp()
  }

  const handleForceRefresh = () => {
    forceRefresh()
  }

  const handleLater = () => {
    laterCount.value++
    showNotification.value = false

    // 每次點擊稍後，間隔時間逐漸增加
    const delay = Math.min(laterCount.value * 5, 30) * 60 * 1000 // 5分鐘到30分鐘

    setTimeout(() => {
      if (updateAvailable.value && !showFallbackError.value) {
        showNotification.value = true
      }
    }, delay)
  }
</script>

<style scoped>
  .update-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 20px;
    max-width: 350px;
    border-left: 4px solid #4a90e2;
    animation: slideIn 0.3s ease-out;
  }

  .update-notification.error-mode {
    border-left-color: #d32f2f;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .notification-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .notification-main {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .notification-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .notification-text {
    flex: 1;
  }

  .notification-text h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #2c3e50;
  }

  .notification-text p {
    margin: 0;
    font-size: 14px;
    color: #7f8c8d;
    line-height: 1.4;
  }

  .notification-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .refresh-btn,
  .later-btn,
  .force-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .refresh-btn {
    background: #4a90e2;
    color: white;
  }

  .refresh-btn:hover:not(:disabled) {
    background: #357abd;
  }

  .refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .later-btn {
    background: #ecf0f1;
    color: #7f8c8d;
  }

  .later-btn:hover {
    background: #d5dbdb;
  }

  .force-btn {
    background: #d32f2f;
    color: white;
  }

  .force-btn:hover {
    background: #b71c1c;
  }

  /* 暗色模式 */
  .dark-mode .update-notification {
    background: #2c3e50;
    color: #e0e6ed;
  }

  .dark-mode .notification-text h3 {
    color: #e0e6ed;
  }

  .dark-mode .later-btn {
    background: #34495e;
    color: #bdc3c7;
  }

  .dark-mode .later-btn:hover {
    background: #4a5f7a;
  }
</style>
