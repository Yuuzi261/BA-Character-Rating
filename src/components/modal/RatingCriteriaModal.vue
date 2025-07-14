<template>
  <teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ t('ratingCriteria') }}</h2>
            <button @click="closeModal" class="close-button">×</button>
          </div>
          <div class="modal-body">
            <div class="criteria-section">
              <h3>{{ t('starRating.title') }}</h3>
              <p>{{ t('starRating.blueStar') }}</p>
              <p>{{ t('starRating.redStar') }}</p>
              <ul>
                <li><strong>★5:</strong> {{ t('starRating.5') }}</li>
                <li><strong>★4:</strong> {{ t('starRating.4') }}</li>
                <li><strong>★3:</strong> {{ t('starRating.3') }}</li>
                <li><strong>★2:</strong> {{ t('starRating.2') }}</li>
                <li><strong>★1/{{ t('na') }}:</strong> {{ t('starRating.1') }}</li>
              </ul>
            </div>
            <div class="criteria-section">
              <h3>{{ t('ratingDimensions.title') }}</h3>
              <ul>
                <li>
                  <strong>{{ t('ratingDimensions.novice') }} (2.5%):</strong>
                  {{ t('ratingDimensions.noviceDesc') }}
                </li>
                <li>
                  <strong>{{ t('ratingDimensions.totalWarfare') }} (26.5%):</strong>
                  {{ t('ratingDimensions.totalWarfareDesc') }}
                </li>
                <li>
                  <strong>{{ t('ratingDimensions.grandAssault') }} (26.5%):</strong>
                  {{ t('ratingDimensions.grandAssaultDesc') }}
                </li>
                <li>
                  <strong>{{ t('ratingDimensions.tacticalChallenge') }} (21%):</strong>
                  {{ t('ratingDimensions.tacticalChallengeDesc') }}
                </li>
                <li>
                  <strong>{{ t('ratingDimensions.restrictedEngagement') }} (10.5%):</strong>
                  {{ t('ratingDimensions.restrictedEngagementDesc') }}
                </li>
                <li>
                  <strong>{{ t('ratingDimensions.jointPractice') }} (10.5%):</strong>
                  {{ t('ratingDimensions.jointPracticeDesc') }}
                </li>
                <li>
                  <strong>{{ t('ratingDimensions.eventChallenge') }} (2.5%):</strong>
                  {{ t('ratingDimensions.eventChallengeDesc') }}
                </li>
              </ul>
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
    padding: 25px;
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    border-top: 5px solid #6495ed;
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

  .dark-mode .modal-content {
    background: #1f3048;
    color: #ecf0f1;
    border-top-color: #00aeef;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }

  .dark-mode .modal-header {
    border-bottom: 1px solid #4f6a8e;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
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
  }

  .criteria-section {
    margin-bottom: 20px;
  }

  .criteria-section h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #2c3e50;
  }

  .dark-mode .criteria-section h3 {
    color: #e0e6ed;
  }

  .criteria-section p,
  .criteria-section ul {
    margin-left: 15px;
  }

  .criteria-section ul {
    padding-left: 20px;
  }

  .criteria-section li {
    margin-bottom: 8px;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
</style>
