<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click.self="close">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ t('characterSelector.title') }}</h3>
            <button class="close-button" @click="close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="search-and-reset">
              <input type="text" v-model="searchTerm" :placeholder="t('characterSelector.searchPlaceholder')" class="search-input">
              <div class="action-buttons">
                <button @click="resetFilters" class="reset-button">{{ t('characterSelector.resetFilters') }}</button>
                <button @click="toggleFilterPanel" class="filter-toggle-button">
                  <img :src="isFilterPanelOpen ? getAssetsFile('icon/filter_close.svg') : getAssetsFile('icon/filter_open.svg')" alt="Toggle Filters" class="filter-toggle-icon">
                </button>
              </div>
            </div>
            
            <div class="filter-controls" :class="{ 'is-open': isFilterPanelOpen }">
              <div class="filter-content-wrapper">
                <div class="filter-group">
                  <span class="filter-label">{{ t('characterSelector.attackTypeLabel') }}</span>
                  <button @click="selectFilter('attackType', null)" :class="{ active: selectedAttackType.length === 0 }">{{ t('common.all') }}</button>
                  <button v-for="type in attackTypes" :key="type" @click="selectFilter('attackType', type)" :class="{ active: selectedAttackType.includes(type), 'has-icon': true }">
                    <div class="type-icon-wrapper" :class="`type-bg-${type.toLowerCase()}`">
                      <img :src="getAssetsFile(`icon/Type_Attack_s.webp`)" alt="Attack Icon" class="type-icon">
                    </div>
                    <span>{{ t(`attackType.${type}`) }}</span>
                  </button>
                </div>
                <div class="filter-group">
                  <span class="filter-label">{{ t('characterSelector.defenseTypeLabel') }}</span>
                  <button @click="selectFilter('defenseType', null)" :class="{ active: selectedDefenseType.length === 0 }">{{ t('common.all') }}</button>
                  <button v-for="type in defenseTypes" :key="type" @click="selectFilter('defenseType', type)" :class="{ active: selectedDefenseType.includes(type), 'has-icon': true }">
                    <div class="type-icon-wrapper" :class="`type-bg-${type.toLowerCase()}`">
                      <img :src="getAssetsFile(`icon/Type_Defense_s.webp`)" alt="Defense Icon" class="type-icon">
                    </div>
                    <span>{{ t(`defenseType.${type}`) }}</span>
                  </button>
                </div>
                <div class="filter-group">
                  <span class="filter-label">{{ t('characterSelector.schoolLabel') }}</span>
                  <button @click="selectFilter('school', null)" :class="{ active: selectedSchool.length === 0 }">{{ t('common.all') }}</button>
                  <button v-for="school in schools" :key="school" @click="selectFilter('school', school)" :class="{ active: selectedSchool.includes(school), 'has-icon': true }">
                    <img v-if="school !== 'ETC'" :src="getSchoolIconUrl(school)" :alt="school" class="school-icon" />
                    <span>{{ t(`schoolAbbr.${school}`) }}</span>
                  </button>
                </div>
                <div class="filter-group">
                  <span class="filter-label">{{ t('characterSelector.weaponLabel') }}</span>
                  <button @click="selectFilter('weapon', null)" :class="{ active: selectedWeapon.length === 0 }">{{ t('common.all') }}</button>
                  <button v-for="type in weaponTypes" :key="type" @click="selectFilter('weapon', type)" :class="{ active: selectedWeapon.includes(type) }">
                    <span class="nexon-font">{{ type }}</span>
                  </button>
                </div>
                <div class="filter-group">
                  <span class="filter-label">{{ t('characterSelector.positionLabel') }}</span>
                  <button @click="selectFilter('position', null)" :class="{ active: selectedPosition.length === 0 }">{{ t('common.all') }}</button>
                  <button v-for="type in positionTypes" :key="type.value" @click="selectFilter('position', type.value)" :class="{ active: selectedPosition.includes(type.value) }">
                    <span class="nexon-font">
                      <span :class="`position-type-${type.label.toLowerCase()}`">{{ type.label }}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div class="character-grid">
              <div 
                v-for="char in filteredCharacters" 
                :key="char.id" 
                class="character-item"
                @click="selectCharacter(char.id)"
              >
                <ImageWithLoader
                  :src="getAvatarUrl(char.id)"
                  :alt="char.name"
                  class="item-avatar"
                />
                <span class="item-name">{{ char.name }}</span>
              </div>
              <div v-if="filteredCharacters.length === 0" class="no-results">
                {{ t('characterSelector.noResults') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { getAssetsFile } from '@/utils/getAssetsFile';
import { getAvatarUrl } from '@/utils/getAvatarUrl';
import { getSchoolIconUrl } from '@/utils/getSchoolIconUrl';
import ImageWithLoader from '../ui/ImageWithLoader.vue';
import { useEscapeKey } from '@/composables/useEscapeKey.js';

const { t } = useI18n();
const props = defineProps({
  characters: {
    type: Array,
    required: true
  },
  isVisible: { type: Boolean, default: false }
});

const emit = defineEmits(['select', 'close']);

const searchTerm = ref('');
const selectedAttackType = ref([]);
const selectedDefenseType = ref([]);
const selectedSchool = ref([]);
const selectedWeapon = ref([]);
const selectedPosition = ref([]);
const isFilterPanelOpen = ref(false);

const filterRefs = {
  attackType: selectedAttackType,
  defenseType: selectedDefenseType,
  school: selectedSchool,
  weapon: selectedWeapon,
  position: selectedPosition
};

const getUniqueSortedValues = (key) => {
  if (!props.characters) return [];
  return [...new Set(props.characters.map(c => c[key]))].sort();
};

const attackTypes = computed(() => getUniqueSortedValues('attackType'));
const defenseTypes = computed(() => getUniqueSortedValues('defenseType'));
const schools = computed(() => getUniqueSortedValues('school'));
const weaponTypes = computed(() => getUniqueSortedValues('weapon'));

const positionTypes = [
  { value: 0, label: 'STRIKER' },
  { value: 1, label: 'SPECIAL' }
];

const resetFilters = () => {
  selectedAttackType.value = [];
  selectedDefenseType.value = [];
  selectedSchool.value = [];
  selectedWeapon.value = [];
  selectedPosition.value = [];
  searchTerm.value = '';
};

const close = () => {
  emit('close');
};

const { isVisible } = toRefs(props);
useEscapeKey(isVisible, close);

const toggleFilterPanel = () => {
  isFilterPanelOpen.value = !isFilterPanelOpen.value;
};

const selectFilter = (filterType, value) => {
  const targetRef = filterRefs[filterType];
  if (!targetRef) return;

  if (value === null) {
    // "All" button clicked, clear the array
    targetRef.value = [];
  } else {
    const index = targetRef.value.indexOf(value);
    if (index > -1) {
      // Item is already selected, remove it
      targetRef.value.splice(index, 1);
    } else {
      // Item is not selected, add it
      targetRef.value.push(value);
    }
  }
};

const selectCharacter = (id) => {
  emit('select', id);
};

const filterConfigs = [
  { selected: selectedAttackType, key: 'attackType' },
  { selected: selectedDefenseType, key: 'defenseType' },
  { selected: selectedSchool, key: 'school' },
  { selected: selectedWeapon, key: 'weapon' },
  { selected: selectedPosition, key: 'position', getValue: (char) => char.position[0] }
];

const filteredCharacters = computed(() => {
  const lowerCaseSearch = searchTerm.value.toLowerCase();

  return props.characters.filter(char => {
    const dropdownsMatch = filterConfigs.every(config => {
      const { selected, key, getValue } = config;
      if (selected.value.length === 0) return true;
      const charValue = getValue ? getValue(char) : char[key];
      return selected.value.includes(charValue);
    });

    const searchMatch = !searchTerm.value ||
      char.name.toLowerCase().includes(lowerCaseSearch) ||
      (char.nicknames && char.nicknames.some(nick => nick.toLowerCase().includes(lowerCaseSearch)));

    return dropdownsMatch && searchMatch;
  });
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #f8f9fa;
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 25px rgba(0,0,0,0.4);
  /* border: 1px solid #dee2e6; */
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dark-mode .modal-content {
  background: #1a2b40;
  border-color: #2a4a6e;
  color: #e0e6ed;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(45deg, #87CEEB, #6495ED);
  color: white;
  border-radius: 15px 15px 0 0;
}

.dark-mode .modal-header {
  background: linear-gradient(45deg, #2a7fff, #00aeef);
  border-bottom-color: #2a4a6e;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.close-button:hover { opacity: 1; }

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.search-and-reset {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  flex-grow: 1; /* Take up available space */
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.search-input {
  width: 100%;
}
.dark-mode .search-input {
  background-color: #1f3048;
  border-color: #2a4a6e;
  color: #e0e6ed;
}

.filter-controls {
  margin: 15px 0;
  border-bottom: 1px solid #dee2e6;
  display: grid;
  grid-template-rows: 1fr; /* Default to open on desktop */
  opacity: 1; /* Default to visible on desktop */
  margin-bottom: 15px; /* Default margin on desktop */
  /* Transition for grid-template-rows, opacity, margin-bottom, and border-bottom-width */
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              margin-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1), /* Animate external margin */
              border-bottom-width 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Animate border */
  overflow: hidden;
}

.dark-mode .filter-controls {
  border-bottom-color: #2a4a6e;
}

/* New wrapper for filter content to ensure proper collapse */
.filter-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Internal gap */
  padding-bottom: 15px; /* Internal padding */
  min-height: 0; /* Important for grid-template-rows: 0fr to work with flex children */
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-label {
  font-weight: bold;
  margin-right: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.reset-button {
  /* Inherit some styles from filter buttons for consistency */
  padding: 10px 15px;
  border: 1px solid transparent;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  white-space: nowrap;
  
  /* Specific reset button colors */
  background: linear-gradient(45deg, #ff6b6b, #e74c3c); /* Lighter red to current red */
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  transform: translateY(0); /* Initial state for transform */
}

.reset-button:hover {
  background: linear-gradient(45deg, #ff4d4d, #d63031); /* Slightly darker/more vibrant on hover */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* More pronounced shadow */
  transform: translateY(-2px); /* Lift effect */
}

.reset-button:active {
  background: linear-gradient(45deg, #d63031, #c02a2a); /* Even darker on click */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Smaller shadow to simulate press */
  transform: translateY(0); /* Press down effect */
}

/* Dark mode adjustments for the reset button */
.dark-mode .reset-button {
  background: linear-gradient(45deg, #e74c3c, #c0392b); /* Darker red gradient for dark mode */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}
.dark-mode .filter-label {
  color: #c0c8d0;
}

.filter-toggle-button {
  display: none; /* Hidden by default on desktop */
  padding: 0;
  background: linear-gradient(45deg, #87CEEB, #6495ED);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.filter-toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.filter-toggle-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1); /* Make icon white */
}

.dark-mode .filter-toggle-button {
  background: linear-gradient(45deg, #2a7fff, #00aeef);
}

.filter-group button {
  padding: 5px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 15px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}
.filter-group button.has-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 8px;
}
.dark-mode .reset-button:hover {
  background: linear-gradient(45deg, #c0392b, #a93226); /* Even darker on hover in dark mode */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
.dark-mode .reset-button:active {
  background: linear-gradient(45deg, #a93226, #922b20);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark-mode .filter-group button { background-color: #1f3048; border-color: #2a4a6e; color: #e0e6ed; }
.filter-group button:hover { background-color: #e9ecef; border-color: #6495ed; }
.dark-mode .filter-group button:hover { background-color: #2a4a6e; border-color: #00aeef; }
.filter-group button.active { background-color: #6495ed; color: white; border-color: #6495ed; font-weight: bold; }
.dark-mode .filter-group button.active { background-color: #00aeef; border-color: #00aeef;
}

.type-icon-wrapper {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.type-icon {
  width: 12px;
  height: 12px;
  object-fit: contain;
}

.school-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.filter-group button .school-icon {
  /* Default in light mode (inactive button) */
  filter: invert(1);
}

.filter-group button.active .school-icon {
  /* Light mode (active button) */
  filter: none;
}

.dark-mode .filter-group button .school-icon {
  /* Dark mode (both active and inactive buttons) */
  filter: none;
}

.type-bg-explosive, .type-bg-light {
  background: #a70c19;
}
.type-bg-piercing, .type-bg-heavy {
  background: #b26d1f;
}
.type-bg-mystic, .type-bg-special {
  background: #216f9c;
}
.type-bg-sonic, .type-bg-elastic {
  background: #9431a5;
}

.nexon-font {
  font-family: 'NEXON Football Gothic', sans-serif;
  font-style: italic;
  font-weight: 300;
  margin-right: 4px;
}

.position-type-striker {
  color: #cc1a25;
}

.position-type-special {
  color: #006bff;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}

.character-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s, transform 0.2s;
}
.dark-mode .character-item:hover { background-color: #1f3048; }
.character-item:hover { background-color: #e9ecef; transform: translateY(-3px); }

.item-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #6495ED;
  margin-bottom: 8px;
}
.dark-mode .item-avatar { border-color: #00aeef; }

.item-name { font-weight: bold; font-size: 0.9rem; }

.no-results {
  grid-column: 1 / -1; /* Span all columns */
  text-align: center;
  padding: 20px; color: #7f8c8d;
}

/* Transition */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .filter-toggle-button {
    display: flex; /* Show on mobile */
  }

  .filter-controls {
    /* Collapsed by default on mobile */
    grid-template-rows: 0fr;
    opacity: 0;
    margin-bottom: 0;
    border-bottom-width: 0;
  }

  .filter-controls.is-open {
    /* Expanded state on mobile */
    grid-template-rows: 1fr;
    opacity: 1;
    margin-bottom: 15px;
    border-bottom-width: 1px; /* Re-enable border when open on mobile */
  }
}
</style>
