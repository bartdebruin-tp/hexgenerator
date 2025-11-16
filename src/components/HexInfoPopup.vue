<script setup lang="ts">
import { computed } from 'vue'
import type { Hex } from '@/types/hex'
import { XMarkIcon, MapPinIcon } from '@heroicons/vue/24/solid'

interface Props {
  hex: Hex | null
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const dangerLevelText = computed(() => {
  if (!props.hex) return ''
  const level = props.hex.danger.level
  return level.charAt(0).toUpperCase() + level.slice(1)
})

const dangerLevelClass = computed(() => {
  if (!props.hex) return ''
  switch (props.hex.danger.level) {
    case 'safe':
      return 'text-green-600 bg-green-100'
    case 'unsafe':
      return 'text-orange-600 bg-orange-100'
    case 'risky':
      return 'text-red-600 bg-red-100'
    case 'deadly':
      return 'text-red-900 bg-red-200'
    default:
      return 'text-gray-600 bg-gray-100'
  }
})

const locationTypeText = computed(() => {
  if (!props.hex?.location) return ''
  const type = props.hex.location.type
  return type.charAt(0).toUpperCase() + type.slice(1)
})

const locationIconClass = computed(() => {
  if (!props.hex?.location) return ''
  switch (props.hex.location.type) {
    case 'landmark':
      return 'text-blue-500'
    case 'settlement':
      return 'text-green-500'
    case 'lair':
      return 'text-red-500'
    case 'dungeon':
      return 'text-purple-500'
    default:
      return 'text-gray-500'
  }
})

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="isVisible && hex"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="emit('close')"
    >
      <div 
        class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
        @click.stop
      >
        <!-- Close button -->
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>

        <!-- Header -->
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">Hex Information</h2>
          <p class="text-sm text-gray-500">{{ hex.id }}</p>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <!-- Coordinates -->
          <div class="border-b pb-3">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Coordinates</h3>
            <p class="text-lg font-mono">
              Q: <span class="font-bold text-blue-600">{{ hex.coordinates.q }}</span>,
              R: <span class="font-bold text-blue-600">{{ hex.coordinates.r }}</span>
            </p>
          </div>

          <!-- Terrain -->
          <div class="border-b pb-3">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Terrain</h3>
            <div class="flex items-center gap-3">
              <div 
                class="w-12 h-12 rounded-lg shadow-inner border border-gray-300"
                :style="{ backgroundColor: hex.terrain.color }"
              ></div>
              <div>
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  {{ hex.terrainType }}
                </p>
                <p class="font-semibold text-gray-800">{{ hex.terrain.name }}</p>
                <p class="text-sm text-gray-600">
                  Movement Cost: <span class="font-medium">{{ hex.terrain.movementCost }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Danger Level -->
          <div class="border-b pb-3">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Danger Level</h3>
            <div class="flex items-center gap-2">
              <span 
                class="px-3 py-1 rounded-full text-sm font-semibold"
                :class="dangerLevelClass"
              >
                {{ dangerLevelText }}
              </span>
              <span class="text-gray-500 text-sm">(Roll: {{ hex.danger.roll }})</span>
            </div>
          </div>

          <!-- Location -->
          <div v-if="hex.location" class="border-b pb-3">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Location</h3>
            <div class="flex items-start gap-3">
              <MapPinIcon class="w-8 h-8" :class="locationIconClass" />
              <div>
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  {{ locationTypeText }}
                </p>
                <p class="font-semibold text-gray-800 text-lg">
                  {{ hex.location.name }}
                </p>
                <p v-if="hex.location.mainBuilding" class="text-sm text-gray-600 mt-1">
                  Main Building: <span class="font-medium">{{ hex.location.mainBuilding }}</span>
                </p>
              </div>
            </div>
          </div>
          <div v-else class="border-b pb-3">
            <h3 class="text-sm font-semibold text-gray-600 mb-2">Location</h3>
            <p class="text-gray-400 italic">No special location</p>
          </div>

          <!-- Created At -->
          <div>
            <h3 class="text-sm font-semibold text-gray-600 mb-1">Created</h3>
            <p class="text-sm text-gray-500">{{ formatDate(hex.createdAt) }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 pt-4 border-t">
          <button
            @click="emit('close')"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .bg-white,
.fade-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-enter-from .bg-white {
  transform: scale(0.95);
  opacity: 0;
}

.fade-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>
