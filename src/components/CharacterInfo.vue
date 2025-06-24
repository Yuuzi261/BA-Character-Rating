<template>
  <div class="character-info">
    <div class="character-avatar" @click="$emit('avatar-click')" title="點擊切換角色">
      <img :src="getAvatarUrl(id)" :alt="name" class="avatar-image" />
    </div>
    <div class="character-name">{{ name }}</div>
    <div v-if="nicknames && nicknames.length > 0" class="character-nicknames">
      {{ nicknames.join('、') }}
    </div>
    <div class="school-badge">
      <img v-if="school !== 'ETC'" :src="getSchoolIconUrl(school)" :alt="school" class="school-icon" />
      <span>{{ t(`school.${school}`) }}</span>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useI18n } from '@/composables/useI18n.js';
import { getAvatarUrl } from '@/utils/getAvatarUrl';
import { getSchoolIconUrl } from '@/utils/getSchoolIconUrl';

const { t } = useI18n();

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nicknames: {
    type: Array,
    default: () => []
  },
  school: {
    type: String,
    required: true
  }
});

defineEmits(['avatar-click']);

// 監聽 id 變化，更新 URL 參數
watch(() => props.id, (newId) => {
  const url = new URL(window.location);
  url.searchParams.set('id', newId);
  window.history.replaceState({}, '', url);
}, { immediate: true });
</script>

<style scoped>
.character-info {
  text-align: center;
  margin-bottom: 20px;
}

.character-avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #add8e6, #87ceeb);
  border-radius: 50%;
  margin: 0 auto 15px;
  border: 4px solid;
  border-color: #6495ed;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.character-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 174, 239, 0.7);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-name {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.character-nicknames {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.school-badge {
  background: linear-gradient(45deg, #4a6a8a, #34495e);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.school-icon {
  height: 20px;
  width: 20px;
  object-fit: contain;
}

.dark-mode .character-avatar {
  border-color: #4a90e2;
  box-shadow: 0 0 15px rgba(0, 174, 239, 0.5), 0 4px 15px rgba(0,0,0,0.2); /* Halo Glow */
}

.dark-mode .character-avatar:hover {
  box-shadow: 0 0 25px rgba(0, 174, 239, 0.9), 0 4px 15px rgba(0,0,0,0.2);
}

.dark-mode .character-name {
  color: #e0e6ed;
}

@media (max-width: 768px) {
  .character-avatar {
    width: 100px;
    height: 100px;
  }
}
</style>
