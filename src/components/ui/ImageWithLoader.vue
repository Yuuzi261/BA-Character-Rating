<template>
  <div class="image-loader-wrapper">
    <div v-if="isLoading" class="placeholder"></div>
    <img :src="src" :alt="alt" :style="{ objectFit: objectFit }" @load="onLoad" @error="onError" :loading="lazy ? 'lazy' : 'eager'" />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'

  const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    objectFit: { type: String, default: 'cover' }, // 'cover', 'contain', 'fill', etc.
    lazy: { type: Boolean, default: true }, // Whether to use lazy loading for the image
  })

  const isLoading = ref(true)

  const onLoad = () => {
    isLoading.value = false
  }

  const onError = () => {
    isLoading.value = false // Stop displaying the loading animation and let the browser display the default image error icon
  }

  // Watch for changes in the src prop and reset isLoading to true
  watch(
    () => props.src,
    (newSrc, oldSrc) => {
      if (newSrc !== oldSrc) {
        isLoading.value = true // Re-enable loading state
      }
    }
  )
</script>

<style scoped>
  .image-loader-wrapper {
    position: relative;
    overflow: hidden; /* Make sure the placeholder animation does not extend beyond the borders (e.g. rounded corners) */
    display: inline-block;
    vertical-align: middle;
    background-color: inherit; /* Inherit the background color of the parent layer */
  }

  .image-loader-wrapper img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e9ecef;
    background: linear-gradient(
        100deg,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 60%
      )
      #e9ecef;
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1.5s loading-skeleton ease-in-out infinite;
  }

  .dark-mode .placeholder {
    background-color: #2a4a6e;
    background: linear-gradient(
        100deg,
        rgba(74, 144, 226, 0) 40%,
        rgba(74, 144, 226, 0.15) 50%,
        rgba(74, 144, 226, 0) 60%
      )
      #2a4a6e;
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1.5s loading-skeleton ease-in-out infinite;
  }

  @keyframes loading-skeleton {
    to {
      background-position-x: -20%;
    }
  }
</style>
