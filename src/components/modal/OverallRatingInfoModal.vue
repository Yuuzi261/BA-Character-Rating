<script setup>
import { toRefs } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const { t } = useI18n()

const closeModal = () => {
  emit('close')
}

const { isVisible } = toRefs(props)
useModal(isVisible, closeModal)
</script>

<template>
  <teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">
              {{ t('overallRatingInfoModal.title') }}
            </h2>
            <button class="modal-close-button" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="rating-info-item">
              <span class="rating-info-score">SS ~ A (≥80)</span>
              <p class="rating-info-desc">
                {{ t('overallRatingInfoModal.ss_a') }}
              </p>
            </div>
            <div class="rating-info-item">
              <span class="rating-info-score">B (70 ~ 79)</span>
              <p class="rating-info-desc">
                {{ t('overallRatingInfoModal.b') }}
              </p>
            </div>
            <div class="rating-info-item">
              <span class="rating-info-score">C (60 ~ 69)</span>
              <p class="rating-info-desc">
                {{ t('overallRatingInfoModal.c') }}
              </p>
            </div>
            <div class="rating-info-item">
              <span class="rating-info-score">D ~ E (40 ~ 59)</span>
              <p class="rating-info-desc">
                {{ t('overallRatingInfoModal.d_e') }}
              </p>
            </div>
            <div class="rating-info-item">
              <span class="rating-info-score">F (20 ~ 39)</span>
              <p class="rating-info-desc">
                {{ t('overallRatingInfoModal.f') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped>
  .modal-overlay {
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
    padding: 25px;
    border-radius: 10px;
    width: 90%;
    max-width: 700px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    border-top: 5px solid #6495ed;
    animation: slide-down 0.3s ease-out;
    overflow: hidden;
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

  .dark-mode .modal-content {
    background: linear-gradient(145deg, #1f3048, #2a4060);
    border-color: #00aeef;
    color: #ecf0f1;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    margin-bottom: 15px;
    position: relative;
  }

  .modal-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #eee;
  }

  .modal-title {
    margin: 0;
    font-size: 1.5rem;
  }

  .dark-mode .modal-header::after {
    background-color: #4f6a8e;
  }

  .modal-close-button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #aaa;
    line-height: 1;
    transition: color 0.2s;
  }

  .dark-mode .modal-close-button {
    color: #7f8c8d;
  }

  .modal-close-button:hover {
    color: #333;
  }

  .dark-mode .modal-close-button:hover {
    color: #e0e6ed;
  }

  .modal-body {
    overflow-y: auto;
    font-size: 1rem;
  }

  .rating-info-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background-color: #f8f9fa;
  }

  .dark-mode .rating-info-item {
    background-color: #2a3d54;
    border-color: #4f6a8e;
  }

  .rating-info-score {
    font-weight: 600;
    color: #4a5568;
    margin-right: 1rem;
    min-width: 100px;
    text-align: center;
  }

  .dark-mode .rating-info-score {
    color: #e0e6ed;
  }

  .rating-info-desc {
    margin: 0;
    color: #2d3748;
    flex-grow: 1;
  }

  .dark-mode .rating-info-desc {
    color: #c0c8d0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }

  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      max-height: 90vh;
    }

    .modal-title {
      font-size: 1.2rem;
    }
  }
</style>
