<template>
  <div class="character-info">
    <div class="character-avatar" id="tutorial-avatar-target" @click="$emit('avatar-click')">
      <ImageWithLoader :src="getAvatarUrl(id)" :alt="name" class="avatar-image" />
      <div class="avatar-overlay">
        <svg
          class="overlay-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M8 3L4 7l4 4" />
          <path d="M4 7h16" />
          <path d="M16 21l4-4-4-4" />
          <path d="M20 17H4" />
        </svg>
        <span class="overlay-text">{{ t('characterInfo.clickToSwitch') }}</span>
      </div>
    </div>
    <div class="character-name">{{ name }}</div>
    <div v-if="nicknames && nicknames.length > 0" class="character-nicknames">
      {{ nicknames.join('、') }}
    </div>
    <div class="school-badge">
      <img :src="getSchoolIconUrl(school)" :alt="school" class="school-icon" />
      <span>{{ t(`school.${school}`) }}</span>
    </div>
  </div>
</template>

<script setup>
  import { watch } from 'vue'
  import { useI18n } from '@/composables/useI18n.js'
  import { getAvatarUrl } from '@/utils/getAvatarUrl'
  import { getSchoolIconUrl } from '@/utils/getSchoolIconUrl'
  import ImageWithLoader from './ui/ImageWithLoader.vue'

  const { t } = useI18n()

  const props = defineProps({
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nicknames: {
      type: Array,
      default: () => [],
    },
    school: {
      type: String,
      required: true,
    },
  })

  defineEmits(['avatar-click'])

  // 監聽 id 變化，更新 URL 參數
  watch(
    () => props.id,
    (newId) => {
      const url = new URL(window.location)
      url.searchParams.set('id', newId)
      window.history.replaceState({}, '', url)
    },
    { immediate: true }
  )
</script>

<style scoped>
  .character-info {
    text-align: center;
    margin-bottom: 20px;
  }

  .character-avatar {
    position: relative;
    width: 120px;
    height: 120px;
    background: linear-gradient(45deg, #add8e6, #87ceeb);
    border-radius: 50%;
    margin: 0 auto 15px;
    border: 4px solid;
    border-color: #6495ed;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .character-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 174, 239, 0.7);
  }

  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(30, 40, 50, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none; /* Allow click events to penetrate the overlay and trigger the click of the avatar */
  }

  .character-avatar:hover .avatar-overlay {
    opacity: 1;
  }

  .overlay-icon {
    width: 32px;
    height: 32px;
    margin-bottom: 8px;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5));
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

  .overlay-text {
    font-weight: bold;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
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
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .school-icon {
    height: 20px;
    width: 20px;
    object-fit: contain;
  }

  .dark-mode .character-avatar {
    border-color: #4a90e2;
    box-shadow:
      0 0 15px rgba(0, 174, 239, 0.5),
      0 4px 15px rgba(0, 0, 0, 0.2); /* Halo Glow */
  }

  .dark-mode .character-avatar:hover {
    box-shadow:
      0 0 25px rgba(0, 174, 239, 0.9),
      0 4px 15px rgba(0, 0, 0, 0.2);
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
