<script setup lang="ts">
import { ref, computed, watch, onMounted, withDefaults } from 'vue'

interface Props {
  title: string
  count?: number
  isVisible?: boolean
}

interface Emits {
  (e: 'increment'): void
  (e: 'update:count', value: number): void
  (e: 'click', event: MouseEvent): void
}

// Props met default waarden
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isVisible: true
})

// Emits definitie
const emit = defineEmits<Emits>()

// Local reactive state
const localCount = ref<number>(props.count)
const isHovered = ref<boolean>(false)

// Computed properties met type inference
const displayText = computed(() => 
  `${props.title}: ${localCount.value}`
)

const buttonClass = computed(() => [
  'px-4 py-2 rounded-lg transition-colors duration-200',
  {
    'bg-blue-500 hover:bg-blue-600 text-white': props.isVisible,
    'bg-gray-300 text-gray-500 cursor-not-allowed': !props.isVisible,
    'transform scale-105': isHovered.value
  }
])

// Methods met expliciete typing
const handleIncrement = (event?: MouseEvent): void => {
  localCount.value++
  emit('increment')
  emit('update:count', localCount.value)
  if (event) {
    emit('click', event)
  }
}

const handleMouseEnter = (): void => {
  isHovered.value = true
}

const handleMouseLeave = (): void => {
  isHovered.value = false
}

// Watch met types
watch(() => props.count, (newVal: number) => {
  localCount.value = newVal
})

// Lifecycle hooks
onMounted(() => {
  console.log('TypeScript component mounted!')
})
</script>

<template>
  <div 
    v-if="isVisible" 
    class="p-4 border rounded-lg bg-white shadow-sm"
  >
    <h3 class="text-lg font-semibold mb-2">{{ displayText }}</h3>
    
    <button
      :class="buttonClass"
      :disabled="!isVisible"
      @click="handleIncrement"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <slot name="button-text">
        Increment
      </slot>
    </button>
    
    <div class="mt-2 text-sm text-gray-600">
      <slot name="description" :count="localCount">
        <p>Current count: {{ localCount }}</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.button-hover {
  @apply transform transition-transform duration-150;
}

.button-hover:hover {
  @apply scale-105;
}
</style>