<template>
  <teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="header-title">
              <h2>{{ t('overallGradeModal.title') }}</h2>
            </div>
            <button class="close-button" @click="closeModal">×</button>
          </div>

          <div class="modal-body">
            <div class="modal-body-content">
              <div class="criteria-section grade-section">
                <div class="grade-description">
                  <p v-html="t('overallGradeModal.description')"></p>
                </div>

                <div class="grade-grid">
                  <div class="grade-item grade-ss-a">
                    <div class="grade-header">
                      <div class="grade-letter">SS ~ A</div>
                      <div class="grade-range">≥80</div>
                    </div>
                    <div class="grade-text">{{ t('overallGradeModal.ss_a') }}</div>
                  </div>

                  <div class="grade-item grade-b">
                    <div class="grade-header">
                      <div class="grade-letter">B</div>
                      <div class="grade-range">70 ~ 79</div>
                    </div>
                    <div class="grade-text">{{ t('overallGradeModal.b') }}</div>
                  </div>

                  <div class="grade-item grade-c">
                    <div class="grade-header">
                      <div class="grade-letter">C</div>
                      <div class="grade-range">60 ~ 69</div>
                    </div>
                    <div class="grade-text">{{ t('overallGradeModal.c') }}</div>
                  </div>

                  <div class="grade-item grade-d-e">
                    <div class="grade-header">
                      <div class="grade-letter">D ~ E</div>
                      <div class="grade-range">40 ~ 59</div>
                    </div>
                    <div class="grade-text">{{ t('overallGradeModal.d_e') }}</div>
                  </div>

                  <div class="grade-item grade-f">
                    <div class="grade-header">
                      <div class="grade-letter">F</div>
                      <div class="grade-range">20 ~ 39</div>
                    </div>
                    <div class="grade-text">{{ t('overallGradeModal.f') }}</div>
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
    max-width: 705px;
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
    scrollbar-width: thin;
    scrollbar-color: #bdc3c7 #fff;
  }

  .dark-mode .modal-body {
    scrollbar-color: #7f8c8d #1f3048;
  }

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

  .grade-description {
    margin-bottom: 20px;
  }

  .grade-description p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: #555;
  }

  .dark-mode .grade-description p {
    color: #bdc3c7;
  }

  .grade-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
  }

  .grade-item {
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background: #fafafa;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  /* 如果要有 hover 動畫那其他 Modal 的卡片也要跟上，為了統一性暫時註解 */
  /* .grade-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  } */

  .dark-mode .grade-item {
    background: #2a3d54;
    border-color: #4f6a8e;
  }

  /* .dark-mode .grade-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  } */

  .grade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .grade-range {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    color: white;
  }

  .grade-letter {
    font-size: 1.3rem;
    font-weight: bold;
  }

  .dark-mode .grade-letter {
    color: #e0e6ed;
  }

  .grade-text {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #666;
  }

  .dark-mode .grade-text {
    color: #bdc3c7;
  }

  .grade-item {
    --ss-a-color: #a87d51;
    --b-color: #7a5bbe;
    --c-color: #658dbf;
    --d-e-color: #8c939e;
    --f-color: #6c757d;
  }

  .grade-ss-a {
    border-left: 4px solid var(--ss-a-color);
  }

  .grade-ss-a .grade-letter,
  .dark-mode .grade-ss-a .grade-letter {
    color: var(--ss-a-color);
  }

  .grade-ss-a .grade-range {
    background-color: var(--ss-a-color);
  }

  .grade-b {
    border-left: 4px solid var(--b-color);
  }

  .grade-b .grade-letter,
  .dark-mode .grade-b .grade-letter {
    color: var(--b-color);
  }

  .grade-b .grade-range {
    background-color: var(--b-color);
  }

  .grade-c {
    border-left: 4px solid var(--c-color);
  }

  .grade-c .grade-letter,
  .dark-mode .grade-c .grade-letter {
    color: var(--c-color);
  }

  .grade-c .grade-range {
    background-color: var(--c-color);
  }

  .grade-d-e {
    border-left: 4px solid var(--d-e-color);
  }

  .grade-d-e .grade-letter,
  .dark-mode .grade-d-e .grade-letter {
    color: var(--d-e-color);
  }

  .grade-d-e .grade-range {
    background-color: var(--d-e-color);
  }

  .grade-f {
    border-left: 4px solid var(--f-color);
  }

  .grade-f .grade-letter,
  .dark-mode .grade-f .grade-letter {
    color: var(--f-color);
  }

  .grade-f .grade-range {
    background-color: var(--f-color);
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

    .grade-grid {
      grid-template-columns: 1fr;
    }

    .header-title h2 {
      font-size: 1.5rem;
    }
  }
</style>
