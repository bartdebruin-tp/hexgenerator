<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSampleStore } from '@/stores/sample'
import { useCounter } from '@/composables/useCounter'
import TypeScriptExample from '@/components/TypeScriptExample.vue'

// Type-safe reactive data
const message = ref<string>('Hello Vue with TypeScript!')

// Store gebruiken
const sampleStore = useSampleStore()

// Composable gebruiken met TypeScript
const { 
  count, 
  doubleCount, 
  increment, 
  decrement, 
  reset, 
  isAtMin, 
  isAtMax 
} = useCounter({ 
  min: 0, 
  max: 50, 
  step: 1, 
  initialValue: 5 
})

// Methods met explicit typing
const updateMessage = (newMessage: string): void => {
  message.value = newMessage
}

// Event handlers for child component
const handleComponentIncrement = (): void => {
  console.log('Component increment event received!')
}

const handleComponentClick = (event: MouseEvent): void => {
  console.log('Component clicked:', event)
}

const handleCountUpdate = (newCount: number): void => {
  // Update composable count
  // count is readonly van de composable
  console.log('Count update received:', newCount)
}

// Lifecycle hooks
onMounted(() => {
  console.log('Component gemount met TypeScript!')
  console.log('Initial counter state:', { count: count.value, doubleCount: doubleCount.value })
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">
          {{ message }}
        </h1>
        
        <div class="text-center space-y-4">
          <p class="text-xl text-gray-600">
            Count: <span class="font-semibold text-blue-600">{{ count }}</span>
          </p>
          
          <p class="text-lg text-gray-600">
            Double Count: <span class="font-semibold text-green-600">{{ doubleCount }}</span>
          </p>

          <p class="text-sm text-gray-500">
            Composable Status: Min={{ isAtMin }}, Max={{ isAtMax }}
          </p>
          
          <p class="text-lg text-gray-600">
            Sample Store Name: <span class="font-semibold text-purple-600">{{ sampleStore.sampleName }}</span>
          </p>
          
          <div class="space-x-4 mb-6">
            <button 
              @click="increment"
              :disabled="isAtMax"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
            >
              Increment
            </button>

            <button 
              @click="decrement"
              :disabled="isAtMin"
              class="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
            >
              Decrement
            </button>

            <button 
              @click="reset"
              class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reset
            </button>
            
            <button 
              @click="updateMessage('Updated with TypeScript!')"
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Update Message
            </button>
          </div>

          <!-- TypeScript Component Example -->
          <div class="mt-8 border-t pt-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">
              TypeScript Component Voorbeeld
            </h2>
            
            <TypeScriptExample
              title="Typed Component"
              :count="count"
              :is-visible="true"
              @increment="handleComponentIncrement"
              @click="handleComponentClick"
              @update:count="handleCountUpdate"
            >
              <template #button-text>
                TS Increment
              </template>
              
              <template #description="{ count: componentCount }">
                <p>Dit is een typed component met count: {{ componentCount }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  Store info: {{ sampleStore.getSampleInfo }}
                </p>
              </template>
            </TypeScriptExample>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Aangepaste styles kunnen hier worden toegevoegd */
</style>
