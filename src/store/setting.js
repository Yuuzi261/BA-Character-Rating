import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'setting',
  () => {
    const isDarkMode = ref(null)

    return {
      isDarkMode,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)