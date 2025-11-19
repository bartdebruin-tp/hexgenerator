/**
 * Composable Interfaces
 */

import type { Ref } from 'vue'

// Counter composable
export interface UseCounterOptions {
  min?: number
  max?: number
  step?: number
  initialValue?: number
}

export interface UseCounterReturn {
  count: Ref<number>
  doubleCount: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
  set: (value: number) => void
  isAtMin: Ref<boolean>
  isAtMax: Ref<boolean>
}

// API composable
export interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: () => Promise<void>
}
