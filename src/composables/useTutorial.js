import { computed } from 'vue'
import { useSettingStore } from '@/store/setting'

export function useTutorial() {
  const settingStore = useSettingStore()

  const showTutorial = computed(() => !settingStore.tutorialShown)

  const dismissTutorial = () => {
    settingStore.markTutorialAsShown()
  }

  return {
    showTutorial,
    dismissTutorial,
  }
}
