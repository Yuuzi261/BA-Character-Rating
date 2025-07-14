<template>
  <div class="rating-section">
    <div class="title-container">
      <div class="rating-title">{{ title }}</div>
      <div class="title-extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="rating-details">
      <slot></slot>
      <!-- 預設 slot 用於插入內容 -->
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
  })
</script>

<style scoped>
  .rating-section {
    background: #ecf0f1;
    padding: 15px;
    border-radius: 10px;
  }

  .dark-mode .rating-section {
    background: #1f3048;
  }

  .rating-title {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: #2c3e50;
    position: relative;
    padding-left: 15px; /* Leave space for decorative moldings */
  }

  .dark-mode .rating-title {
    color: #e0e6ed;
  }

  /* Added UI decorative lines in the style of BA */
  .rating-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 20px;
    background-color: #6495ed;
    border-radius: 3px;
  }

  .dark-mode .rating-title::before {
    background-color: #00aeef;
  }

  .rating-details {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #34495e;
  }

  .dark-mode .rating-details {
    color: #c0c8d0;
  }

  .title-container {
    display: flex;
    align-items: center;
  }

  .title-extra {
    margin-bottom: 10px;
  }
</style>
