<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <div v-if="!loadingError">
      <TutorialHint
        v-if="showTutorial"
        :hint-style="tutorialHintStyle"
        :is-ready="hintIsReady"
        @close="dismissTutorial"
      />
      <RatingCard
        v-if="currentCharacter"
        :character="currentCharacter"
        :theme="settingStore.theme"
        :locale="settingStore.locale"
        @open-selector="isSelectorVisible = true"
        @toggle-dark-mode="settingStore.toggleTheme"
      />
      <CharacterSelector
        :is-visible="isSelectorVisible"
        :characters="selectableCharacters"
        @select="handleCharacterSelect"
        @close="isSelectorVisible = false"
      />
      <BackToTopButton />
    </div>

    <!-- 載入錯誤提示 -->
    <div v-else class="loading-error">
      <h2>載入失敗</h2>
      <p>應用程式載入時發生錯誤，請嘗試重新整理頁面</p>
      <button class="retry-btn" @click="handleRetry">重新載入</button>
    </div>

    <UpdateNotification />
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, computed, onErrorCaptured, nextTick } from 'vue'
  import { runIPGeolocation } from '@/utils/ipGeolocation'
  import { fetchData } from '@/utils/fetchData'
  import { getAssetsFile } from '@/utils/getAssetsFile'
  import { loadFontCSS } from '@/utils/loadFontCSS'
  import { useSettingStore } from '@/store/setting'
  import { useTutorial } from '@/composables/useTutorial'
  import { storeToRefs } from 'pinia'
  import RatingCard from '@/components/RatingCard.vue'
  import CharacterSelector from '@/components/modal/CharacterSelector.vue'
  import BackToTopButton from '@/components/ui/BackToTopButton.vue'
  import UpdateNotification from '@/components/UpdateNotification.vue'
  import TutorialHint from '@/components/ui/TutorialHint.vue'
  import NProgress from 'nprogress'
  import '@/style/nprogress/nprogress.css'

  const settingStore = useSettingStore()
  const { isDarkMode } = storeToRefs(settingStore) // Maintaining responsiveness with storeToRefs
  const { showTutorial, dismissTutorial } = useTutorial()

  const allCharacters = ref([])
  const currentCharacter = ref(null)
  const isSelectorVisible = ref(false)
  const loadingError = ref(false)
  const tutorialHintStyle = ref({})
  const hintIsReady = ref(false)

  // Add a computed property to filter out roles with id=0 (easter egg character)
  const selectableCharacters = computed(() => {
    return allCharacters.value.filter((c) => c.id !== 0)
  })

  const handleCharacterSelect = (characterId) => {
    const selected = allCharacters.value.find((c) => c.id === characterId)
    if (selected) {
      currentCharacter.value = selected
    }
    isSelectorVisible.value = false
  }

  const getIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    return id ? parseInt(id) : null
  }

  const handleRetry = () => {
    loadingError.value = false
    window.location.reload()
  }

  const calculateHintPosition = async () => {
    if (!showTutorial.value) return

    await nextTick() // Wait for the DOM to update

    const target = document.getElementById('tutorial-avatar-target')
    if (target) {
      const rect = target.getBoundingClientRect()
      tutorialHintStyle.value = {
        top: `${rect.bottom + 10}px`, // Position below the avatar
        left: `${rect.left + rect.width / 2}px`, // Center horizontally
      }
      hintIsReady.value = true // Trigger the animation
    }
  }

  // Catching component errors
  onErrorCaptured((error) => {
    console.error('Component error:', error)
    loadingError.value = true
    return false
  })

  onMounted(async () => {
    NProgress.configure({ showSpinner: false })

    // Initialize the theme listener
    settingStore.initThemeListener()
    NProgress.start()

    try {
      // Wait for IP location to set locale
      await runIPGeolocation()

      // Load character data, using the locale in the Pinia store
      const data = await fetchData(settingStore.locale)
      allCharacters.value = data

      const urlId = getIdFromUrl()

      // If there is a valid id in the URL, use that role, otherwise use the first role
      if (urlId !== null && urlId !== undefined && allCharacters.value.some((c) => c.id === urlId)) {
        handleCharacterSelect(urlId)
      } else {
        // If the URL does not specify an ID, or the specified ID does not exist, the first "non-easter egg" character is selected
        const firstNonEasterEggCharacter = selectableCharacters.value.length > 0 ? selectableCharacters.value[0] : null
        if (firstNonEasterEggCharacter) {
          handleCharacterSelect(firstNonEasterEggCharacter.id)
        }
      }

      console.log('數據已載入並設定完成。')

      // Calculate hint position after data is loaded and character is set
      calculateHintPosition()

      // Load the font CSS
      const fonts = ['fonts/NEXONFootballGothic/result.css']
      await Promise.all(fonts.map((path) => loadFontCSS(getAssetsFile(path))))
    } catch (error) {
      console.error('載入資源失敗:', error)
      loadingError.value = true
    } finally {
      NProgress.done()
    }
  })

  watch(
    isDarkMode,
    (newValue) => {
      document.documentElement.classList.toggle('dark-mode', newValue)
    },
    { immediate: true }
  )
</script>

<style>
  /* Define CSS Variables for colors */
  :root {
    /* Light Mode Colors */
    --color-blue: #4a90e2;
    --color-green: #43a047;
    --color-teal: #0097a7;
    --color-red: #d32f2f;
    --color-purple: #8e24aa;
    --color-skill-tag-highlight: #ffe4b5;
    --text-color-default: #2c3e50;
    --background-color-default: #e0ffff;
    --background-default: linear-gradient(135deg, #e0ffff 0%, #add8e6 100%);
  }

  /* Dark Mode Overrides for CSS Variables */
  html.dark-mode {
    --color-blue: #81d4fa;
    --color-green: #81c784;
    --color-teal: #4dd0e1;
    --color-red: #ef5350;
    --color-purple: #ce93d8;
    --color-skill-tag-highlight: #ffd54f;
    --text-color-default: #e0e6ed;
    --background-color-default: #0f1928;
    --background-default: linear-gradient(135deg, #0f1928 0%, #1a2b40 100%);
  }

  html {
    background-color: var(--background-color-default);
    overflow-x: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  /* Global Style */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Microsoft YaHei', Arial, sans-serif;
    background: var(--background-default);
    color: var(--text-color-default);
    min-height: 100vh;
    padding: 10px;
    transition:
      background 0.3s ease,
      color 0.3s ease;
    overflow-x: hidden;
  }

  html.modal-open,
  body.modal-open {
    overflow-y: hidden;
  }

  /* Loading failure prompt style */
  .loading-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    text-align: center;
    padding: 20px;
  }

  .loading-error h2 {
    color: var(--color-red);
    margin-bottom: 16px;
  }

  .loading-error p {
    color: var(--text-color-default);
    margin-bottom: 24px;
    max-width: 400px;
  }

  .retry-btn {
    background: var(--color-blue);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
  }

  .retry-btn:hover {
    background: var(--color-teal);
  }
</style>
