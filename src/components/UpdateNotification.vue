<template>
  <Teleport to="body">
    <div v-if="showNotification" class="update-notification">
      <div class="notification-content">
        <div class="notification-icon">🔄</div>
        <div class="notification-text">
          <h3>有新版本可用</h3>
          <p>發現新版本，請重新整理頁面以獲得最新功能</p>
        </div>
        <div class="notification-actions">
          <button @click="handleRefresh" :disabled="isRefreshing" class="refresh-btn">
            {{ isRefreshing ? '更新中...' : '立即更新' }}
          </button>
          <button @click="handleLater" class="later-btn">稍後</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePWAUpdate } from '@/composables/usePWAUpdate'

const { updateAvailable, isRefreshing, refreshApp } = usePWAUpdate()
const showNotification = ref(false)

// 監聽更新狀態
watch(updateAvailable, (newValue) => {
  if (newValue) {
    showNotification.value = true
  }
})

const handleRefresh = () => {
  refreshApp()
}

const handleLater = () => {
  showNotification.value = false
  // 10分鐘後再次提醒
  setTimeout(() => {
    if (updateAvailable.value) {
      showNotification.value = true
    }
  }, 10 * 60 * 1000)
}
</script>

<style scoped>
.update-notification {
  position: fixed;
  top: 20px;
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
  margin-top: 12px;
}

.refresh-btn, .later-btn {
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