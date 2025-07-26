<template>
  <svg
    class="info-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
</template>

<style scoped>
  .info-icon {
    cursor: help;
    color: #6495ed;
    transition: color 0.2s ease;
  }
  .info-icon:hover {
    color: #2a7fff;
  }
  .dark-mode .info-icon {
    color: #00aeef;
  }
  .dark-mode .info-icon:hover {
    color: #87ceeb;
  }
</style>
