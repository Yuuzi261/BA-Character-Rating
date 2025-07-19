<template>
  <div class="tutorial-overlay" @click="dismiss">
    <div class="tutorial-hint" :style="hintStyle" @click.stop>
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
    background-color: var(--color-blue);
    color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 220px;
    text-align: center;
    animation: fadeIn 0.3s ease-out;
  }

  .tutorial-content p {
    margin: 0 0 10px;
    font-size: 16px;
  }

  .tutorial-content button {
    background-color: white;
    color: var(--color-blue);
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
  }

  .tutorial-content button:hover {
    background-color: #f0f0f0;
  }

  .tutorial-arrow {
    position: absolute;
    top: -10px; /* Pointing upwards */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid var(--color-blue); /* Arrow points up */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px); /* Animate from slightly above */
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
