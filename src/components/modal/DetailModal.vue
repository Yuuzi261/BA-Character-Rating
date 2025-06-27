<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-content" ref="modalContentRef" :class="color">
          <button class="close-button" @click="closeModal">&times;</button>
          <h3 class="modal-title">{{ title }}</h3>
          <div class="modal-body">
            <img v-if="imageUrl" :src="imageUrl" alt="Detail Image" class="modal-image">
            <p v-if="text" class="modal-text">{{ text }}</p>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, nextTick, toRefs } from 'vue';
import { useModal } from '@/composables/useModal.js';

const props = defineProps({
  modelValue: Boolean,
  title: String,
  imageUrl: String,
  text: String,
  position: {
    type: Object,
    default: null
  },
  color: {
    type: String,
    default: 'blue'
  }
});

const emit = defineEmits(['update:modelValue']);

const modalContentRef = ref(null);

const closeModal = () => {
  emit('update:modelValue', false);
};

const { modelValue } = toRefs(props);
useModal(modelValue, closeModal);

watch(() => props.modelValue, async (show) => {
  if (!show) return;

  // Wait for the element to be rendered in the DOM
  await nextTick();

  const modalEl = modalContentRef.value;
  if (!modalEl) return;

  // Hide the modal to prevent any flicker while we calculate its position.
  modalEl.style.visibility = 'hidden';

  // Position the modal and set the CSS variable for the animation.
  // Fallback to center if no position is provided.
  if (!props.position) {
    modalEl.style.top = '50%';
    modalEl.style.left = '50%';
    modalEl.style.setProperty('--modal-transform', 'translate(-50%, -50%)');
  } else {
    // --- Robust Positioning Logic ---
    const triggerRect = props.position;
    const modalRect = modalEl.getBoundingClientRect(); // Get REAL dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 10;

    // Vertical position: Flip to top if not enough space below
    let top = triggerRect.bottom + margin;
    if (top + modalRect.height > viewportHeight - margin) {
      top = triggerRect.top - modalRect.height - margin;
    }
    if (top < margin) {
      top = margin;
    }

    // Horizontal position: Keep it inside the viewport
    let left = triggerRect.left + triggerRect.width / 2;
    const halfWidth = modalRect.width / 2;
    if (left < halfWidth + margin) {
      left = halfWidth + margin;
    }
    if (left + halfWidth > viewportWidth - margin) {
      left = viewportWidth - halfWidth - margin;
    }

    modalEl.style.top = `${top}px`;
    modalEl.style.left = `${left}px`;
    modalEl.style.setProperty('--modal-transform', 'translateX(-50%)');
  }

  // Reveal the element in the next frame, ensuring it appears at the correct final position.
  requestAnimationFrame(() => {
    modalEl.style.visibility = 'visible';
  });
});

</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  min-width: 250px;
  max-width: 90vw;
  position: absolute;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  border-top: 5px solid;
  transform: var(--modal-transform);
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    transform: var(--modal-transform) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: var(--modal-transform) translateY(0);
    opacity: 1;
  }
}

.dark-mode .modal-content {
  background: #2c3e50;
  color: #e0e6ed;
}

/* Dynamic border colors matching EvaluationItem */
.modal-content.yellow { border-color: #ffd166; }
.modal-content.green { border-color: #06d6a0; }
.modal-content.blue { border-color: #118ab2; }
.modal-content.peach { border-color: #ef476f; }
.modal-content.pink { border-color: #ff89a1; }
.modal-content.darkgray { border-color: #6e7d8d; }

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #888;
  line-height: 1;
  transition: color 0.2s;
}

.dark-mode .close-button {
  color: #bbb;
}

.close-button:hover {
  color: #333;
}

.modal-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.modal-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  margin-bottom: 15px;
}

.modal-text {
  font-size: 1.2rem;
  margin: 0;
}

/* Transition for the backdrop */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>