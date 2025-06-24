<template>
  <div class="character-card">
    <div class="card-header">
      蔚藍檔案 角色評分
      <button @click="$emit('toggle-dark-mode')" class="theme-toggle-btn" :title="themeToggleTitle">
        <Transition name="icon-fade-slide" mode="out-in">
          <!-- Light Mode Icon -->
          <svg v-if="theme === 'light'" key="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Dark Mode Icon -->
          <svg v-else-if="theme === 'dark'" key="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <!-- System Mode Icon -->
          <svg v-else key="system-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 7 A5 5 0 0 0 12 17 Z" fill="currentColor" stroke="none"></path>
          </svg>
        </Transition>
      </button>
    </div>
    
    <div class="card-content">
      <div class="left-section">
        <CharacterInfo 
          :id="character.id"
          :name="character.fullname"
          :nicknames="character.nicknames"
          :school="character.school" 
          @avatar-click="$emit('open-selector')"
        />

        <div class="overall-rating-section">
          <div class="overall-score">
            <span 
              class="ani-num" 
              :style="`--num: ${character.ratings.overall};`"
              :class="{'is-animating': triggerAnimation}"
              :key="character.id"
            ></span>
          </div>
          <div class="overall-grade">{{ overallGrade }}</div>
        </div>

        <CharacterAttributes 
          :attack-type="character.attackType" 
          :defense-type="character.defenseType" 
          :weapon="character.weapon" 
          :position="character.position" 
          :unique-weapon-recommended="character.uniqueWeaponRecommended" 
          :acquisition-method="character.acquisitionMethod" 
        />

        <FavoriteItemSection 
          v-if="character.favoriteItem" 
          :character="character" 
          @open-modal="isFavoriteItemVisible = true" 
        />
      </div>

      <div class="right-section">
        <EvaluationGrid :character-data="character" />
        
        <RatingSection title="星級評價">
          <div v-for="category in ratingCategories" :key="category.key" class="rating-row">
            <strong>{{ category.label }}</strong>
            <StarRating :rating="character.ratings[category.key]" />
            <InfoTooltip v-if="character.ratingsSummary[category.key]" :text="character.ratingsSummary[category.key]">
              <InfoIcon />
            </InfoTooltip>
          </div>
        </RatingSection>

        <RatingSection title="技能簡述">
          <div v-if="character.skillsSummary" class="skills-summary">
            <p><span class="highlight">EX技能</span>{{ character.skillsSummary.ex }}</p>
            <p><span class="highlight">NS技能</span>{{ character.skillsSummary.ns }}</p>
            <p><span class="highlight">SS技能</span>{{ character.skillsSummary.ss }}</p>
          </div>
        </RatingSection>

        <RatingSection title="專武推薦度">
          <p>{{ character.uniqueWeaponRecommendedSummary }}</p>
        </RatingSection>

        <RatingSection title="綜合泛用推薦">
          <p>{{ character.overallRecommendation }}</p>
        </RatingSection>

        <RatingSection title="技能推薦順序">
          <div class="skill-order-container">
            <template v-for="(skill, index) in character.skillOrder" :key="skill">
              <SkillTag :skill="skill" />
              <span v-if="index < character.skillOrder.length - 1" class="separator-arrow">›</span>
            </template>
          </div>
        </RatingSection>
      </div>
    </div>
  </div>
  <FavoriteItemModal 
    v-if="character.favoriteItem"
    :character="character"
    :is-visible="isFavoriteItemVisible"
    @close="isFavoriteItemVisible = false"
  />
</template>

<script setup>
import { computed, watch, ref, nextTick } from 'vue';
import CharacterInfo from './CharacterInfo.vue';
import CharacterAttributes from './CharacterAttributes.vue';
import EvaluationGrid from './EvaluationGrid.vue';
import RatingSection from './ui/RatingSection.vue';
import SkillTag from './ui/SkillTag.vue';
import StarRating from './ui/StarRating.vue';
import InfoTooltip from './ui/InfoTooltip.vue';
import InfoIcon from './ui/InfoIcon.vue';
import FavoriteItemSection from './FavoriteItemSection.vue';
import FavoriteItemModal from './modal/FavoriteItemModal.vue';

const props = defineProps({
  character: { type: Object, required: true }, 
  theme: { type: String, default: 'system' }
});
defineEmits(['open-selector', 'toggle-dark-mode']);

const themeToggleTitle = computed(() => {
  switch (props.theme) {
    case 'light': return '切換至暗黑模式';
    case 'dark': return '切換至跟隨系統';
    case 'system':
    default: return '切換至明亮模式';
  }
});

const ratingCategories = [
  { key: 'newbie', label: '新手期：' },
  { key: 'totalAssault', label: '總力戰：' },
  { key: 'pvp', label: '戰術對抗戰：' },
  { key: 'grandAssault', label: '大決戰：' },
  { key: 'limitBreakAssault', label: '制約解除作戰：' },
  { key: 'jointFiringDrill', label: '演習考試：' },
  { key: 'eventChallenge', label: '活動高難：' }
];

const overallGrade = computed(() => {
  const score = props.character.ratings.overall;
  if (score > 100) return "SS";
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  if (score >= 40) return "E";
  if (score >= 20) return "F";
  return "N/A";
});

const isFavoriteItemVisible = ref(false);

// Add a responsive variable to control the animation trigger
const triggerAnimation = ref(true);

// Monitor changes in overall rating and trigger animation
watch(() => props.character.ratings.overall, async (newVal, oldVal) => {
  if (typeof newVal === 'number' && newVal !== oldVal) {
    triggerAnimation.value = false;
    await nextTick();
    triggerAnimation.value = true;
  }
}, { immediate: true }); 
</script>

<style scoped>
@property --seed {
  syntax: "<integer>";
  inherits: true;
  initial-value: 0;
}

@keyframes seed {
  from { --seed: 0; }
  to { --seed: 100; }
}

.character-card {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  overflow: hidden;
  position: relative;
}

.card-header {
  background: linear-gradient(45deg, #87CEEB, #6495ED);
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.card-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0;
}

.theme-toggle-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.icon-fade-slide-enter-active,
.icon-fade-slide-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.icon-fade-slide-enter-from {
  opacity: 0;
  transform: rotateY(90deg);
}

.icon-fade-slide-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
}

.icon-fade-slide-enter-to {
  opacity: 1;
  transform: rotateY(0deg);
}

.icon-fade-slide-leave-from {
  opacity: 1;
  transform: rotateY(0deg);
}

.theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.left-section {
  background: rgba(248, 249, 250, 0.7);
  padding: 20px;
  border-right: 3px solid #dee2e6;
  position: relative;
}

.right-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overall-rating-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.overall-score {
  font-size: 3rem;
  font-weight: bold;
  color: #e74c3c;
}

.ani-num::before {
  counter-reset: num calc(var(--seed) * var(--num) / 100);
  content: counter(num);
  animation: seed .5s ease-out forwards;
}

.overall-grade {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #87CEEB, #6495ED); /* BA Style Gradient */
  padding: 5px 15px;
  border-radius: 10px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.rating-row {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.skills-summary p {
  margin-bottom: 8px;
}

.skills-summary p:last-child {
  margin-bottom: 0;
}

.skill-order-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.separator-arrow {
  font-size: 1.5rem;
  color: #bdc3c7;
  font-weight: bold;
  line-height: 1;
}

.dark-mode .separator-arrow {
  color: #5a6e8a;
}

/* Dark Mode Overrides for RatingCard */
.dark-mode .character-card {
  background: rgba(26, 43, 64, 0.85); /* BA Dark Blue, semi-transparent */
  backdrop-filter: blur(10px);
  /* Use box-shadow to create a border effect without affecting layout, preventing layout shifts */
  box-shadow: 0 0 0 1px rgba(0, 174, 239, 0.3), 0 10px 30px rgba(0, 0, 0, 0.5);
}

.dark-mode .card-header {
  background: linear-gradient(45deg, #2a7fff, #00aeef); /* BA Blue Gradient */
}

.dark-mode .left-section {
  background: rgba(15, 25, 40, 0.7);
  border-right-color: #2a4a6e;
}

.dark-mode .character-name,
.dark-mode .character-nicknames,
.dark-mode .overall-score {
  color: #e0e6ed;
}

.dark-mode .school-badge {
  background: linear-gradient(45deg, #2a7fff, #00aeef);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.dark-mode .overall-grade {
  background: linear-gradient(45deg, #2a7fff, #00aeef);
}

/* General text color for dark mode within the card */
.dark-mode .right-section {
  color: #e0e6ed;
}

.dark-mode .rating-row strong {
  color: #c0c8d0; /* Slightly lighter for strong text */
}

.dark-mode p {
  color: #c0c8d0;
}



/* Style highlighting, because it is used in RatingSection and SkillsSection, so put it here */
.highlight {
  background: rgba(135, 206, 235, 0.3); /* Translucent light blue in BA style */
  margin-right: 0.25em;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  color: #005a9c; /* The dark blue text increases readability */
}

.dark-mode .highlight {
  background: rgba(0, 174, 239, 0.2);
  color: #87ceeb;
}

@media (max-width: 768px) {
  .card-content {
    grid-template-columns: 1fr;
  }
  
  .left-section {
    border-right: none;
    border-bottom: 3px solid #dee2e6;
  }

  .dark-mode .left-section {
    border-bottom-color: #2a4a6e;
  }
  
  .card-header {
    font-size: 1.2rem;
    padding: 12px;
  }
}
</style>