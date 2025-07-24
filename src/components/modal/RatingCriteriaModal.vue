<template>
  <teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="header-title">
              <h2>{{ t('ratingCriteriaModal.title') }}</h2>
            </div>
            <button class="close-button" @click="closeModal">×</button>
          </div>

          <div class="modal-body">
            <div class="modal-body-content">
              <!-- 特殊星級 -->
              <div class="criteria-section star-rating-section">
                <div class="section-header">
                  <h3>{{ t('starRatingSpecial.title') }}</h3>
                  <div class="section-divider"></div>
                </div>

                <div class="star-explanation">
                  <div class="star-type blue-star">
                    <div class="star-icon">★</div>
                    <div class="star-desc">
                      <strong>{{ t('starRatingSpecial.blueTitle') }}</strong>
                      <span>{{ t('starRatingSpecial.blueDesc') }}</span>
                    </div>
                  </div>

                  <div class="star-type red-star">
                    <div class="star-icon">★</div>
                    <div class="star-desc">
                      <strong>{{ t('starRatingSpecial.redTitle') }}</strong>
                      <span>{{ t('starRatingSpecial.redDesc') }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 基本星級 -->
              <div class="criteria-section star-rating-section">
                <div class="section-header">
                  <h3>{{ t('starRatingBase.title') }}</h3>
                  <div class="section-divider"></div>
                </div>

                <div class="rating-grid">
                  <div v-for="star in starRatings" :key="star" class="rating-item">
                    <div class="rating-stars">{{ '★'.repeat(star) }}</div>
                    <div class="rating-text">{{ t(`starRatingBase.${star}`) }}</div>
                  </div>

                  <div class="rating-item">
                    <div class="rating-stars">★ / {{ t('common.notApplicable') }}</div>
                    <div class="rating-text">{{ t('starRatingBase.1') }}</div>
                  </div>
                </div>
              </div>

              <!-- 評分種類 -->
              <div class="criteria-section dimensions-section">
                <div class="section-header">
                  <h3>{{ t('ratingDimensions.title') }}</h3>
                  <div class="section-divider"></div>
                </div>

                <div class="dimensions-grid">
                  <div v-for="dim in dimensions" :key="dim" class="dimension-card">
                    <div class="dimension-header">
                      <h4>{{ t(`ratingDimensions.${dim}.title`) }}</h4>
                      <span class="weight-badge">{{ t(`ratingDimensions.${dim}.weight`) }}</span>
                    </div>
                    <p>{{ t(`ratingDimensions.${dim}.desc`) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

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

  const dimensions = [
    'newbie',
    'totalAssault',
    'grandAssault',
    'pvp',
    'limitBreakAssault',
    'jointFiringDrill',
    'eventChallenge',
  ]

  const starRatings = [5, 4, 3, 2]

  const closeModal = () => {
    emit('close')
  }

  const { isVisible } = toRefs(props)
  useModal(isVisible, closeModal)
</script>

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
    padding: 25px 0 0;
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
    padding: 0 25px 15px;
    /* margin-bottom: 15px; */
    position: relative;
  }

  .modal-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 25px;
    right: 25px;
    height: 1px;
    background-color: #eee;
  }

  .header-title h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .dark-mode .modal-header::after {
    background-color: #4f6a8e;
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

  .dark-mode .close-button {
    color: #7f8c8d;
  }

  .close-button:hover {
    color: #333;
  }

  .dark-mode .close-button:hover {
    color: #e0e6ed;
  }

  .modal-body {
    overflow-y: auto;
    font-size: 1rem;
    mask-image: linear-gradient(to bottom, transparent, black 15px);
    /* Custom Scrollbar for Firefox */
    scrollbar-width: thin;
    scrollbar-color: #bdc3c7 #fff;
  }

  .dark-mode .modal-body {
    scrollbar-color: #7f8c8d #1f3048;
  }

  /* Custom Scrollbar for Webkit browsers (Chrome, Safari, Edge) */
  .modal-body::-webkit-scrollbar {
    width: 12px;
  }

  .modal-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .modal-body::-webkit-scrollbar-thumb {
    background-color: #bdc3c7;
    border-radius: 10px;
    border: 3px solid #fff;
  }

  .dark-mode .modal-body::-webkit-scrollbar-thumb {
    background-color: #7f8c8d;
    border-color: #1f3048;
  }

  .modal-body::-webkit-scrollbar-thumb:hover {
    background-color: #a9a9a9;
  }

  .dark-mode .modal-body::-webkit-scrollbar-thumb:hover {
    background-color: #95a5a6;
  }

  .modal-body-content {
    padding: 15px 25px 0;
  }

  .criteria-section {
    margin-bottom: 25px;
  }

  .section-header {
    margin-bottom: 15px;
  }

  .section-header h3 {
    font-size: 1.2rem;
    margin: 0 0 8px 0;
    color: #2c3e50;
  }

  .dark-mode .section-header h3 {
    color: #e0e6ed;
  }

  .section-divider {
    height: 2px;
    background: #6495ed;
    border-radius: 1px;
    width: 40px;
  }

  .dark-mode .section-divider {
    background: #00aeef;
  }

  /* 星級評價樣式 */
  .star-explanation {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .star-type {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border-radius: 6px;
    flex: 1;
    min-width: 240px;
    border: 1px solid #ddd;
  }

  .blue-star {
    background: rgba(100, 149, 237, 0.08);
    border-color: rgba(100, 149, 237, 0.3);
  }

  .red-star {
    background: rgba(255, 99, 132, 0.08);
    border-color: rgba(255, 99, 132, 0.3);
  }

  .dark-mode .star-type {
    border-color: #4f6a8e;
  }

  .dark-mode .blue-star {
    background: rgba(0, 174, 239, 0.15);
    border-color: rgba(0, 174, 239, 0.3);
  }

  .dark-mode .red-star {
    background: rgba(255, 99, 132, 0.15);
    border-color: rgba(255, 99, 132, 0.3);
  }

  .star-icon {
    font-size: 1.4rem;
    font-weight: bold;
  }

  .blue-star .star-icon {
    color: #6495ed;
  }

  .red-star .star-icon {
    color: #ff6384;
  }

  .star-desc strong {
    display: block;
    margin-bottom: 4px;
    font-size: 0.95rem;
  }

  .star-desc span {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .rating-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 12px;
  }

  .rating-item {
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: #fafafa;
  }

  .dark-mode .rating-item {
    background: #2a3d54;
    border-color: #4f6a8e;
  }

  .rating-stars {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 6px;
    color: #6495ed;
  }

  .dark-mode .rating-stars {
    color: #00aeef;
  }

  .rating-text {
    font-size: 0.9rem;
    line-height: 1.3;
  }

  /* 評價維度樣式 */
  .dimensions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
  }

  .dimension-card {
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: #fafafa;
  }

  .dark-mode .dimension-card {
    background: #2a3d54;
    border-color: #4f6a8e;
  }

  .dimension-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .dimension-header h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .weight-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
    background: #6495ed;
  }

  .dark-mode .weight-badge {
    background: #00aeef;
  }

  .dimension-card p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.9;
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

    .star-explanation {
      flex-direction: column;
      gap: 12px;
    }

    .star-type {
      min-width: unset;
    }

    .rating-grid,
    .dimensions-grid {
      grid-template-columns: 1fr;
    }

    .header-title h2 {
      font-size: 1.5rem;
    }
  }
</style>
