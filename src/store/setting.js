import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore(
  'setting',
  () => {
    const theme = ref('system')

    return {
      theme,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  }
)