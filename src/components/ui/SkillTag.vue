<template>
  <div class="skill-tag">
    <ColoredText :text="skill" :enabled="true" />
  </div>
</template>

<script setup>
  import ColoredText from './ColoredText.vue'

  defineProps({
    skill: {
      type: String,
      required: true,
    },
  })
</script>

<style scoped>
  .skill-tag {
    position: relative;
    display: inline-flex;
    align-items: center;
    background: linear-gradient(45deg, #87ceeb, #6495ed);
    color: white;
    padding: 5px 12px 5px 28px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 0.9rem;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .skill-tag::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
  }

  .dark-mode .skill-tag {
    background: linear-gradient(45deg, #2a7fff, #00aeef);
    border-color: rgba(0, 174, 239, 0.5);
  }
</style>
