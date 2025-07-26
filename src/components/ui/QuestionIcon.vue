<template>
  <svg
    class="question-icon"
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
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
</template>

<style scoped>
  .question-icon {
    color: #6495ed;
    /* cursor: help; */
    transition: color 0.2s ease;
  }
  .question-icon:hover {
    color: #2a7fff;
  }
  .dark-mode .question-icon {
    color: #00aeef;
  }
  .dark-mode .question-icon:hover {
    color: #87ceeb;
  }
</style>
