<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="favorite-item-modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ character.name }}{{ t('favoriteItemModal.titleSuffix') }}</h3>
            <button @click="closeModal" class="close-button">&times;</button>
          </div>
          <div class="modal-body">
            <ImageWithLoader
              :src="getFavoriteItemImageUrl(character.id)"
              alt="Favorite Item"
              class="modal-item-icon"
              object-fit="contain"
            />
            <p class="item-name"><strong>{{ character.favoriteItem.name }}</strong></p>
            <div class="info-row">
              <strong>{{ t('favoriteItemModal.recommendedLevel') }}</strong>
              <StarRating :rating="character.favoriteItem.recommendedLevel" />
            </div>
            <div class="info-row materials">
              <strong>{{ t('favoriteItemModal.materialsUsed') }}</strong>
              <ul>
                <li>
                  <ImageWithLoader
                    :src="getGiftImageUrl(character.favoriteItem.materials[0])"
                    :alt="character.favoriteItem.materials[0]"
                    class="material-icon"
                    object-fit="contain"
                  />
                </li>
                <li>
                  <ImageWithLoader
                    :src="getOpartImageUrl(character.favoriteItem.materials[1])"
                    :alt="character.favoriteItem.materials[1]"
                    class="material-icon"
                    object-fit="contain"
                  />
                </li>
              </ul>
            </div>
            <div class="effects">
              <p><strong>{{ t('favoriteItemModal.t1Effect') }}</strong><ColoredText :text="character.favoriteItem.effects[0]" :enabled="enableColoredText" /></p>
              <p><strong>{{ t('favoriteItemModal.t2Effect') }}</strong><ColoredText :text="character.favoriteItem.effects[1]" :enabled="enableColoredText" /></p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { toRefs } from 'vue';
import { getAssetsFile } from '@/utils/getAssetsFile';
import { getOpartImageUrl } from '@/utils/getOpartImageUrl';
import { useI18n } from '@/composables/useI18n';
import ImageWithLoader from '../ui/ImageWithLoader.vue';
import StarRating from '../ui/StarRating.vue';
import { useSettingStore } from '@/store/setting';
import { storeToRefs } from 'pinia';
import ColoredText from '../ui/ColoredText.vue';
import { useModal } from '@/composables/useModal.js';

const { t } = useI18n();

const props = defineProps({
  character: { type: Object, required: true },
  isVisible: { type: Boolean, default: false }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const settingStore = useSettingStore();
const { enableColoredText } = storeToRefs(settingStore);

const { isVisible } = toRefs(props);
useModal(isVisible, closeModal);

const getGiftImageUrl = (favor) => {
  return getAssetsFile(`gift/favor_${favor}.webp`);
};

const getFavoriteItemImageUrl = (id) => {
  return getAssetsFile(`favorite_item/${id}.webp`);
};
</script>

<style scoped>
.favorite-item-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
  width: 90%;
  max-width: 500px;
  border-top: 5px solid #fb9eb1;
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #aaa;
  line-height: 1;
  transition: color 0.2s;
}
.close-button:hover {
  color: #333;
}

.modal-body {
  text-align: center;
}

.modal-item-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  border-radius: 50%;
  padding: 10px;
}

.item-name {
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.info-row.materials ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 10px;
}

.info-row.materials li {
  display: inline;
}

.material-icon {
  width: 40px;
  height: 40px;
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 4px;
}

.effects {
  margin-top: 20px;
  text-align: left;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.effects p {
  margin: 8px 0;
  line-height: 1.5;
}

/* Dark Mode */
.dark-mode .modal-content {
  background: #1f3048;
  color: #e0e6ed;
  border-top-color: #fd7591;
}
.dark-mode .modal-header {
  border-bottom-color: #2a4a6e;
}
.dark-mode .modal-header h3 {
  color: #e0e6ed;
}
.dark-mode .close-button {
  color: #7f8c8d;
}
.dark-mode .close-button:hover {
  color: #e0e6ed;
}
.dark-mode .modal-item-icon {
  background-color: #1a2b40;
}
.dark-mode .material-icon {
  background-color: #2a4a6e;
}
.dark-mode .effects {
  background-color: #1a2b40;
}

/* Transition */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>