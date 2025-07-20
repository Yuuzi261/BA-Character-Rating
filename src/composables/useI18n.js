import { ref, watch } from 'vue'
import { useSettingStore } from '@/store/setting'

const loadedMessages = ref({})
const currentLocale = ref('zh-tw') // Default locale

export function useI18n() {
  const settingStore = useSettingStore()

  const loadMessages = async (locale) => {
    try {
      const module = await import(`@/locales/${locale}.json`)
      loadedMessages.value = module.default
      currentLocale.value = locale
    } catch (error) {
      console.error(`Failed to load locale messages for ${locale}:`, error)
      // Fallback to default if loading fails
      const defaultModule = await import(`@/locales/zh-tw.json`)
      loadedMessages.value = defaultModule.default
      currentLocale.value = 'zh-tw'
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = loadedMessages.value
    for (const k of keys) {
      if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, k)) {
        value = value[k]
      } else {
        return key // Return the key if the translation is not found
      }
    }
    return value
  }

  // Watch for changes in the setting store's locale
  watch(
    () => settingStore.locale,
    (newLocale) => {
      if (newLocale) {
        loadMessages(newLocale)
      }
    }
  )

  // Initial load
  if (settingStore.locale) {
    loadMessages(settingStore.locale)
  } else {
    // If locale is not set, you might want to load a default
    loadMessages('zh-tw')
  }

  return { t, currentLocale: settingStore.locale } // Expose settingStore.locale for reactivity
}
