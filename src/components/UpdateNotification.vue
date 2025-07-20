<template>
  <Teleport to="body">
    <div v-if="isUpdating" class="update-notification" :class="{ 'error-mode': isError }">
      <div class="notification-content">
        <div class="notification-icon">
          {{ isError ? '⚠️' : '🔄' }}
        </div>
        <div class="notification-text">
          <h3>{{ notificationTitle }}</h3>
          <p>{{ notificationMessage }}</p>
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
  const { updateAvailable, refreshApp, showFallbackError, forceRefresh } = usePWAUpdate()

  const isUpdating = ref(false)
  const isError = ref(false)

  const notificationTitle = computed(() => {
    return isError.value ? t('updateNotification.loadErrorTitle') : t('updateNotification.newVersionTitle')
  })

  const notificationMessage = computed(() => {
    // Re-use existing i18n key for the "updating" message
    return isError.value ? t('updateNotification.loadErrorMessage') : t('updateNotification.refreshingButton')
  })

  // Watch for update availability or fallback errors
  watch(
    [updateAvailable, showFallbackError],
    ([newUpdateAvailable, newFallbackError]) => {
      if (newUpdateAvailable || newFallbackError) {
        isUpdating.value = true
        isError.value = newFallbackError

        // Automatically trigger the update process.
        // A short delay allows the user to see the message before the page reloads.
        setTimeout(() => {
          if (newFallbackError) {
            forceRefresh()
          } else {
            refreshApp()
          }
        }, 500) // 0.5 second delay
      }
    },
    { immediate: true }
  )
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
    align-items: center;
    gap: 16px;
  }

  .notification-icon {
    font-size: 24px;
    flex-shrink: 0;
    animation: spin 1.5s linear infinite;
  }

  .update-notification.error-mode .notification-icon {
    animation: none;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .notification-text h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #2c3e50;
  }

  .notification-text p {
    margin: 0;
    font-size: 14px;
    color: #7f8c8d;
  }

  /* Dark Mode */
  .dark-mode .update-notification {
    background: #2c3e50;
    color: #e0e6ed;
  }

  .dark-mode .notification-text h3 {
    color: #e0e6ed;
  }

  .dark-mode .notification-text p {
    color: #bdc3c7;
  }
</style>
