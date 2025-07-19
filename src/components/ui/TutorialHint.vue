<template>
  <div class="tutorial-overlay" @click="dismiss">
    <div class="tutorial-hint" :style="hintStyle" :class="{ 'start-animation': isReady }" @click.stop>
      <div class="tutorial-content">
        <p>點擊角色頭像可以切換角色</p>
        <button @click="dismiss">我知道了</button>
      </div>
      <div class="tutorial-arrow"></div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    hintStyle: {
      type: Object,
      default: () => ({}),
    },
    isReady: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(['close'])

  const dismiss = () => {
    emit('close')
  }
</script>

<style scoped>
  .tutorial-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .tutorial-hint {
    position: absolute;
    background: #f8f9fa;
    color: #333;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
    max-width: 280px;
    text-align: center;
    opacity: 0; /* Initially hidden */
    transform: translateX(-50%); /* Center horizontally */
  }

  .tutorial-hint.start-animation {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .dark-mode .tutorial-hint {
    background: #1a2b40;
    color: #e0e6ed;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px); /* Animate from slightly above */
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .tutorial-content p {
    margin: 0 0 15px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
  }

  .tutorial-content button {
    background: linear-gradient(45deg, #87ceeb, #6495ed);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.3s ease;
    min-width: 100px;
  }

  .dark-mode .tutorial-content button {
    background: linear-gradient(45deg, #2a7fff, #00aeef);
  }

  .tutorial-content button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(100, 149, 237, 0.3);
  }

  .dark-mode .tutorial-content button:hover {
    box-shadow: 0 4px 15px rgba(0, 174, 239, 0.3);
  }

  .tutorial-arrow {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #f8f9fa;
  }

  .dark-mode .tutorial-arrow {
    border-bottom-color: #1a2b40;
  }
</style>
