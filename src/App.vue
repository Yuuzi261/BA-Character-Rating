<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <RatingCard
      v-if="currentCharacter"
      :character="currentCharacter"
      @open-selector="isSelectorVisible = true"
      :theme="settingStore.theme"
      :locale="settingStore.locale"
      @toggle-dark-mode="settingStore.toggleTheme"
    />
    <CharacterSelector
      :is-visible="isSelectorVisible"
      :characters="selectableCharacters"
      @select="handleCharacterSelect"
      @close="isSelectorVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { runIPGeolocation } from '@/utils/ipGeolocation';
import { fetchData } from '@/utils/fetchData';
import { getAssetsFile } from '@/utils/getAssetsFile';
import { loadFontCSS } from '@/utils/loadFontCSS'
import { useSettingStore } from '@/store/setting';
import { storeToRefs } from 'pinia';
import RatingCard from '@/components/RatingCard.vue';
import CharacterSelector from '@/components/modal/CharacterSelector.vue';
import NProgress from 'nprogress'
import '@/style/nprogress/nprogress.css'

const settingStore = useSettingStore();
const { isDarkMode } = storeToRefs(settingStore); // Maintaining responsiveness with storeToRefs

const allCharacters = ref([]);
const currentCharacter = ref(null);
const isSelectorVisible = ref(false);

// Add a computed property to filter out roles with id=0 (easter egg character)
const selectableCharacters = computed(() => {
  return allCharacters.value.filter(c => c.id !== 0);
});

const handleCharacterSelect = (characterId) => {
  const selected = allCharacters.value.find(c => c.id === characterId);
  if (selected) {
    currentCharacter.value = selected;
  }
  isSelectorVisible.value = false;
};

const getIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? parseInt(id) : null;
};

onMounted(async () => {
  NProgress.configure({ showSpinner: false });

  // Initialize the theme listener
  settingStore.initThemeListener();
  NProgress.start();

  try {
    // Wait for IP location to set locale
    await runIPGeolocation();

    // Load character data, using the locale in the Pinia store
    const data = await fetchData(settingStore.locale);
    allCharacters.value = data;

    const urlId = getIdFromUrl();

    // If there is a valid id in the URL, use that role, otherwise use the first role
    if (urlId !== null && urlId !== undefined && allCharacters.value.some(c => c.id === urlId)) {
      handleCharacterSelect(urlId);
    } else {
      // If the URL does not specify an ID, or the specified ID does not exist, the first "non-easter egg" character is selected
      const firstNonEasterEggCharacter = selectableCharacters.value.length > 0 ? selectableCharacters.value[0] : null;
      if (firstNonEasterEggCharacter) {
        handleCharacterSelect(firstNonEasterEggCharacter.id);
      }
    }

    console.log('數據已載入並設定完成。');

    // Load the font CSS
    const fonts = [
      'fonts/NEXONFootballGothic/result.css',
    ];
    await Promise.all(
      fonts.map(path => loadFontCSS(getAssetsFile(path)))
    );
  } catch (error) {
    console.error('載入資源失敗:', error);
    alert('載入資源失敗，請檢查網路或稍後再試。');
  } finally {
    NProgress.done();
  }
});

watch(isDarkMode, (newValue) => {
  document.body.classList.toggle('dark-mode', newValue);
}, { immediate: true });
</script>

<style>
/* Global Style */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overscroll-behavior: none;
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background: linear-gradient(135deg, #e0ffff 0%, #add8e6 100%);
  color: #2c3e50; /* Light mode default text color */
  min-height: 100vh;
  padding: 10px;
  transition: background 0.3s ease, color 0.3s ease; /* Smooth transition */
}

body.dark-mode {
  background: linear-gradient(135deg, #0f1928 0%, #1a2b40 100%);
  color: #e0e6ed;
}

</style>