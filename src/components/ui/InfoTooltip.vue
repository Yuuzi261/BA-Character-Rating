<template>
  <div ref="wrapperRef" class="info-tooltip-wrapper" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <slot></slot>
    <teleport to="body">
      <transition name="tooltip-fade">
        <div v-if="showTooltip" ref="tooltipRef" class="tooltip-content" :style="tooltipStyle">
          {{ text }}
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
  import { ref, nextTick } from 'vue'

  defineProps({
    text: {
      type: String,
      default: '',
    },
  })

  const wrapperRef = ref(null)
  const tooltipRef = ref(null)
  const showTooltip = ref(false)
  const tooltipStyle = ref({})

  const updatePosition = () => {
    if (!wrapperRef.value || !tooltipRef.value) return

    const triggerRect = wrapperRef.value.getBoundingClientRect()
    const tooltipRect = tooltipRef.value.getBoundingClientRect()

    const top = triggerRect.top + window.scrollY - tooltipRect.height - 10 // 10px gap
    const left = triggerRect.left + window.scrollX + triggerRect.width / 2 - tooltipRect.width / 2

    tooltipStyle.value = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
    }
  }

  const onMouseEnter = async () => {
    showTooltip.value = true
    await nextTick()
    updatePosition() // Set initial position
    window.addEventListener('scroll', updatePosition, true)
  }

  const onMouseLeave = () => {
    showTooltip.value = false
    window.removeEventListener('scroll', updatePosition, true)
  }
</script>

<style scoped>
  .info-tooltip-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
</style>

<style>
  /* Global style for the teleported tooltip */
  .tooltip-content {
    position: absolute; /* Use absolute position relative to the document */
    background-color: #2c3e50;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.85rem;
    z-index: 9999; /* High z-index to be on top of everything */
    width: max-content;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    text-align: left;
    line-height: 1.5;
    pointer-events: none;
  }

  /* Arrow */
  .tooltip-content::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #2c3e50 transparent transparent transparent;
  }

  /* Dark Mode */
  .dark-mode .tooltip-content {
    background-color: #e0e6ed;
    color: #1a2b40;
    box-shadow: 0 4px 15px rgba(0, 174, 239, 0.2);
  }

  .dark-mode .tooltip-content::after {
    border-color: #e0e6ed transparent transparent transparent;
  }

  /* Transition classes */
  .tooltip-fade-enter-active,
  .tooltip-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .tooltip-fade-enter-from,
  .tooltip-fade-leave-to {
    opacity: 0;
  }
</style>

