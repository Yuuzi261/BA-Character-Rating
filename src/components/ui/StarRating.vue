<template>
  <div v-if="rating" class="star-rating">
    <template v-for="n in rating[0]" :key="'black-' + n">
      <span class="star black-star">{{ star ? '★' : '❤︎' }}</span>
    </template>
    <template v-for="n in rating[1]" :key="'blue-' + n">
      <span class="star blue-star">{{ star ? '★' : '❤︎' }}</span>
    </template>
    <template v-for="n in rating[2]" :key="'red-' + n">
      <span class="star red-star">{{ star ? '★' : '❤︎' }}</span>
    </template>
  </div>
  <div v-else>
    不適用
  </div>
</template>

<script setup>
defineProps({
  rating: {
    type: [Array, null],
    required: true
  },
  star: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.star-rating { display: inline-block; font-size: 1.2rem; }
.star { margin: 0 1px; }
.black-star { color: #2c3e50; }
.dark-mode .black-star {
  color: #b0c4de; /* LightSteelBlue, for better contrast */
}

.blue-star { color: #3498db; }
.red-star { color: #e74c3c; }
</style>
