<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <div v-if="allCharacters.length > 0">
      <RatingCard 
        v-if="currentCharacter"
        :character="currentCharacter" 
        @open-selector="isSelectorVisible = true"
        :theme="settingStore.theme"
        :is-dark-mode="isDarkMode"
        @toggle-dark-mode="toggleDarkMode"
      />
      <CharacterSelector 
        :is-visible="isSelectorVisible"
        :characters="allCharacters"
        @select="handleCharacterSelect" 
        @close="isSelectorVisible = false" 
      />
    </div>
    <div v-else>
      <!-- TODO: 添加loading動畫 -->
      <p>正在載入角色數據...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { fetchData } from '@/utils/fetchData';
import { getAssetsFile } from '@/utils/getAssetsFile';
import { loadFontCSS } from '@/utils/loadFontCSS'
import { useSettingStore } from '@/store/setting';
import RatingCard from '@/components/RatingCard.vue';
import CharacterSelector from '@/components/modal/CharacterSelector.vue';
import NProgress from 'nprogress'
import '@/style/nprogress/nprogress.css'

const settingStore = useSettingStore();
const osPrefersDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

const isDarkMode = computed(() => {
  if (settingStore.theme === 'dark') return true;
  if (settingStore.theme === 'light') return false;
  return osPrefersDark.value; // 'system'
});

const language = ref('zh-tw');
const allCharacters = ref([]); 
const currentCharacter = ref(null);
const isSelectorVisible = ref(false);

const toggleDarkMode = () => {
  const themes = ['light', 'dark', 'system'];
  const currentTheme = settingStore.theme || 'system';
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  settingStore.theme = themes[nextIndex];
};

// 根據系統偏好設置主題
const initSystemTheme = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    osPrefersDark.value = e.matches;
  });
};

initSystemTheme();

const handleCharacterSelect = (characterId) => {
  const selected = allCharacters.value.find(c => c.id === characterId);
  if (selected) {
    currentCharacter.value = selected;
  }
  isSelectorVisible.value = false;
};

// 從 URL 獲取 id
const getIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return id ? parseInt(id) : null;
};

onMounted(async () => {
  NProgress.configure({ showSpinner: false });
  NProgress.start();

  try {
    // 載入角色數據
    const data = await fetchData(language.value);
    allCharacters.value = data;

    // 從 URL 讀取 id 並設置角色
    const urlId = getIdFromUrl();

    // 如果 URL 中有有效的 id，使用該角色，否則使用第一個角色
    if (urlId && allCharacters.value.some(c => c.id === urlId)) {
      handleCharacterSelect(urlId);
    } else if (allCharacters.value.length > 0) {
      handleCharacterSelect(allCharacters.value[0].id);
    }

    console.log('數據已載入並設定完成。');

    // 載入字體 CSS
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
