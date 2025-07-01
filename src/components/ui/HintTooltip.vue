<template>
  <div class="hint-tooltip-wrapper">
    <slot></slot>
    <div class="hint-tooltip-text">{{ text }}</div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.hint-tooltip-wrapper {
  position: relative; /* This is crucial for positioning the tooltip text */
  display: flex; /* Ensure the wrapper behaves like a flex container */
  align-items: center;
  justify-content: center;
}

.hint-tooltip-wrapper:hover .hint-tooltip-text {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(8px);
}

.hint-tooltip-text {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background-color: #2c3e50;
  color: white;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  z-index: 20;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
</style>

<style>
/* Non-scoped style for dark mode */
.dark-mode .hint-tooltip-text {
  background-color: #e0e6ed;
  color: #1a2b40;
}
</style>
