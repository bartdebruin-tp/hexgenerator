import { ref, computed, watch, type Ref } from 'vue'
import type { UseCounterOptions, UseCounterReturn } from '../interfaces/composables'

export type { UseCounterOptions, UseCounterReturn }

/**
 * Composable voor counter functionaliteit met TypeScript
 * Dit is een voorbeeld van Vue 3.5 Composition API met volledige type safety
 */
export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const {
    min = 0,
    max = 100,
    step = 1,
    initialValue = 0
  } = options

  // Reactive state met expliciete typing
  const count = ref<number>(Math.max(min, Math.min(max, initialValue)))

  // Computed properties met type inference
  const doubleCount = computed(() => count.value * 2)
  const isAtMin = computed(() => count.value <= min)
  const isAtMax = computed(() => count.value >= max)

  // Actions met type safety
  const increment = (): void => {
    if (count.value < max) {
      count.value += step
    }
  }

  const decrement = (): void => {
    if (count.value > min) {
      count.value -= step
    }
  }

  const reset = (): void => {
    count.value = initialValue
  }

  const set = (value: number): void => {
    count.value = Math.max(min, Math.min(max, value))
  }

  // Watcher voor debugging
  watch(count, (newValue: number, oldValue: number) => {
    console.log(`Counter changed from ${oldValue} to ${newValue}`)
  })

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset,
    set,
    isAtMin,
    isAtMax
  }
}